# transcribe-proposal

錄音轉提案：會議錄音一鍵轉成專業 PPTX 提案簡報。

把客戶諮詢錄音丟進去，自動完成轉錄、AI 分析、產出結構化提案簡報。適合自由工作者、顧問、一人公司。

[繁體中文](#使用方式) | [English](#english)

## 功能

- 音訊轉文字 (OpenAI Whisper API)
- AI 自動分析會議內容，提取需求、共識、報價
- 產出 9 頁結構化 PPTX 提案簡報
- 可自訂範本 (顏色、字體、公司資訊)
- 支援 Claude Code Skill 進階工作流

## 安裝前置條件

- Node.js 18+
- Python 3.8+
- OpenAI API Key

## 使用方式

### 快速開始

```bash
# 設定 API Key
export OPENAI_API_KEY=sk-...

# 安裝 Python 依賴
pip3 install python-pptx

# 一鍵執行
npx transcribe-proposal meeting.mp3
```

### 完整選項

```bash
# 指定輸出路徑和語言
npx transcribe-proposal meeting.mp3 --output my-proposal.pptx --lang zh

# 使用現有逐字稿 (跳過轉錄)
npx transcribe-proposal --transcript meeting.txt --output proposal.pptx

# 只轉錄，不產出簡報
npx transcribe-proposal meeting.mp3 --transcribe-only

# 使用自訂範本
npx transcribe-proposal meeting.mp3 --template my-theme.json

# 指定 GPT 模型
npx transcribe-proposal meeting.mp3 --model gpt-4o
```

### 支援的音訊格式

mp3, m4a, wav, ogg, flac, mp4, webm, mpeg, mpga, oga

檔案大小限制: 25MB (超過請先壓縮: `ffmpeg -i input.mp3 -b:a 64k -ar 16000 output.mp3`)

## 簡報結構

產出的 PPTX 包含 9 頁:

1. 封面 (提案名稱、日期)
2. 專案背景與目標
3. 系統架構
4. 功能範圍
5. 方案 A 報價
6. 方案 B 報價 (推薦)
7. 月維護 + 時程規劃
8. 付款方式 + 服務條款
9. 為什麼選擇我們 + 聯絡資訊

## 自訂範本

建立 JSON 檔案覆寫預設設定:

```json
{
  "colors": {
    "primary": "#3498DB"
  },
  "fonts": {
    "primary": "Microsoft JhengHei"
  },
  "company": {
    "name": "你的名字",
    "title": "你的職稱",
    "website": "example.com"
  }
}
```

只需要填寫要修改的欄位，其他會使用預設值。

完整預設設定參考: [templates/default.json](templates/default.json)

## Claude Code 整合

如果你使用 Claude Code，可以安裝 Skill 獲得完整 AI 工作流:

```bash
# 複製 Skill 到你的專案
cp -r .claude/skills/transcribe-proposal YOUR_PROJECT/.claude/skills/

# 在 Claude Code 中使用
/transcribe-proposal ~/Downloads/meeting.mp3
```

Claude Code Skill 會額外提供:
- 智慧會議內容分析
- 自動建立專案文件
- 互動式報價確認
- 脈絡與決策日誌更新

## API 費用估算

| 步驟 | 模型 | 30 分鐘會議費用 |
|------|------|----------------|
| 轉錄 | Whisper | ~$0.18 |
| 分析 | GPT-4o-mini | ~$0.01 |
| **合計** | | **~$0.19** |

## 字體設定

預設使用 PingFang TC (macOS 內建)。其他系統:

- **Windows**: 在範本中設定 `"primary": "Microsoft JhengHei"`
- **Linux**: 在範本中設定 `"primary": "Noto Sans TC"`

---

## English

### Quick Start

```bash
export OPENAI_API_KEY=sk-...
pip3 install python-pptx
npx transcribe-proposal meeting.mp3
```

### What It Does

1. Transcribes audio using OpenAI Whisper API
2. Analyzes the transcript with GPT to extract structured proposal data
3. Generates a professional 9-slide PPTX proposal

### Options

```
--output, -o <path>       Output PPTX path (default: proposal.pptx)
--transcript, -t <path>   Use existing transcript (skip transcription)
--transcribe-only         Only transcribe, don't generate proposal
--lang <code>             Transcription language (default: zh)
--template <path>         Custom template JSON
--model <name>            GPT model (default: gpt-4o-mini)
--api-key <key>           OpenAI API Key (or set OPENAI_API_KEY env var)
```

### Custom Templates

Create a JSON file with your overrides:

```json
{
  "colors": { "primary": "#3498DB" },
  "fonts": { "primary": "Arial" },
  "company": { "name": "Your Name", "title": "Consultant" }
}
```

Pass it with `--template my-theme.json`. Only specified fields are overridden.

## License

MIT
