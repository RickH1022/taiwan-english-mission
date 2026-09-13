# 台灣人英文實戰訓練系統

以真實情境為主的英文互動練習工具。現有版本完成 Mission 01：**順利通過入境審查**。

使用者先在學習模式認識常見問法與簡短回答，再完成核心 8 題、延伸 4 題，最後解鎖完整入境模擬。全站是純靜態網站：不需帳號、後端、資料庫或外部 AI API。

公開網站：[GitHub Pages](https://rickh1022.github.io/taiwan-english-mission/)

## 本機開啟

這是單一 `index.html` 的靜態網站。可直接用瀏覽器開啟；若要讓影片、語音與載入行為最接近正式環境，建議在專案根目錄啟動任一靜態伺服器，例如：

```powershell
python -m http.server 8000
```

再開啟 `http://localhost:8000`。

## 專案結構

```text
index.html                    網站入口與載入順序
css/style.css                 全站深藍／綠色視覺與響應式規則
data/mission-01.js            Mission 01 教材、選項、中文、Recovery 資料
js/app.js                     畫面狀態、模擬流程、渲染、計分與解鎖
js/audio.js                   SpeechSynthesis 佇列、平台慢速率與語音停止
js/storage.js                 LocalStorage 挑戰紀錄與 Mission 01 進度
assets/mission-01/            入境官頭像與完整模擬開場影片
docs/                         架構說明與新增 Mission 指南
```

## 目前功能

- 學習模式：12 個入境情境、英文問法、繁中意思、可播放的回答。
- 核心 8／延伸 4：第一次純聽力、1.8 秒主動回想、四個選項、Recovery 問法。
- 輔助：再說一次、平台適用的慢速播放、CC 英文字幕、旅行資料提示。
- 完整模擬：6–8 題隨機排序、開場影片、同一題最多三次錯誤。
- 結果：首次理解／使用協助完成／需要練習，並可查看中英答案與輔助紀錄。
- 手機安全操作：在 iPhone Safari 底部工具列附近保留安全距離；僅在題目可穩定互動時顯示中途退出。

## 開發原則

- 教材放在 `data/`，不要把英文、中文、答案硬寫在畫面渲染函式中。
- 新增頁面或題目流程前，先確保 `missionAudio.stop()` 與現有計時器會在離開時清除。
- 不要以畫面寬度判斷平台語音行為；iPadOS 桌面模式需視為 iOS。
- 所有會出現在結果頁的選項都應有繁體中文欄位。
- 不清除或改寫使用者既有的 LocalStorage 資料結構。

詳見：[架構說明](docs/ARCHITECTURE.md) 與 [新增 Mission 指南](docs/NEW_MISSION_CHECKLIST.md)。
