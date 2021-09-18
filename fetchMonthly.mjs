#!/usr/bin/env zx
const year = argv._[1];
const month = argv._[2] < 10 ? `0${argv._[2]}` : argv._[2];
const withLearn = argv['learning']

if (!year || !month) throw new Error('usage: zx runSingleMonth.mjs <year> <month>')

await ($`deno run --allow-net --allow-write --allow-read --unstable ./apps/crawler/main.ts ${year} ${month}`);

// 指定期間で既にあるデータをDBから削除
await ($`deno run --allow-net --allow-write --allow-read ./apps/exchanger/deletePeriod.ts ${year} ${month}`);

// race, raceResultのINSERT
await ($`mysql -uroot --local-infile umacopy -e "LOAD DATA LOCAL INFILE './out/race${year}${month}.csv'  INTO TABLE race FIELDS TERMINATED BY ',' LINES TERMINATED BY '\n'"`);
await ($`mysql -uroot --local-infile umacopy -e "LOAD DATA LOCAL INFILE './out/result${year}${month}.csv'  INTO TABLE raceResult FIELDS TERMINATED BY ',' LINES TERMINATED BY '\n'"`);

if (withLearn) {
	await ($`zx ./executeLearn.mjs`)
}