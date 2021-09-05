import { HTMLDocument } from "https://deno.land/x/deno_dom/deno-dom-wasm.ts";
import { fetchDom, recurNode } from "./util.ts";
import { selectors } from "./selectors.ts";

export const header = [[
  "レースID",
  "着順",
  "枠",
  "馬番",
  "馬名",
  "性齢",
  "斤量",
  "騎手",
  "タイム",
  "着差",
  "人気",
  "単勝オッズ",
  "後3F",
  "コーナー通過順",
  "厩舎",
  "馬体重(増減)",
]];

const selectBody = (dom: HTMLDocument, raceId: string): string[][] => {
  const rows = dom.querySelectorAll(selectors.result.rows());
  return Array.from(rows).map((_, idx) => {
    const tds = dom.querySelectorAll(selectors.result.cols(idx));

    const texts = Array.from(tds).map((td) => {
      return recurNode(td).trim() || "";
    });
    return [raceId, ...texts];
  });
};

export const procedure = async (
  raceId: string,
): Promise<string[][]> => {
  const dom = await fetchDom(
    `https://race.netkeiba.com/race/result.html?race_id=${raceId}`,
    "euc-jp",
  );
  return selectBody(dom, raceId);
};
