import { fetchDom } from "./util.ts";
import { selectors } from "./selectors.ts";

export const latestRaceProcedure = async(horseId: string) => {
  const dom = await fetchDom(
    `https://db.netkeiba.com/horse/${horseId}/`,
    "euc-jp",
  );

	return dom.querySelector(selectors.beforeResult.latestRaceLink())
		?.attributes.href.substr(6, 12)
}
export const procedure = async (horseId: string, raceId: string) => {
  const dom = await fetchDom(
    `https://db.netkeiba.com/horse/${horseId}/`,
    "euc-jp",
  );

  const races = dom.querySelectorAll(selectors.beforeResult.races());
  const res = { before1: "", before2: "" };

  races.forEach((_, idx) => {
    const raceLink = dom.querySelector(
      selectors.beforeResult.raceLink(idx + 1),
    );

    if (raceLink?.attributes.href.substr(6, 12) === raceId) {
      res.before1 =
        dom.querySelector(selectors.beforeResult.raceLink(idx + 2))?.attributes
          .href.substr(6, 12) || "";
      res.before2 =
        dom.querySelector(selectors.beforeResult.raceLink(idx + 3))?.attributes
          .href.substr(6, 12) || "";
    }
  });

  return res;
};
