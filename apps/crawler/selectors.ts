export const selectors = {
  result: {
    rows: () => "#All_Result_Table > tbody > tr",
    cols: (row: number) =>
      `#All_Result_Table > tbody > tr:nth-child(${row + 1}) > td`,
    header: () => "#All_Result_Table > thead > tr > th",
    raceName: () =>
      "#page > div.RaceColumn01 > div > div.RaceMainColumn > div.RaceList_NameBox > div.RaceList_Item02 > div.RaceName",
    raceDate: () => "#RaceList_DateList > dd.Active > a",
    raceData1: () =>
      "#page > div.RaceColumn01 > div > div.RaceMainColumn > div.RaceList_NameBox > div.RaceList_Item02 > div.RaceData01",
    raceData2: () =>
      "#page > div.RaceColumn01 > div > div.RaceMainColumn > div.RaceList_NameBox > div.RaceList_Item02 > div.RaceData02",
    horse: (idx: number) =>
      `#All_Result_Table > tbody > tr:nth-child(${idx}) > td.Horse_Info > span > a`,
    jockey: (idx: number) =>
      `#All_Result_Table > tbody > tr:nth-child(${idx}) > td.Jockey > a`,
    trainer: (idx: number) =>
      `#All_Result_Table > tbody > tr:nth-child(${idx}) > td.Trainer > a`,
  },
  shutuba: {
    rows: () => "#page > div.RaceColumn02 > div.RaceTableArea > table > tbody > tr",
    cols: (row: number) =>
      `#page > div.RaceColumn02 > div.RaceTableArea > table > tbody > tr:nth-child(${row + 1}) > td`,
    horse: (idx: number) =>
      `#page > div.RaceColumn02 > div.RaceTableArea > table > tbody > tr:nth-child(${idx}) > td.HorseInfo > div > div > span > a`,
    jockey: (idx: number) =>
      `#page > div.RaceColumn02 > div.RaceTableArea > table > tbody > tr:nth-child(${idx}) > td.Jockey > a`,
    trainer: (idx: number) =>
      `#page > div.RaceColumn02 > div.RaceTableArea > table > tbody > tr:nth-child(${idx}) > td.Trainer > a`,
  },
  calendar: {
    eventDateAnchors: () =>
      "#Netkeiba_RaceTop > div.Wrap.fc > div > div.Main_Column > div.Race_Calendar_Inner > div > div.Race_Calendar_Main > table > tbody > tr > td > a",
  },
  racelist: {
    places: () => `#RaceTopRace > div > dl`,
    races: (idx: number) =>
      `#RaceTopRace > div > dl:nth-child(${idx}) > dd > ul > li`,
    race: (pIdx: number, rIdx: number) =>
      `#RaceTopRace > div > dl:nth-child(${pIdx}) > dd > ul > li:nth-child(${rIdx}) > a:first-child`,
  },
  beforeResult: {
    races: () => "#contents > div.db_main_race.fc > div > table > tbody > tr",
    raceLink: (idx: number) =>
      `#contents > div.db_main_race.fc > div > table > tbody > tr:nth-child(${idx}) > td:nth-child(5) > a`,
    latestRaceLink: () =>
      `#contents > div.db_main_race.fc > div > table > tbody > tr:nth-child(1) > td:nth-child(5) > a`
  },
};
