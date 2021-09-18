import { v4 } from "https://deno.land/std@0.106.0/uuid/mod.ts";
import { HTMLDocument } from "https://deno.land/x/deno_dom/deno-dom-wasm.ts";
import { fetchDom, recurNode } from "./util.ts";
import { selectors } from "./selectors.ts";

const selectBody =  (
  dom: HTMLDocument,
  raceId: string,
): string[][] => {
  const results = dom.querySelectorAll(selectors.shutuba.rows());

  const csv: string[][] = [];

  for (let idx = 0; idx < results.length; idx++) {
    const row = [raceId];
    const tds = dom.querySelectorAll(selectors.shutuba.cols(idx));

    for (let _idx = 0; _idx < tds.length; _idx++) {
      let element;
      if (_idx === 3) { // horseName
        element =
          dom.querySelector(selectors.shutuba.horse(idx + 1))?.attributes.href
            .substr(-10) || "";
      } else if (_idx === 6) { // jockey
        element =
          dom.querySelector(selectors.shutuba.jockey(idx + 1))?.attributes.href
            .substr(-6).substr(0, 5) || "";
      } else if (_idx === 7) { // trainer
        element =
          dom.querySelector(selectors.shutuba.trainer(idx + 1))?.attributes.href
            .substr(-6).substr(0, 5) || "";
      } else {
        element = recurNode(tds[_idx]).trim() || "";
      }
      row.push(element);
    }

    // 斤量が数字以外の場合は空文字にする
    if (isNaN(Number(row[6]))) row.splice(6, 1, "");

    // カラム分割 indexが大きい順に処理しないとずれる
    // 重量を2カラムに分割する 458(+10) -> 458, 10
    const weightRegResult = row[9].match(/([0-9]*)\((.*)\)/);
    if (weightRegResult) {
      row.splice(
        9,
        1,
        weightRegResult[1],
        weightRegResult[2].replace("+", ""),
      );
    }

    // 性齢を2カラムに分割する 牝3 -> 牝, 3
    const sexAgeRegResult = row[5].match(/(牡|牝|セ)([0-9])/);
    if (sexAgeRegResult) {
      row.splice(5, 1, sexAgeRegResult[1], sexAgeRegResult[2]);
    }

		// 不要データの削除
		row.splice(3, 1)
		row.splice(11, 4)

    csv.push(row);
  }

  return csv;
};

export const procedure = async (
  raceId: string,
) => {
  const dom = await fetchDom(
    `https://race.netkeiba.com/race/shutuba.html?race_id=${raceId}`,
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

  // 芝: 良, ダ: 良 -> 良/良
  if (raceData1 && raceData1.length === 5) {
    const going = `${raceData1[3]}/${raceData1[4]}`;
    raceData1.splice(3, 2, going);
  }

  // 芝1200m(右 外) -> 芝,1200,右 外
  if (raceData1) {
    const corseRegResult = raceData1[1].match(/(芝|ダ|障)([0-9]*)m\s\((.*)\)/);
    if (corseRegResult) {
      raceData1?.splice(
        1,
        1,
        corseRegResult[1],
        corseRegResult[2],
        corseRegResult[3],
      );
    }
  }

  const raceData2 = dom
    .querySelector(selectors.result.raceData2())
    ?.textContent.split("\n")
    .map((el) =>
      el.trim().replace("\n", "").replace("本賞金:", "").replace("万円", "").replace(
        "回",
        "",
      ).replace("頭", "").replace("日目", "")
    )
    .filter((el) => el !== "")
    .map((el) => el.split(","))
    .flat(2);
  if (raceData2?.length === 12) raceData2.splice(5, 0, "");

  if (!raceName || !raceDate || !raceData1 || !raceData2) return [];

  return [[raceId, raceDate, raceName, ...raceData1, ...raceData2]];
};
