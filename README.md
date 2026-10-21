# AI Security Interview Field Guide

A static, offline-friendly study guide for AI security interviews: 15 modules, 25+ diagrams, worked attack-vs-defense examples and a 200+ question Q&A bank.

**Start at [`index.html`](index.html).**

## Contents

| Part | Modules |
|---|---|
| A · Foundations | 01 AI security foundations |
| B · Risk frameworks | 02 OWASP Top 10 (Web & API) · 03 OWASP LLM Top 10 (2025) · 04 OWASP Agentic Top 10 · 05 MITRE ATLAS |
| C · Securing AI systems | 06 Securing RAG · 07 Agents, multi-agent & MCP · 08 Guardrails & middleware · 09 Agent harness engineering |
| D · Testing & evaluation | 10 Red teaming & PyRIT · 11 Evaluation harnesses & metrics |
| E · Platforms & governance | 12 Microsoft AI security · 13 NIST, ISO 42001, EU AI Act & more |
| F · Practice | 14 Interview Q&A bank · 15 Night-before cheat sheet |

## Features

- Search across all pages and questions: press `/` or `Ctrl+K`
- "On this page" navigation, numbered sections and key takeaways on every module
- Light and dark themes; works on desktop and mobile
- Progress, checklists and "confident" marks saved in your browser (localStorage)
- No build step, no external dependencies: plain HTML, CSS and JavaScript

## View locally

Open `index.html` in any modern browser.

## Host with GitHub Pages

Settings → Pages → Build and deployment → Source: **Deploy from a branch** → Branch: **main**, folder **/ (root)** → Save.
The site will be served at `https://<user>.github.io/AI-Security/`.

## Notes

- Code snippets for third-party frameworks (PyRIT, LangChain, OpenAI Agents SDK, promptfoo, RAGAS, etc.) show the shape of each API. They change between releases, so check the docs for your installed version.
- Numbers in "illustrative" examples are made up for the format and are labeled as such.
- `assets/search-index.js` is generated from the page headings, sections and questions.
