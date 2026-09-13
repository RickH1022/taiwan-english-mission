# 專案架構說明

## 資料流

```text
data/mission-01.js
        ↓
js/app.js ──→ 畫面渲染／互動狀態
   ↓    ↓
語音    LocalStorage
audio.js storage.js
```

### 1. 教材資料層：`data/mission-01.js`

教材以 `scenario` 與 `conversation` 組成。

- `scenario`：一種要處理的意圖，例如「旅行目的」或「住宿地點」。
- `variants`：入境官可能使用的不同英文問法。
- `options`：固定四個可選回應，使用穩定 `id` 判斷正確，不依畫面 A/B/C/D 順序。
- `learnAnswers`：簡易回答與完整句回答，皆包含 `text`、`zh`。
- `recoveryNext`：第一次回答不成功後，入境官改用的自然問法。

每個可能出現在結果頁的選項都必須具備：

```js
{ id: "length_five_days", text: "Five days.", zh: "五天。", isCorrect: true }
```

### 2. 流程層：`js/app.js`

`run` 保存單次未完成模擬；完成才會寫入 LocalStorage。

核心流程：

```text
首頁
→ 學習／旅行資料
→ 題目首次播放
→ 1.8 秒主動回想
→ 題目可互動
→ 正確、Recovery 或三次錯誤
→ 結果／解鎖下一階段
```

每題 `turn` 的重要狀態：

- `firstListenCompleted`：首次問題是否播完並完成首次揭示。
- `responseReady`：回答區是否顯示。
- `isInteractive`：題目是否穩定可操作；只有這時才渲染「結束並返回首頁」。
- `audioToken`：讓舊語音 Promise 或回呼失效。
- `repeat`、`slow`、`subtitle`：結果頁的輔助使用紀錄。
- `wrong`、`recoveryLevel`：錯誤與改問法紀錄。

### 3. 語音層：`js/audio.js`

`missionAudio.speakSequence()` 是唯一的模擬播放入口：每次新序列會先停止舊 SpeechSynthesis 佇列。離頁、中途退出與學習頁返回皆呼叫 `missionAudio.stop()`。

慢速率在 `app.js` 定義：

- iOS／iPadOS：`0.58`
- 其他裝置：`0.72`
- 一般速度：`1`

### 4. 儲存層：`js/storage.js`

| Key | 用途 |
| --- | --- |
| `taiwanEnglishMission.challengeHistory` | 已完成挑戰的結果紀錄 |
| `taiwanEnglishMission.mission01Progress` | Mission 01 核心、延伸、完整模擬解鎖進度 |

中途結束不會寫入挑戰結果，也不會解鎖下一階段。

### 5. 畫面與安全操作：`css/style.css`

- `.screen` 是每個頁面的容器，手機版以 `100dvh` 與 `env(safe-area-inset-bottom)` 保留 Safari 工具列安全空間。
- `.exit-home-footer` 是正常文件流中的次要操作，不使用 `position: fixed`。
- 播放、等待、影片、短暫過場不渲染退出按鈕，避免背景回呼移除確認視窗。

## Mission 01 特定設定

以下仍是 Mission 01 的業務規則，新增 Mission 時不可直接沿用內容：

- `buildFullSimulation()` 的必要題目、排序與 6–8 題隨機規則。
- `fullRank` 的入境題目順序。
- `mission01Progress` 的解鎖欄位與核心／延伸題數。
- `assets/mission-01/` 的影片與真人入境官圖片。

下一個 Mission 應先把這些規則移到該 Mission 的設定資料，再讓共用流程讀取設定；不要在 `app.js` 直接加入更多 Mission 02 的 `if` 判斷。
