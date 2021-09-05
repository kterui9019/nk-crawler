import { assertEquals } from "https://deno.land/std@0.65.0/testing/asserts.ts";
import { procedure } from "../src/racelist.ts";

Deno.test("指定した年月日からレースIDを取得できる", async () => {
  const date = "20200331";

  const expected = [[
    "202006030201",
    "202006030202",
    "202006030203",
    "202006030204",
    "202006030205",
    "202006030206",
    "202006030207",
    "202006030208",
    "202006030209",
    "202006030210",
    "202006030211",
    "202006030212",
  ]];

  const actual = await procedure(date);
  assertEquals(actual, expected);
});
