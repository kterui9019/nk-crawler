import { Element } from "https://deno.land/x/deno_dom/deno-dom-wasm.ts";
import { fetchDom } from "./util.ts";
import { selectors } from "./selectors.ts";

export const procedure = async (year: string, month: string) => {
  if (Number(year) < 2008) {
    throw new Error("Does not support races prior to 2008.");
  }

  const dom = await fetchDom(
    `https://race.netkeiba.com/top/calendar.html?year=${year}&month=${month}`,
    "euc-jp",
  );
  const eventDateAnchors = dom.querySelectorAll(
    selectors.calendar.eventDateAnchors(),
  );

  // FIXME: 型がヤバい
  return Array.from(eventDateAnchors).map((anchor) =>
    (anchor as Element).attributes.href.substr(-8)
  );
};
