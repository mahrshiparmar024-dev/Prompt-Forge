# ⚡ Prompt Forge

> Describe your idea. Get a bulletproof super prompt for Antigravity, Codex, Cursor, Bolt, or any vibe-coding IDE.

---

## What it does

You type a rough idea. The AI reads your intent, picks the right tech stack, and writes a complete engineering prompt covering:

- Project overview & user journey
- Stack selection with reasoning (commits to one, no wishy-washy suggestions)
- Design system — hex palette, fonts, spacing
- Full file & folder structure
- Core features with acceptance criteria + edge cases
- Component breakdown with TypeScript props
- Data models
- Build order (so the AI in your IDE doesn't build things in the wrong sequence)
- Negative constraints (what NOT to do)
- The exact first message to send to start building

---

## Setup

### 1. Clone & install

```bash
git clone https://github.com/YOUR_USERNAME/prompt-forge.git
cd prompt-forge
npm install
```

### 2. Add your API key

```bash
cp .env.example .env
```

Open `.env` and paste your Anthropic API key:

```
ANTHROPIC_API_KEY=sk-ant-...
PORT=3000
```

Get your key at → https://console.anthropic.com

### 3. Run

```bash
npm run dev     # development (auto-restarts on change)
npm start       # production
```

Open **http://localhost:3000**

---

## Stack

| Layer    | Tech                          |
|----------|-------------------------------|
| Backend  | Node.js + Express             |
| AI       | Anthropic SDK (claude-sonnet-4-6) |
| Frontend | Vanilla HTML/CSS/JS           |
| Streaming | Server-Sent Events (SSE)     |

No build step. No bundler. Just `npm install` and go.

---

## Usage

1. Type your project idea in the text area (rough is fine)
2. Hit **Forge Super Prompt** or press `⌘ + Enter`
3. Watch the prompt stream in live
4. Hit **Copy** or **Save .txt**
5. Paste into your IDE as the first message

---

## Why a server instead of a plain HTML file?

Browsers block direct calls to the Anthropic API from `file://` URLs (CORS). The Express server acts as a proxy — your API key stays on your machine, never in the browser.

---

## License

MIT
