import { procedure as racelistProcedure } from "./racelist.ts";
import { procedure as calendarProcedure } from "./calendar.ts";
import {
  raceResultHeader,
  raceHeader,
  procedure as resultProcedure,
} from "./result.ts";
import { CSVWriter } from "https://deno.land/x/csv@v0.5.1/mod.ts";
import { existsSync } from "https://deno.land/std/fs/mod.ts";

const writeHorseDataCsv = async (
  writer: CSVWriter,
  csv: string[][],
) => {
  for (const row of csv) {
    for (const col of row) {
      await writer.writeCell(col);
    }
    await writer.nextLine();
  }
};

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

if (Deno.args.length !== 2) {
  throw new Error(
    "usage: deno run --allow-net --allow-write ./src/main.ts <year> <month>",
  );
}
const year = Deno.args[0];
const month = Deno.args[1];

if (!existsSync(`./out/${year}${month}`)) {
  Deno.mkdirSync(`./out/${year}${month}`);
}

const eventDates = await calendarProcedure(year, month);
const raceIds = (await Promise.all(
  eventDates.map(async (eventDate) => await racelistProcedure(eventDate)),
)).flat(2);

const openOption = {
  write: true,
  create: true,
  truncate: true,
}

const csvOption = {
  columnSeparator: ",",
  lineSeparator: "\r\n",
}
// file書き込み準備
const raceF = await Deno.open("./out/race.csv", openOption)
const resultF = await Deno.open("./out/raceResult.csv", openOption);

const raceWriter = new CSVWriter(raceF, csvOption)
const resultWriter = new CSVWriter(resultF, csvOption);

// Header行の書き込み
writeHorseDataCsv(raceWriter, raceHeader)
writeHorseDataCsv(resultWriter, raceResultHeader);

for (const id of raceIds) {
  if (!id) continue;

  console.log(`processing raceId: ${id}`);
  const [race, result] = await resultProcedure(id);

  await writeHorseDataCsv(raceWriter, race)
  await writeHorseDataCsv(resultWriter, result);
  await sleep(500);
}

console.log("process finished!")