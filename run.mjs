#!/usr/bin/env zx
const years = ["2008", "2009", "2010", "2011", "2012", "2013", "2014", "2015", "2016", "2017", "2018", "2019", "2020", "2021"]
const months = ["01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12"]


// write header
const ls = (await ($`ls ./out`)).stdout.split("\n");
if (!ls.includes("race.csv")) {
  await ($
    `echo "レースID,レース日,レース名,発走時刻,コース,天気,馬場,回数,会場,日数,条件,クラス,記号,負担重量,頭数,1位賞金,2位賞金,3位賞金,4位賞金,5位賞金" > ./out/race.csv`);
}
if (!ls.includes("raceResult.csv")) {
  await ($
    `echo "レースID,着順,枠,馬番,馬名,性齢,斤量,騎手,タイム,着差,人気,単勝オッズ,後3F,コーナー通過順,厩舎,馬体重(増減),前走レースID,前前走レースID" > ./out/raceResult.csv`);
}

for (const y of years) {
  for (const m of months) {
    await ($
      `deno run --allow-net --allow-write --allow-read --unstable ./src/main.ts ${y} ${m}`);
    await ($`cat ./out/race${y}${m}.csv > ./out/race.csv`);
    await ($`cat ./out/result${y}${m}.csv > ./out/raceResult.csv`);
    await ($`rm ./out/race${y}${m}.csv`);
    await ($`rm ./out/result${y}${m}.csv`);
  }
}
