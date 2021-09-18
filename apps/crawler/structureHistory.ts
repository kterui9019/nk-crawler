import { DB } from "https://deno.land/x/sqlite@v3.1.1/mod.ts";

type HorseRace = {
	horseId: string,
	raceId: string,
}
type HorseRaceHistory = {
	horseId: string,
	raceId: string,
	beforeRaceId: string,
}

export const createRaceHistory = (raceResults: HorseRace[]): HorseRaceHistory[] =>
	raceResults.reduce((acc: HorseRaceHistory[], cur: HorseRace, idx: number, _: HorseRace[]) =>
		[...acc, {horseId: cur.horseId, raceId: cur.raceId, beforeRaceId: acc[idx-1]?.raceId}]
	, []).slice(1, raceResults.length)

export const procedure = () => {
	// Open a database
	const db = new DB("./sqlite/nk.db");

	const horseIds = db.query<string[]>(`
		SELECT DISTINCT horse_id
		FROM raceResult
	`).flat(1);

	horseIds.forEach((horseId: string, idx: number) => {
		console.log(`processing: ${horseId} ${idx+1}/${horseIds.length}`)

		const horseRaces = db.query<string[]>(`
			SELECT rr.horse_id, r.id
			FROM raceResult rr
				INNER JOIN race r ON r.id = rr.race_id
			WHERE rr.horse_id = '${horseId}'
			ORDER BY r.date
		`)
		// 過去1回しかレースに出ていない馬に対しては履歴テーブルを構築できない
		if (horseRaces.length < 2) return

		createRaceHistory(horseRaces.map(horseRace => { return {horseId: horseId, raceId: horseRace[1]}}))
			.forEach(({horseId, raceId, beforeRaceId}) => {
				Deno.writeTextFileSync('./out/insertTest.sql', `('${horseId}', '${raceId}', '${beforeRaceId}'),\n`, {create: true, append: true})
			})
	})

	db.close()
}
