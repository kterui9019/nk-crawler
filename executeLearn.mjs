// horseRaceHistoryを再構築
await ($`cd ./apps/historyBuilder && lein run && cd -`)
await ($`mysql -uroot umacopy -e "TRUNCATE TABLE horseRaceHistory"`)
await ($`mysql -uroot --local-infile umacopy -e "LOAD DATA LOCAL INFILE './out/horseRaceHistory.csv'  INTO TABLE horseRaceHistory  FIELDS TERMINATED BY ',' LINES TERMINATED BY '\n'"`);

// 結果を吐き出す
await ($`mysql -uroot umacopy < ./apps/exchanger/select.sql > ./apps/predictor/src/dataset.tsv`)

// 学習
await ($`cd apps/predictor && docker-compose -f docker-compose-learn.yml up --build && docker-compose -f docker-compose-learn.yml rm -fsv && cd -`)