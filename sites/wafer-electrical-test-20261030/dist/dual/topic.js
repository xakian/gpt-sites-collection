export default {
  "id": "wafer-test",
  "title": "晶圓電性測試",
  "version": "1.1.0-b29-local",
  "sourceDuration": 40000,
  "sourceCommit": "fd17fe5378a1c171ce705d5174495110c22a61c2",
  "intro": "同一晶圓上的 A、B 各接受兩個功能圖樣及固定輸入下的靜態供電電流測試；量測後才比較，再將結果寫入各自位置。",
  "majorStages": [
    {
      "index": 1,
      "title": "接觸與供電"
    },
    {
      "index": 2,
      "title": "檢查功能"
    },
    {
      "index": 3,
      "title": "量測靜態電流"
    },
    {
      "index": 4,
      "title": "比較與記錄"
    },
    {
      "index": 5,
      "title": "移交至 B"
    },
    {
      "index": 6,
      "title": "檢查功能"
    },
    {
      "index": 7,
      "title": "量測靜態電流"
    },
    {
      "index": 8,
      "title": "比較與記錄"
    },
    {
      "index": 9,
      "title": "解除接觸"
    },
    {
      "index": 10,
      "title": "兩顆對照"
    },
    {
      "index": 11,
      "title": "重新示範"
    }
  ],
  "phaseNames": [
    "接觸與供電",
    "檢查功能",
    "量測靜態電流",
    "比較與記錄",
    "移交至 B",
    "檢查功能",
    "量測靜態電流",
    "比較與記錄",
    "解除接觸",
    "兩顆對照",
    "重新示範"
  ],
  "nodes": [
    {
      "id": "E01",
      "title": "A 建立接觸再施加已知條件",
      "words": [
        "A 建立接觸",
        "再施加已知條件"
      ],
      "majorStage": 1,
      "phase": 0,
      "duration": 3000,
      "source": [
        0,
        3000
      ],
      "anchor": 2500.0,
      "operation": "先接點連接，再啟用供電與輸入。",
      "purpose": "確立量測前提。",
      "material": "晶粒 A 留在完整晶圓上。",
      "parameters": "未量測為 —，不是零。"
    },
    {
      "id": "E02",
      "title": "A 測兩個圖樣取樣後再比較",
      "words": [
        "A 測兩個圖樣",
        "取樣後再比較"
      ],
      "majorStage": 2,
      "phase": 1,
      "duration": 3000,
      "source": [
        3000,
        8000
      ],
      "anchor": 7500.0,
      "operation": "依序送入 X=0、X=1，取得 Y 後與預期比較。",
      "purpose": "完成本例功能項。",
      "material": "兩圖樣紀錄分開。",
      "parameters": "邏輯 1 不代表 1 V。"
    },
    {
      "id": "E03",
      "title": "A 固定 X=0等穩定再量流",
      "words": [
        "A 固定 X=0",
        "等穩定再量流"
      ],
      "majorStage": 3,
      "phase": 2,
      "duration": 3000,
      "source": [
        8000,
        12000
      ],
      "anchor": 11000,
      "operation": "建立靜態條件，等待後取樣 I_DD。",
      "purpose": "區分靜態電流與切換尖峰。",
      "material": "讀值按原門檻出現。",
      "parameters": "未把取樣動畫從零拉高。"
    },
    {
      "id": "E04",
      "title": "A 比較限值確認本例兩項",
      "words": [
        "A 比較限值",
        "確認本例兩項"
      ],
      "majorStage": 4,
      "phase": 3,
      "duration": 3000,
      "source": [
        12000,
        14000
      ],
      "anchor": 13500.0,
      "operation": "2 μA 與 10 μA 上限比較，再合併功能結果。",
      "purpose": "先比較才揭示總判定。",
      "material": "只表示本例兩項通過。",
      "parameters": "等號算通過的原規則保留。"
    },
    {
      "id": "E05",
      "title": "A 結果寫入對應晶粒格",
      "words": [
        "A 結果寫入",
        "對應晶粒格"
      ],
      "majorStage": 4,
      "phase": 3,
      "duration": 3000,
      "source": [
        14000,
        15000
      ],
      "anchor": 14500.0,
      "operation": "在 A 的位置格保存判定。",
      "purpose": "把資訊與實體位置連起來。",
      "material": "晶粒沒有變色或被切走。",
      "parameters": "其餘未測格維持未測。"
    },
    {
      "id": "E06",
      "title": "停止施加下降解除接觸",
      "words": [
        "停止施加",
        "下降解除接觸"
      ],
      "majorStage": 5,
      "phase": 4,
      "duration": 3000,
      "source": [
        15000,
        16000
      ],
      "anchor": 15800.0,
      "operation": "按原先後停止供電與輸入，再下降。",
      "purpose": "為安全平移建立分離狀態。",
      "material": "A 資料繼續保留。",
      "parameters": "不是帶接觸橫向刮移。"
    },
    {
      "id": "E07",
      "title": "無接觸平移從 A 對準 B",
      "words": [
        "無接觸平移",
        "從 A 對準 B"
      ],
      "majorStage": 5,
      "phase": 4,
      "duration": 3000,
      "source": [
        16000,
        17500.0
      ],
      "anchor": 16750.0,
      "operation": "整片承載台移至 B。",
      "purpose": "區分移動晶圓與挑出晶粒。",
      "material": "兩晶粒仍留在同片。",
      "parameters": "平移期間不供電測試。"
    },
    {
      "id": "E08",
      "title": "B 重新接觸施加相同條件",
      "words": [
        "B 重新接觸",
        "施加相同條件"
      ],
      "majorStage": 5,
      "phase": 4,
      "duration": 3000,
      "source": [
        17500.0,
        19000
      ],
      "anchor": 18750.0,
      "operation": "B 接點建立後再供電與輸入。",
      "purpose": "保持比較條件一致。",
      "material": "A 的舊資料不改寫。",
      "parameters": "不是把 A 紀錄挪給 B。"
    },
    {
      "id": "E09",
      "title": "B 測相同圖樣功能同樣符合",
      "words": [
        "B 測相同圖樣",
        "功能同樣符合"
      ],
      "majorStage": 6,
      "phase": 5,
      "duration": 3000,
      "source": [
        19000,
        24000
      ],
      "anchor": 23500.0,
      "operation": "以 X=0、X=1 取得 B 的輸出。",
      "purpose": "顯示外觀與功能可相同。",
      "material": "B 功能紀錄獨立。",
      "parameters": "此時電流項與總判定尚待測。"
    },
    {
      "id": "E10",
      "title": "B 固定輸入量流取得 14 μA",
      "words": [
        "B 固定輸入量流",
        "取得 14 μA"
      ],
      "majorStage": 7,
      "phase": 6,
      "duration": 3000,
      "source": [
        24000,
        28000
      ],
      "anchor": 27000,
      "operation": "同樣等待穩定後取樣靜態供電電流。",
      "purpose": "在同條件與共同量尺比較。",
      "material": "A 的 2 μA 仍保留。",
      "parameters": "不是輸入漏電或負載電流。"
    },
    {
      "id": "E11",
      "title": "B 電流超限本例總結果未通過",
      "words": [
        "B 電流超限",
        "本例總結果未通過"
      ],
      "majorStage": 8,
      "phase": 7,
      "duration": 3000,
      "source": [
        28000,
        30000
      ],
      "anchor": 29500.0,
      "operation": "14 μA 超過本例 10 μA 上限。",
      "purpose": "功能通過與電流失敗分開呈現。",
      "material": "未指認具體缺陷。",
      "parameters": "不能只看功能判斷整體。"
    },
    {
      "id": "E12",
      "title": "B 結果寫入自己的晶粒格",
      "words": [
        "B 結果寫入",
        "自己的晶粒格"
      ],
      "majorStage": 8,
      "phase": 7,
      "duration": 3000,
      "source": [
        30000,
        31000
      ],
      "anchor": 30500.0,
      "operation": "在 B 格記錄未通過。",
      "purpose": "維持位置可追溯。",
      "material": "其餘七格仍未測。",
      "parameters": "兩顆案例不能推算良率。"
    },
    {
      "id": "E13",
      "title": "停止施加與接觸原數據保留",
      "words": [
        "停止施加與接觸",
        "原數據保留"
      ],
      "majorStage": 9,
      "phase": 8,
      "duration": 3000,
      "source": [
        31000,
        33000
      ],
      "anchor": 32500.0,
      "operation": "關閉施加、下降分離。",
      "purpose": "區分量測結束與刪除資訊。",
      "material": "晶圓保持完整。",
      "parameters": "資料另以已記錄狀態顯示。"
    },
    {
      "id": "E14",
      "title": "對照兩顆結果相同功能不同電流",
      "words": [
        "對照兩顆結果",
        "相同功能不同電流"
      ],
      "majorStage": 10,
      "phase": 9,
      "duration": 3000,
      "source": [
        33000,
        37000
      ],
      "anchor": 35000,
      "operation": "並看功能、電流與本例總結果。",
      "purpose": "總結條件化判定。",
      "material": "兩顆數據保持各自位置。",
      "parameters": "通過不是零缺陷保證。"
    },
    {
      "id": "E15",
      "title": "遮幕重新示範同一組 A 與 B",
      "words": [
        "遮幕重新示範",
        "同一組 A 與 B"
      ],
      "majorStage": 11,
      "phase": 10,
      "duration": 3000,
      "source": [
        37000,
        40000
      ],
      "anchor": 38600.0,
      "operation": "遮幕期間重設案例，再淡入起點。",
      "purpose": "明示觀看循環。",
      "material": "不是修復晶粒或換新批晶圓。",
      "parameters": "原 40 秒重設語義保留。"
    }
  ],
  "visits": [
    {
      "id": "E01",
      "source": [
        0,
        3000
      ],
      "anchor": 2500.0,
      "duration": 3000,
      "context": {
        "cycle": 1,
        "completed": 0
      }
    },
    {
      "id": "E02",
      "source": [
        3000,
        8000
      ],
      "anchor": 7500.0,
      "duration": 3000,
      "context": {
        "cycle": 1,
        "completed": 0
      }
    },
    {
      "id": "E03",
      "source": [
        8000,
        12000
      ],
      "anchor": 11000,
      "duration": 3000,
      "context": {
        "cycle": 1,
        "completed": 0
      }
    },
    {
      "id": "E04",
      "source": [
        12000,
        14000
      ],
      "anchor": 13500.0,
      "duration": 3000,
      "context": {
        "cycle": 1,
        "completed": 0
      }
    },
    {
      "id": "E05",
      "source": [
        14000,
        15000
      ],
      "anchor": 14500.0,
      "duration": 3000,
      "context": {
        "cycle": 1,
        "completed": 0
      }
    },
    {
      "id": "E06",
      "source": [
        15000,
        16000
      ],
      "anchor": 15800.0,
      "duration": 3000,
      "context": {
        "cycle": 1,
        "completed": 0
      }
    },
    {
      "id": "E07",
      "source": [
        16000,
        17500.0
      ],
      "anchor": 16750.0,
      "duration": 3000,
      "context": {
        "cycle": 1,
        "completed": 0
      }
    },
    {
      "id": "E08",
      "source": [
        17500.0,
        19000
      ],
      "anchor": 18750.0,
      "duration": 3000,
      "context": {
        "cycle": 1,
        "completed": 0
      }
    },
    {
      "id": "E09",
      "source": [
        19000,
        24000
      ],
      "anchor": 23500.0,
      "duration": 3000,
      "context": {
        "cycle": 1,
        "completed": 0
      }
    },
    {
      "id": "E10",
      "source": [
        24000,
        28000
      ],
      "anchor": 27000,
      "duration": 3000,
      "context": {
        "cycle": 1,
        "completed": 0
      }
    },
    {
      "id": "E11",
      "source": [
        28000,
        30000
      ],
      "anchor": 29500.0,
      "duration": 3000,
      "context": {
        "cycle": 1,
        "completed": 0
      }
    },
    {
      "id": "E12",
      "source": [
        30000,
        31000
      ],
      "anchor": 30500.0,
      "duration": 3000,
      "context": {
        "cycle": 1,
        "completed": 0
      }
    },
    {
      "id": "E13",
      "source": [
        31000,
        33000
      ],
      "anchor": 32500.0,
      "duration": 3000,
      "context": {
        "cycle": 1,
        "completed": 0
      }
    },
    {
      "id": "E14",
      "source": [
        33000,
        37000
      ],
      "anchor": 35000,
      "duration": 3000,
      "context": {
        "cycle": 1,
        "completed": 0
      }
    },
    {
      "id": "E15",
      "source": [
        37000,
        40000
      ],
      "anchor": 38600.0,
      "duration": 3000,
      "context": {
        "cycle": 1,
        "completed": 0
      }
    }
  ],
  "edges": [
    {
      "id": "E01",
      "from": "E01",
      "to": "E02",
      "kind": "sequence",
      "label": "",
      "when": "always"
    },
    {
      "id": "E02",
      "from": "E02",
      "to": "E03",
      "kind": "sequence",
      "label": "",
      "when": "always"
    },
    {
      "id": "E03",
      "from": "E03",
      "to": "E04",
      "kind": "sequence",
      "label": "",
      "when": "always"
    },
    {
      "id": "E04",
      "from": "E04",
      "to": "E05",
      "kind": "sequence",
      "label": "",
      "when": "always"
    },
    {
      "id": "E05",
      "from": "E05",
      "to": "E06",
      "kind": "sequence",
      "label": "",
      "when": "always"
    },
    {
      "id": "E06",
      "from": "E06",
      "to": "E07",
      "kind": "sequence",
      "label": "",
      "when": "always"
    },
    {
      "id": "E07",
      "from": "E07",
      "to": "E08",
      "kind": "sequence",
      "label": "",
      "when": "always"
    },
    {
      "id": "E08",
      "from": "E08",
      "to": "E09",
      "kind": "sequence",
      "label": "",
      "when": "always"
    },
    {
      "id": "E09",
      "from": "E09",
      "to": "E10",
      "kind": "sequence",
      "label": "",
      "when": "always"
    },
    {
      "id": "E10",
      "from": "E10",
      "to": "E11",
      "kind": "sequence",
      "label": "",
      "when": "always"
    },
    {
      "id": "E11",
      "from": "E11",
      "to": "E12",
      "kind": "sequence",
      "label": "",
      "when": "always"
    },
    {
      "id": "E12",
      "from": "E12",
      "to": "E13",
      "kind": "sequence",
      "label": "",
      "when": "always"
    },
    {
      "id": "E13",
      "from": "E13",
      "to": "E14",
      "kind": "sequence",
      "label": "",
      "when": "always"
    },
    {
      "id": "E14",
      "from": "E14",
      "to": "E15",
      "kind": "sequence",
      "label": "",
      "when": "always"
    }
  ],
  "controls": [],
  "loops": [],
  "defaults": {},
  "pages": [
    {
      "title": "A 測試與紀錄",
      "phrases": [
        "A 測試與紀錄"
      ],
      "ids": [
        "E01",
        "E02",
        "E03",
        "E04",
        "E05"
      ]
    },
    {
      "title": "分離與移交",
      "phrases": [
        "分離與移交"
      ],
      "ids": [
        "E06",
        "E07",
        "E08"
      ]
    },
    {
      "title": "B 測試與紀錄",
      "phrases": [
        "B 測試與紀錄"
      ],
      "ids": [
        "E09",
        "E10",
        "E11",
        "E12"
      ]
    },
    {
      "title": "結果與重播",
      "phrases": [
        "結果與重播"
      ],
      "ids": [
        "E13",
        "E14",
        "E15"
      ]
    }
  ],
  "notes": [
    "沿用原固定案例與 40 秒示意：A 2 μA、B 14 μA，本例上限 10 μA；這些均為教學設定，不是實測或通用規格。",
    "功能符合不代表所有條件都合格；B 的超限不指認特定缺陷。",
    "晶粒不移出晶圓；結果圖是資訊，37–40 秒明示重播同一案例。"
  ],
  "sources": [
    {
      "title": "Advantest · Semiconductor Test",
      "url": "https://www.advantest.com/en/about/business/"
    },
    {
      "title": "TI · Standard-Logic Data Sheets",
      "url": "https://www.ti.com/lit/an/szza036c/szza036c.pdf"
    },
    {
      "title": "NI · Test Steps and Flow",
      "url": "https://www.ni.com/docs/en-US/bundle/teststand-semiconductor-module/page/test-steps-and-flow.html"
    }
  ],
  "requiredAdjustments": [
    "新增 dual/ 流程與秒／毫秒轉接；原 SVG、表格、案例與 sampleTopic 保留。",
    "原 Player 接口接入同一主時鐘；進度、原說明定位與流程定位各自轉換至相同科學時間。",
    "只對新增模式開關與流程布局作本機 CSS 接入，保存原說明與下載來源入口。"
  ],
  "restartNote": "37–40 秒遮幕重播同一固定 A／B 案例，不修復、切割或換批。",
  "relationNote": "先量測再比較 · 結果寫回原位置 · 功能符合不代表電流合格",
  "start": "E01",
  "finish": "E15"
};
