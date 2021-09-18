import {
  assertEquals,
  assertThrowsAsync,
} from "https://deno.land/std@0.65.0/testing/asserts.ts";
import { procedure } from "../calendar.ts";

Deno.test("指定した年月からレース開催日を取得できる", async () => {
  const PREFIX = "202001";
  const dates = ["05", "06", "11", "12", "13", "18", "19", "25", "26"];
  const expected = dates.map((date) => `${PREFIX}${date}`);

  const actual = await procedure("2020", "01");

  assertEquals(actual, expected);
});

Deno.test("2008年以前のレースは取得できない", () => {
  const fn = async () => await procedure("2007", "12");
  assertThrowsAsync<string[]>(fn, Error);
});
