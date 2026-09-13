# 新增 Mission 指南

本指南以未來的「Mission 02」為例。先新增資料與設定，再評估是否需要把 `app.js` 的 Mission 01 特定規則抽成共用設定；不要直接複製整份 `app.js`。

## 1. 建立教材資料

建立 `data/mission-02.js`，維持 Mission 01 的資料概念：

```js
const mission = {
  id: "mission-02",
  title: "Mission 02｜…",
  tripProfile: [],
  scenarios: [
    {
      id: "stable_scenario_id",
      group: "core",
      title: "情境名稱",
      intentHint: "使用者需要處理的意圖",
      variants: [
        {
          id: "stable_variant_id",
          text: "Officer question in English",
          zhMeaning: "自然的繁體中文意思。",
          answerType: "speech",
          correctOptionId: "answer_correct",
          options: [
            { id: "answer_correct", text: "Short answer.", zh: "中文意思。", isCorrect: true },
            { id: "answer_d1", text: "Distractor.", zh: "中文意思。", isCorrect: false }
          ],
          learnAnswers: {
            simple: { text: "Short answer.", zh: "中文意思。" },
            sentence: { text: "A complete answer.", zh: "完整中文意思。" }
          },
          recoveryNext: null
        }
      ]
    }
  ]
};
```

必要條件：

- 每個 `options` 固定四個，`id` 必須跨同一 variant 唯一。
- 正確性以 `correctOptionId`／`isCorrect` 判斷，畫面位置可以隨機。
- 所有英文問句、短答、完整回答、干擾選項、動作型回應都必須有自然繁中。
- `recoveryNext` 應是同一意圖的不同自然問法，不要直接公布答案。

## 2. Mission 設定應抽離的項目

在開始 Mission 02 UI 開發前，先建立每個 Mission 的設定物件，至少包含：

- `coreScenarioIds`
- `extensionScenarioIds`
- `fullSimulation.requiredScenarioIds`
- `fullSimulation.minQuestions`、`maxQuestions`
- `fullSimulation.order` 或排序規則
- `assets.officerPhoto`、`assets.introVideo`
- `storageKey`

這一步可避免 Mission 02 修改 Mission 01 的隨機題目、解鎖或圖片。

## 3. LocalStorage 命名

每個 Mission 應有獨立進度 key，例如：

```text
taiwanEnglishMission.mission02Progress
```

歷史紀錄必須帶 `missionId`，讓未來可以篩選，不要覆蓋 Mission 01。

## 4. 流程回歸清單

- 首次問句純聽力，英文僅在 CC 開啟後顯示。
- 首次語音後保留 1.8 秒主動回想，再揭示選項。
- 再說一次與慢速播放只重播題目，使用紀錄正確。
- Recovery 不隨機改變同一題已顯示的選項位置，除非選項內容真的不同。
- 每題最多三次錯誤；不可在過程公布正確答案。
- 題目播放、等待、輔助播放與影片中不顯示退出按鈕。
- 學習頁的返回操作會停止正在播放的英文。
- 結果頁的所有回答都有繁中；中途結束不寫入紀錄。
- 390–430px 與桌機寬度都無水平捲動，最後操作保留 Safari 安全距離。

## 5. 發布前檢查

- 所有素材為相對路徑，檔名大小寫正確。
- 不含本機絕對路徑、帳密、Token 或外部付費 API。
- `node --check`、`git diff --check` 通過。
- GitHub Pages 公開網址實測首頁、學習、核心、延伸、完整模擬、結果與中途退出。
