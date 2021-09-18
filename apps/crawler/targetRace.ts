import { procedure as resultProcedure } from "./result.ts";
import { latestRaceProcedure } from "./beforeResult.ts";
import { procedure as shutubaProcedure } from "./shutuba.ts"
import { CSVWriter } from "https://deno.land/x/csv@v0.5.1/mod.ts";
import { sleep } from "./util.ts";
import dayjs from 'https://cdn.skypack.dev/dayjs'; 

const header = [
  'horse_number', 'flame','sex','age','basis_weight','jockey_id','trainer_id','horse_weight','horse_weight_diff','date','start_time','cource','distance','direction','weather','going','round','field','day_round','conditions','class','race_weight','headage','1st_prize','r2_order','r2_time','r2_flame','r2_furlong','r2_basis_weight','r2_jockey_id','r2_trainer_id','r2_horse_weight','r2_date','r2_name','r2_start_time','r2_cource','r2_distance','r2_direction','r2_weather','r2_going','r2_round','r2_field','r2_day_round','r2_conditions','r2_class','r2_race_weight','r2_headage','r2_1st_prize','date_diff'
]

const writeCsv = async (
  writer: CSVWriter,
  row: string[],
) => {
	for (const col of row) {
		await writer.writeCell(col);
	}
	await writer.nextLine();
};

const targetBuilder = (race: string[], result: string[], beforeRace: string[], beforeResult: string[]) => {
	return [
		result[2],
		result[1],
		result[4],
		result[5],
		result[6],
		result[7],
		result[8],
		result[9],
		result[10],
		race[1],
		race[3],
		race[4],
		race[5],
		race[6],
		race[7],
		race[8],
		race[9],
		race[10],
		race[11],
		race[12],
		race[13],
		race[15],
		race[16],
		race[17],
		beforeResult[2],
		beforeResult[10],
		beforeResult[3],
		beforeResult[14],
		beforeResult[8],
		beforeResult[9],
		beforeResult[16],
		beforeResult[17],
		beforeRace[1],
		beforeRace[2],
		beforeRace[3],
		beforeRace[4],
		beforeRace[5],
		beforeRace[6],
		beforeRace[7],
		beforeRace[8],
		beforeRace[9],
		beforeRace[10],
		beforeRace[11],
		beforeRace[12],
		beforeRace[13],
		beforeRace[15],
		beforeRace[16],
		beforeRace[17],
		dayjs(race[1]).diff(beforeRace[1], 'days')
	]
}

const f = await Deno.open(`./out/target.csv`, {
  write: true,
  create: true,
  truncate: true,
});
const writer = new CSVWriter(f, {
  columnSeparator: ",",
  lineSeparator: "\r\n",
});
await writeCsv(writer, header)

const raceId = Deno.args[0]
if (!raceId) throw new Error("usaga: deno run targetRace.ts <raceId>")

const [race, result] = await shutubaProcedure(raceId);

for (const res of result) {
	const horseId = res[3]
	const beforeRaceId = await latestRaceProcedure(horseId);

	const [beforeRace, beforeResult] = await resultProcedure(beforeRaceId || '')
	await writeCsv(writer, targetBuilder(race[0], res, beforeRace[0], beforeResult.find(r => r[5] === horseId) || []))
	await sleep(1000)
}
