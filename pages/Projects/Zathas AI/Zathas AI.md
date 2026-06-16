---
order: 2
navLabel: Zathas AI
navBlurb: Multimodal AI chatbot
title: Zathas
summary: Multimodal AI chatbot with a from-scratch C++ server.
tech: [C++, llama.cpp, React, Vite, Tailwind CSS, Groq, Whisper, AWS EC2, Caddy]
link: open Zathas | https://zathas.com
links: Source on GitHub | https://github.com/zatwik511/Zathas
galaxy: Engineering
system: AI
---

A multimodal AI chatbot whose inference server is built from scratch in C++ (no Python or Node at runtime), served alongside a React frontend and deployed live over HTTPS.

- **From scratch in C++:** a single compiled binary (cpp-httplib + llama.cpp) runs the server and serves the frontend.
- **Genuinely multimodal:** reads images (vision), speech (Whisper), text and scanned PDFs, Office docs, and 30+ code/text formats through hand-written C++ parsers.
- **Real-time streaming:** token-by-token answers over Server-Sent Events, with live markdown and syntax-highlighted code.
- **Polished chat UX:** AI-titled history, stop / regenerate / edit, voice input, drag-and-drop uploads, per-block copy, and keyboard shortcuts.
- **Production deployment:** AWS EC2 with systemd, a Caddy reverse proxy, auto-renewing Let's Encrypt HTTPS, and per-IP rate limiting.
