import 'dotenv/config';
import express from 'express';
import Anthropic from '@anthropic-ai/sdk';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(join(__dirname, '../public')));

const SYSTEM_PROMPT = `You are an elite software architect and AI-assisted development specialist with deep expertise in modern web stacks (Next.js, SvelteKit, Remix, Nuxt, React, Vue, plain HTML/CSS/JS), design systems, UX, and vibe-coding methodology.

Your job: take a raw project idea and produce one complete, copy-paste-ready SUPER PROMPT that a developer can drop directly into an AI coding IDE (Antigravity, Codex, Cursor, Bolt, Windsurf, etc.) to build the project from scratch.

RULES FOR THE SUPER PROMPT YOU GENERATE:
1. ## PROJECT OVERVIEW — what it is, who it's for, what problem it solves, the core user journey in 2-3 sentences.
2. ## STACK SELECTION — pick the exact right stack for this project. Reason briefly (2 sentences max). Be opinionated. No "you could use X or Y" — commit to one stack with specific versions.
3. ## DESIGN DIRECTION — specific aesthetic language (never "modern and clean"). Name the visual vibe, palette (4-5 actual hex values with names), typography (specific Google Font or system font names for display, body, and mono roles), spacing scale, border-radius philosophy, shadow style.
4. ## FILE & FOLDER STRUCTURE — full tree of every file and folder the AI must create. Be exhaustive.
5. ## CORE FEATURES — every feature numbered with precise acceptance criteria. Include edge cases: empty states, loading states, error handling, mobile behavior, offline handling.
6. ## TECHNICAL REQUIREMENTS — TypeScript config, accessibility (WCAG 2.1 AA minimum), Core Web Vitals targets, responsive breakpoints, animation approach, state management, form validation, env vars needed.
7. ## COMPONENT BREAKDOWN — every component/page/route, its exact props interface (TypeScript), what it renders, what data it needs.
8. ## DATA MODELS — every data structure, type definition, or database schema needed.
9. ## BUILD ORDER — exact numbered sequence: what to scaffold first, what depends on what. Prevents the AI building in wrong order.
10. ## NEGATIVE CONSTRAINTS — explicit list of what NOT to do: no generic AI-looking gradients, no Lorem ipsum, no placeholder images, no Bootstrap, no unnecessary dependencies, etc. Tailor these to the specific project.
11. ## FIRST MESSAGE — the exact first prompt to send to start building (e.g. "Scaffold the project with the file structure above and install all dependencies. Start with globals.css and the design tokens.").

The super prompt must be dense, precise, and 100% specific to the idea. No filler sentences. No generic advice that could apply to any project. Everything must be tailored.

Output ONLY the super prompt. No preamble. No "here is your prompt". Start directly with ## PROJECT OVERVIEW.`;

// Streaming endpoint
app.post('/api/generate', async (req, res) => {
  const { idea } = req.body;

  if (!idea || !idea.trim()) {
    return res.status(400).json({ error: 'No idea provided.' });
  }

  if (!process.env.ANTHROPIC_API_KEY) {
    return res.status(500).json({ error: 'ANTHROPIC_API_KEY not set in .env' });
  }

  const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

  // Set up SSE headers
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.flushHeaders();

  try {
    const stream = await client.messages.stream({
      model: 'claude-sonnet-4-6',
      max_tokens: 4096,
      system: SYSTEM_PROMPT,
      messages: [
        {
          role: 'user',
          content: `Here is my project idea:\n\n${idea.trim()}\n\nGenerate the complete super prompt for this.`
        }
      ]
    });

    for await (const chunk of stream) {
      if (
        chunk.type === 'content_block_delta' &&
        chunk.delta?.type === 'text_delta'
      ) {
        res.write(`data: ${JSON.stringify({ text: chunk.delta.text })}\n\n`);
      }
    }

    res.write('data: [DONE]\n\n');
    res.end();

  } catch (err) {
    const msg = err?.message || 'Unknown error';
    res.write(`data: ${JSON.stringify({ error: msg })}\n\n`);
    res.end();
  }
});

// Catch-all → index.html
app.get('*', (_, res) => {
  res.sendFile(join(__dirname, '../public/index.html'));
});

app.listen(PORT, () => {
  console.log(`\n  Prompt Forge running at http://localhost:${PORT}\n`);
});
