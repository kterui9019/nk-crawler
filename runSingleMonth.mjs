#!/usr/bin/env zx
const year = argv.year;
const month = argv.month < 10 ? `0${argv.month}` : argv.month;

await ($`deno run --allow-net --allow-write --allow-read --unstable ./src/crawler/main.ts ${year} ${month}`);

// 指定期間で既にあるデータをDBから削除
await ($`deno run --allow-net --allow-write --allow-read ./src/exchanger/deletePeriod.ts ${year} ${month}`);

await ($`deno run --allow-net --allow-write --allow-read ./src/exchanger/import.ts ./out/race${year}${month}.csv race`);
await ($`deno run --allow-net --allow-write --allow-read ./src/exchanger/import.ts ./out/result${year}${month}.csv raceResult`);