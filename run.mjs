#!/usr/bin/env zx
const years = ["2020"];
const months = [
  "01",
  "02",
  "03",
  "04",
  "05",
  "06",
  "07",
  "08",
  "09",
  "10",
  "11",
  "12",
];

const raceHeader =
  "id,date,name,start_time,cource,distance,direction,weather,going,round,field,day_round,conditions,class,symbol,weight,headage,1st_prize,2nd_prize,3rd_prize,4th_prize,5th_prize";
const raceResultHeader =
  "id,raceId,order,flame,horse_number,horse_id,sex,age,basis_weight,jockey_id,time,finish_diff,popular,odds,furlong,corner_passing_order,trainer_id,horse_weight,horse_weight_diff,前走レースID,前前走レースID";

// write header
const ls = (await ($`ls ./out`)).stdout.split("\n");
if (!ls.includes("race.csv")) {
  await ($`echo ${raceHeader} > ./out/race.csv`);
}
if (!ls.includes("raceResult.csv")) {
  await ($`echo ${raceResultHeader} > ./out/raceResult.csv`);
}

for (const y of years) {
  for (const m of months) {
    await ($
      `deno run --allow-net --allow-write --allow-read --unstable ./src/main.ts ${y} ${m}`);
    await ($`cat ./out/race${y}${m}.csv >> ./out/race.csv`);
    await ($`cat ./out/result${y}${m}.csv >> ./out/raceResult.csv`);
    await ($`rm ./out/race${y}${m}.csv`);
    await ($`rm ./out/result${y}${m}.csv`);
  }
}
