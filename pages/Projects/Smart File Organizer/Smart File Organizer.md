---
order: 6
navLabel: Smart File Organizer
navBlurb: On-device AI file sorter
title: Smart File Organizer
summary: Local-first AI file organizer.
tech: [llama.cpp, Phi-3 Mini, C++, CMake, nlohmann/json, Python, Tkinter, PyInstaller, Inno Setup, MinGW-w64, MSYS2]
link: Source on GitHub | https://github.com/zatwik511/File-Organizer
galaxy: Engineering
system: Desktop apps
---

A local-first desktop utility that uses an on-device AI model to intelligently categorize and organize files, with zero cloud dependency or API cost.

- **Dual mode:** an AI-powered CLI that runs a local Phi-3 Mini LLM to classify files into semantic folders, plus a GUI app with 6 deterministic sort modes (by type, date, size, and alphabetically).
- **On-device inference:** integrated llama.cpp via CMake FetchContent to run quantized GGUF models fully offline, with a custom sampler chain and batch processing for folders of 200+ files.
- **Safe by default:** a dry-run preview, a confirmation prompt, and a full undo system backed by a JSON move history.
- **Real distribution:** packaged the GUI as a standalone Windows executable (no runtime required), with an installer that adds Start Menu shortcuts, a desktop icon, and Add/Remove Programs registration.
