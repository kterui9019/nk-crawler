#!/usr/bin/env zx
const year = argv._[1];
const month = argv._[2] < 10 ? `0${argv._[2]}` : argv._[2];

if (!year || !month) throw new Error('usage: zx runSingleMonth.mjs <year> <month>')

await ($`deno run --allow-net --allow-write --allow-read --unstable ./apps/crawler/main.ts ${year} ${month}`);

// 指定期間で既にあるデータをDBから削除
await ($`deno run --allow-net --allow-write --allow-read ./apps/exchanger/deletePeriod.ts ${year} ${month}`);

// race, raceResultのINSERT
await ($`mysql -uroot --local-infile umacopy -e "LOAD DATA LOCAL INFILE './out/race${year}${month}.csv'  INTO TABLE race FIELDS TERMINATED BY ',' LINES TERMINATED BY '\n'"`);
await ($`mysql -uroot --local-infile umacopy -e "LOAD DATA LOCAL INFILE './out/result${year}${month}.csv'  INTO TABLE raceResult FIELDS TERMINATED BY ',' LINES TERMINATED BY '\n'"`);

// horseRaceHistoryを再構築
await ($`cd ./apps/historyBuilder && lein run && cd -`)
await ($`mysql -uroot umacopy -e "TRUNCATE TABLE horseRaceHistory"`)
await ($`mysql -uroot --local-infile umacopy -e "LOAD DATA LOCAL INFILE './out/horseRaceHistory.csv'  INTO TABLE horseRaceHistory  FIELDS TERMINATED BY ',' LINES TERMINATED BY '\n'"`);

// 結果を吐き出す
await ($`mysql -uroot umacopy < ./apps/exchanger/select.sql > ./apps/predictor/src/dataset.tsv`)

// 学習
await ($`cd apps/predictor && docker-compose up --build && docker-compose rm -fsv && cd -`)