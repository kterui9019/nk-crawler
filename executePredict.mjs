#!/usr/bin/env zx
const raceId = argv._[1]

if (!raceId) throw new Error('usage: zx executePredict.mjs <raceId>')

await ($`deno run --allow-net --allow-read --allow-write ./apps/crawler/targetRace.ts ${raceId}`)
await ($`cp ./out/target.csv ./apps/predictor/src`)
await ($`cd apps/predictor && docker-compose -f docker-compose-pred.yml up --build && docker-compose -f docker-compose-pred.yml rm -fsv && cd -`)
await ($`cat ./apps/predictor/src/result.csv`)