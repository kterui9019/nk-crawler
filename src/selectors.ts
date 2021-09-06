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
};
