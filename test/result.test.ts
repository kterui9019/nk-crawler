import { assertEquals } from "https://deno.land/std@0.65.0/testing/asserts.ts";
import { procedure } from "../src/result.ts";

Deno.test("指定したレースIDの結果が取得できる", async () => {
  const raceId = "202006010101";
  const [raceExpected, resultExpected] = [[[
    "202006010101",
    "20200105",
    "3歳未勝利",
    "09:55",
    "ダ1200m (右)",
    "晴",
    "良",
    "1回",
    "中山",
    "1日目",
    "サラ系３歳",
    "未勝利",
    "牝[指]",
    "馬齢",
    "16頭",
    "510",
    "200",
    "130",
    "77",
    "51",
  ]], 
    [
      [
        "202006010101", "1",
        "4",            "7",
        "2017101464",   "牝3",
        "54.0",         "伊藤",
        "1:13.3",       "",
        "2",            "3.6",
        "38.9",         "5-5",
        "美浦金成",         "460(+2)",
        "201905040703", ""
      ],
      [
        "202006010101", "2",
        "1",            "1",
        "2017103291",   "牝3",
        "54.0",         "柴田善",
        "1:13.3",       "クビ",
        "5",            "17.2",
        "38.0",         "12-11",
        "美浦林",          "432(+4)",
        "201906050306", ""
      ],
      [
        "202006010101", "3",
        "2",            "3",
        "2017103186",   "牝3",
        "54.0",         "岩部",
        "1:13.7",       "2.1/2",
        "12",           "199.0",
        "38.7",         "9-9",
        "美浦萱野",         "458(0)",
        "201903020501", "201907030206"
      ],
      [
        "202006010101", "4",
        "3",            "6",
        "2017103154",   "牝3",
        "54.0",         "武士沢",
        "1:13.8",       "クビ",
        "8",            "50.4",
        "39.2",         "6-6",
        "美浦星野",         "418(0)",
        "201906050401", "201905050601"
      ],
      [
        "202006010101", "5",
        "6",            "12",
        "2017105401",   "牝3",
        "54.0",         "マーフ",
        "1:13.8",       "クビ",
        "1",            "1.6",
        "39.7",         "4-4",
        "美浦加藤征",        "536(-2)",
        "201905050701", "201905050105"
      ],
      [
        "202006010101", "6",
        "7",            "13",
        "2017104956",   "牝3",
        "54.0",         "北村宏",
        "1:13.9",       "クビ",
        "9",            "74.3",
        "39.9",         "2-3",
        "美浦伊藤大",        "428(+8)",
        "201905040301", "201906040803"
      ],
      [
        "202006010101", "7",
        "7",            "14",
        "2017109160",   "牝3",
        "54.0",         "内田博",
        "1:14.2",       "2",
        "11",           "121.7",
        "39.6",         "6-8",
        "美浦深山",         "424(0)",
        "201905040601", "201904030202"
      ],
      [
        "202006010101", "8",
        "3",            "5",
        "2017103287",   "牝3",
        "52.0",         "△菅原明",
        "1:14.4",       "1.1/4",
        "10",           "82.2",
        "39.1",         "12-13",
        "美浦武市",         "460(-2)",
        "201906050301", "201903030101"
      ],
      [
        "202006010101", "9",
        "5",            "10",
        "2017104634",   "牝3",
        "54.0",         "大野",
        "1:14.7",       "2",
        "6",            "28.8",
        "40.7",         "2-2",
        "美浦畠山",         "434(0)",
        "201906050601", "201904030601"
      ],
      [
        "202006010101", "10",
        "5",            "9",
        "2017100847",   "牝3",
        "51.0",         "▲藤田菜",
        "1:14.8",       "1/2",
        "3",            "9.5",
        "40.9",         "1-1",
        "美浦尾形",         "438(0)",
        "201906050601", "201906050206"
      ],
      [
        "202006010101", "11",
        "2",            "4",
        "2017102095",   "牝3",
        "53.0",         "☆菊沢",
        "1:14.9",       "1/2",
        "4",            "14.5",
        "40.2",         "6-6",
        "美浦菊沢",         "464(+10)",
        "201903030304", "201906040702"
      ],
      [
        "202006010101", "12",
        "1",            "2",
        "2017101861",   "牝3",
        "54.0",         "三浦",
        "1:14.9",       "ハナ",
        "7",            "31.4",
        "39.3",         "16-15",
        "美浦高柳瑞",        "424(-4)",
        "201903030501", "201905050206"
      ],
      [
        "202006010101", "13",
        "8",            "15",
        "2017104350",   "牝3",
        "51.0",         "▲小林凌",
        "1:15.3",       "2",
        "15",           "474.2",
        "39.9",         "15-16",
        "美浦蛯名",         "436(+4)",
        "201905050305", ""
      ],
      [
        "202006010101", "14",
        "8",            "16",
        "2017101747",   "牝3",
        "51.0",         "▲山田",
        "1:15.4",       "3/4",
        "13",           "233.1",
        "40.4",         "9-10",
        "美浦伊藤伸",        "404(+4)",
        "201905050702", "201905050303"
      ],
      [
        "202006010101", "15",
        "4",            "8",
        "2017102716",   "牝3",
        "54.0",         "菅原隆",
        "1:15.6",       "1.1/2",
        "16",           "561.3",
        "40.3",         "12-13",
        "美浦石栗",         "450(+2)",
        "201906050501", "201906040201"
      ],
      [
        "202006010101", "16",
        "6",            "11",
        "2017105743",   "牝3",
        "54.0",         "横山和",
        "1:16.2",       "3.1/2",
        "14",           "392.6",
        "41.2",         "9-11",
        "美浦佐藤",         "482(+18)",
        "201905040401", "201905040501"
      ]
    ]
    ];

  const [raceActual, resultActual] = await procedure(raceId);

  assertEquals(raceActual, raceExpected);
  assertEquals(resultActual, resultExpected);
});

Deno.test("記号がない場合は空文字で埋める", async () => {
  const raceId = "202003010102";
  const expected = [
    [
      "202003010102",
      "20200411",
      "3歳未勝利",
      "10:20",
      "芝1200m (右)",
      "晴",
      "良",
      "1回",
      "福島",
      "1日目",
      "サラ系３歳",
      "未勝利",
      "",
      "馬齢",
      "16頭",
      "510",
      "200",
      "130",
      "77",
      "51",
    ],
  ];

  const [actual, _] = await procedure(raceId);

  assertEquals(actual, expected);
});
