import { assertEquals } from "https://deno.land/std@0.65.0/testing/asserts.ts";
import { createRaceHistory } from "../structureHistory.ts"

Deno.test("raceHistory配列を返すテスト", () => {
	const expected = [{horseId: "horseId", raceId: "raceId", beforeRaceId: "beforeRaceId"}]
	const actual = createRaceHistory([{horseId: "horseId", raceId:"beforeRaceId"}, {horseId: "horseId", raceId: "raceId"}])

	assertEquals(actual, expected)
})