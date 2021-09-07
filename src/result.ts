import {
  Element,
  HTMLDocument,
} from "https://deno.land/x/deno_dom/deno-dom-wasm.ts";
import { fetchDom, recurNode, sleep } from "./util.ts";
import { selectors } from "./selectors.ts";
import { procedure as beforeResultProcedure } from "./beforeResult.ts"

export const raceHeader = [[
  "レースID",
  "レース日",
  "レース名",
  "発走時刻",
  "コース",
  "天気",
  "馬場",
  "回数",
  "会場",
  "日数",
  "条件",
  "クラス",
  "記号",
  "負担重量",
  "頭数",
  "1位賞金",
  "2位賞金",
  "3位賞金",
  "4位賞金",
  "5位賞金",
]];

export const raceResultHeader = [[
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

const selectBody = async (dom: HTMLDocument, raceId: string): Promise<string[][]> => {
  const results = dom.querySelectorAll(selectors.result.rows());

  const csv: string[][] = []

  for (let idx = 0; idx < results.length; idx++) {
    const row = [raceId] 
    const tds = dom.querySelectorAll(selectors.result.cols(idx));

    for (let _idx = 0; _idx < tds.length; _idx++) {
      const element = _idx === 3
        ? dom.querySelector(selectors.result.horse(idx + 1))?.attributes.href
          .substr(-10) || ""
        : recurNode(tds[_idx]).trim() || "";
      row.push(element)
    }

    const beforeResults = await beforeResultProcedure(row[4], row[0])
    row.push(beforeResults.before1)
    row.push(beforeResults.before2)

    csv.push(row)
    sleep(1000);
  }

  return csv

};

export const procedure = async (
  raceId: string,
) => {
  const dom = await fetchDom(
    `https://race.netkeiba.com/race/result.html?race_id=${raceId}`,
    "euc-jp",
  );
  return [selectRace(dom, raceId), (await selectBody(dom, raceId))];
};

export const selectRace = (
  dom: HTMLDocument,
  raceId: string,
): string[][] => {
  const raceName = dom.querySelector(selectors.result.raceName())?.textContent
    .trim();

  const raceDate = dom.querySelector(selectors.result.raceDate())?.attributes
    .href.match(/kaisai_date=(.*?)&|$/)?.pop();
  const raceData1 = dom
    .querySelector(selectors.result.raceData1())
    ?.textContent.split("/")
    .map((el) =>
      el.trim().replace("\n", "").replace("発走", "").replace("天候:", "").replace(
        "馬場:",
        "",
      )
    );

  const raceData2 = dom
    .querySelector(selectors.result.raceData2())
    ?.textContent.split("\n")
    .map((el) =>
      el.trim().replace("\n", "").replace("本賞金:", "").replace("万円", "")
    )
    .filter((el) => el !== "")
    .map((el) => el.split(","))
    .flat(2);
  if (raceData2?.length === 12) raceData2.splice(5, 0, "");

  if (!raceName || !raceDate || !raceData1 || !raceData2) return [];

  return [[raceId, raceDate, raceName, ...raceData1, ...raceData2]];
};
