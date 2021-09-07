import { assertEquals } from "https://deno.land/std@0.65.0/testing/asserts.ts";
import { procedure } from "../src/beforeResult.ts";

Deno.test("指定した馬IDの指定したレースIDから見て過去2回のレースIDが取得できる", async () => {
	const horseId = "2014100686";
  const raceId = "202006010110";

	const expected = {
		before1: "201906050209",
		before2: "201909030511"
	}

	const actual = await (procedure(horseId, raceId))
	assertEquals(actual, expected)
})
