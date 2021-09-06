import { HTMLDocument } from "https://deno.land/x/deno_dom/deno-dom-wasm.ts";
import { fetchDom, recurNode } from "./util.ts";
import { selectors } from "./selectors.ts";

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
) => {
  const dom = await fetchDom(
    `https://race.netkeiba.com/race/result.html?race_id=${raceId}`,
    "euc-jp",
  );
  return [selectRace(dom, raceId), selectBody(dom, raceId)];
};

export const selectRace = (
  dom: HTMLDocument,
  raceId: string,
): string[][] => {
  const raceName = dom.querySelector(selectors.result.raceName())?.textContent
    .trim();

  const raceDate = dom.querySelector(selectors.result.raceDate())?.attributes.href.match(/kaisai_date=(.*?)&|$/)?.pop();

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

  if (!raceName || !raceDate || !raceData1 || !raceData2) return [];

  return [[raceId, raceDate, raceName, ...raceData1, ...raceData2]];
};
