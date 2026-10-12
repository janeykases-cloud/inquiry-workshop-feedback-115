# 115 分區研習：數位 × 探究教師回饋問卷

公開問卷：https://inquiry-workshop-feedback-115.janeykases.chatgpt.site/

管理統計：https://inquiry-workshop-feedback-115.janeykases.chatgpt.site/admin

## 功能
三場次、身分、年資下拉選单與電子郵件收集；10 題評分、教學應用與文字回饋。統計可按場次篩選，提供人數、百分比、平均分數、同意率與 CSV 匯出。

## 網站架構
GitHub Pages 公開入口：https://janeykases-cloud.github.io/inquiry-workshop-feedback-115/ 。入口會自動前往完整問卷。完整問卷由 Sites 提供伺服器與 D1 資料庫，因 GitHub Pages 只能提供靜態網頁。回覆及電子郵件不存放於 GitHub。統計 API 由伺服器端 ADMIN_KEY 秘密環境變數保護，管理密碼不包含於原始碼。

## 開發
使用 Node.js 22.13 以上；npm ci 安裝依賴，npm run dev 開發，npm run build 建置。Sites 發布會套用 drizzle/ 資料表遷移。請勿將管理密碼、真實回覆、名單及環境變數檔上傳至儲存庫。
