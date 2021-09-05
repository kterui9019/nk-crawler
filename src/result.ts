import { HTMLDocument } from "https://deno.land/x/deno_dom/deno-dom-wasm.ts";
import { fetchDom, recurNode } from "./util.ts";
import { selectors } from "./selectors.ts";

const selectHeader = (dom: HTMLDocument): string[] => {
  const header = dom.querySelectorAll(selectors.result.header());
  return Array.from(header).map((node) => recurNode(node).trim() || "");
};

const selectBody = (dom: HTMLDocument): string[][] => {
  const rows = dom.querySelectorAll(selectors.result.rows());
  return Array.from(rows).map((_, idx) => {
    const tds = dom.querySelectorAll(selectors.result.cols(idx));

    const texts = Array.from(tds).map((td) => {
      return recurNode(td).trim() || "";
    });
    return texts;
  });
};

export const procedure = async (raceId: string): Promise<string[][]> => {
  const dom = await fetchDom(
    `https://race.netkeiba.com/race/result.html?race_id=${raceId}`,
    "euc-jp",
  );
  return [selectHeader(dom), ...selectBody(dom)];
};
