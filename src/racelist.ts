import { DOMParser } from "https://deno.land/x/deno_dom/deno-dom-wasm.ts";
import { fetchDom } from "./util.ts";
import { selectors } from "./selectors.ts";

export const procedure = async (date: string) => {
  const dom = await fetchDom(
    `https://race.netkeiba.com/top/race_list_sub.html?kaisai_date=${date}`,
    "utf-8",
  );

  const places = dom.querySelectorAll(selectors.racelist.places());
  return Array.from(places).map((_, placeIdx) => {
    const races = dom.querySelectorAll(selectors.racelist.races(placeIdx + 1));

    return Array.from(races).map((_, raceIdx) => {
      const el = dom.querySelector(
        selectors.racelist.race(placeIdx + 1, raceIdx + 1),
      );
      if (el === null) return "";
      return el.attributes.href.match(/race_id=(.*?)&|$/)?.pop();
    });
  });
};
