import dayjs from 'https://cdn.skypack.dev/dayjs'; 
import { client } from './db.ts'

const year = Deno.args[0]
const month = Deno.args[1]
if (!year || !month) throw new Error('usage: deno run import.ts <year> <month>')
const lastDay = dayjs(`${year}-${month}`).locale('ja').endOf('month').format("DD");

const sql = `delete from race where id IN (select * from (select id from race where date BETWEEN '${year}-${month}-01' AND '${year}-${month}-${lastDay}') as sub)`;
const res = await client.transaction(async (conn) => 
	await conn.execute(sql)
);
console.log(res);

await client.close();
