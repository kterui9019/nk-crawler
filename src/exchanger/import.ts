import { client } from './db.ts'
import { readCSV } from "https://deno.land/x/csv@v0.5.1/mod.ts";

const csvPath = Deno.args[0]
const tableName = Deno.args[1]
if (!csvPath || !tableName) throw new Error('usage: deno run import.ts <csvPath> <tableName>')
console.log(csvPath)
const f = await Deno.open(csvPath);

let sql = `INSERT INTO ${tableName} VALUES `;
let rowCount = 0;

for await (const row of readCSV(f)) {
	const target = []
  for await (const cell of row) {
		// IDは5桁以下なので9999以下かどうかでintを判断している 10000以上のレースや賞金ってないよね・・・？？？
		if (Number(cell) && Number(cell) < 9999) {
			cell === '' ? target.push('null') : target.push(cell)
		} else {
			cell === '' ? target.push('null') : target.push(`'${cell}'`)
		}
  }

	// 基準の列数を入れる 最初の1列目が異常値だったら諦める
	if (rowCount === 0) rowCount = target.length

	if (target.length !== rowCount ) continue
	if (target.length === 0) continue;

	sql += `(${target.join(',')}),`
}
sql = `${sql.slice(0, -1)};`

const res = await client.transaction(async (conn) => 
	await conn.execute(sql)
);
console.log(res);

await client.close();
