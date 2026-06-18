/**
 * Official links for skill / tech names. Shared by the Skills board and the
 * project tech-stack tags, so a name like "TypeScript" links to the same place
 * everywhere. Names without an entry render as plain (non-clickable) text.
 *
 * Every tech mentioned in a page's `tech:` list should have an entry here so
 * its tag is clickable.
 */
const SKILL_URLS: Record<string, string> = {
  // Languages
  TypeScript: 'https://www.typescriptlang.org/',
  JavaScript: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript',
  Python: 'https://www.python.org/',
  Java: 'https://www.java.com/',
  C: 'https://en.cppreference.com/w/c',
  'C++': 'https://isocpp.org/',
  SQL: 'https://en.wikipedia.org/wiki/SQL',
  'HTML/CSS': 'https://developer.mozilla.org/en-US/docs/Web/CSS',
  CSS: 'https://developer.mozilla.org/en-US/docs/Web/CSS',

  // Frameworks & libraries
  React: 'https://react.dev/',
  'Node.js': 'https://nodejs.org/',
  Express: 'https://expressjs.com/',
  Flask: 'https://flask.palletsprojects.com/',
  SQLAlchemy: 'https://www.sqlalchemy.org/',
  'Tailwind CSS': 'https://tailwindcss.com/',
  Bootstrap: 'https://getbootstrap.com/',
  'Three.js': 'https://threejs.org/',
  Tkinter: 'https://docs.python.org/3/library/tkinter.html',
  'Cornerstone.js': 'https://www.cornerstonejs.org/',
  marked: 'https://marked.js.org/',
  PostgreSQL: 'https://www.postgresql.org/',

  // AI & ML
  'llama.cpp': 'https://github.com/ggml-org/llama.cpp',
  'Phi-3 Mini': 'https://huggingface.co/microsoft/Phi-3-mini-4k-instruct',
  Whisper: 'https://github.com/openai/whisper',
  Groq: 'https://groq.com/',
  Gemini: 'https://gemini.google.com/',
  'Google Gemini': 'https://gemini.google.com/',
  'scikit-learn': 'https://scikit-learn.org/',
  Claude: 'https://claude.ai/',
  ChatGPT: 'https://chat.openai.com/',
  'GitHub Copilot': 'https://github.com/features/copilot',
  DeepSeek: 'https://www.deepseek.com/',
  Perplexity: 'https://www.perplexity.ai/',
  MediaPipe: 'https://developers.google.com/mediapipe',

  // Cloud & DevOps
  'AWS EC2': 'https://aws.amazon.com/ec2/',
  'AWS S3': 'https://aws.amazon.com/s3/',
  Vercel: 'https://vercel.com/',
  Render: 'https://render.com/',
  'GitHub Actions': 'https://github.com/features/actions',
  Gunicorn: 'https://gunicorn.org/',
  Caddy: 'https://caddyserver.com/',
  Git: 'https://git-scm.com/',

  // Build & tooling
  Vite: 'https://vite.dev/',
  CMake: 'https://cmake.org/',
  'MinGW-w64': 'https://www.mingw-w64.org/',
  MSYS2: 'https://www.msys2.org/',
  PyInstaller: 'https://pyinstaller.org/',
  'Inno Setup': 'https://jrsoftware.org/isinfo.php',
  'nlohmann/json': 'https://github.com/nlohmann/json',
  JWT: 'https://jwt.io/',
  'Spotify API': 'https://developer.spotify.com/documentation/web-api',
  'Gmail API': 'https://developers.google.com/gmail/api',

  // Software
  'Adobe Premiere Pro': 'https://www.adobe.com/products/premiere.html',
  'Adobe Photoshop': 'https://www.adobe.com/products/photoshop.html',
  'MS Office': 'https://www.office.com/',
}

/** Official URL for a skill/tech name, or undefined if there isn't one. */
export function skillUrl(name: string): string | undefined {
  return SKILL_URLS[name]
}
