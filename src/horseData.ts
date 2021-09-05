import { DOMParser, HTMLDocument } from "https://deno.land/x/deno_dom/deno-dom-wasm.ts";
import { recurNode, decodeAsText } from "./util.ts"
import { selectors } from "./selectors.ts";
import { writeCSV } from "https://deno.land/x/csv@v0.5.1/mod.ts";


const selectHeader = (dom: HTMLDocument): string[] => {
  const header = dom.querySelectorAll(selectors.header());
  return Array.from(header).map((node) => recurNode(node).trim() || "")
}

const selectBody = (dom: HTMLDocument): string[][] => {
  const rows = dom.querySelectorAll(selectors.rows())
  return Array.from(rows).map((_, idx) => {
    const tds = dom.querySelectorAll(selectors.cols(idx));
    
    const texts = Array.from(tds).map(td => {
      return recurNode(td).trim() || ""
    });
    return texts
  })
}

const writeHorseDataCsv = async (fileName: string, header: string[], body: string[][]) => {
  const f = await Deno.open(`./out/${fileName}.csv`, {write: true, create: true, truncate: true});
  await writeCSV(f, [header, ...body])
  f.close();
}

const procedure = async (raceId: string): Promise<void> => {
  const res = await fetch(
    `https://race.netkeiba.com/race/result.html?race_id=${raceId}`,
  );
  const buf = (await res.arrayBuffer())
  const html = decodeAsText(buf, 'euc-jp').replace(/<img.*?>/g, "");
  const dom = new DOMParser().parseFromString(html, 'text/html');
  if (!dom) throw new Error("Couldn't parse text/html to dom")

  await writeHorseDataCsv(raceId, selectHeader(dom), selectBody(dom))
}

procedure('202006010101')