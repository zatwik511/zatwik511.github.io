/**
 * Official links for skill / tech names. Shared by the windshield skills
 * ticker and the project tech-stack tags, so a name like "TypeScript" links
 * to the same place everywhere. Names without an entry render as plain text.
 */
const SKILL_URLS: Record<string, string> = {
  TypeScript: 'https://www.typescriptlang.org/',
  JavaScript: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript',
  Python: 'https://www.python.org/',
  'C++': 'https://isocpp.org/',
  React: 'https://react.dev/',
  'Node.js': 'https://nodejs.org/',
  PostgreSQL: 'https://www.postgresql.org/',
  'Three.js': 'https://threejs.org/',
  Git: 'https://git-scm.com/',
  'HTML/CSS': 'https://developer.mozilla.org/en-US/docs/Web/CSS',
  Vite: 'https://vite.dev/',
  Groq: 'https://groq.com/',
  Gemini: 'https://ai.google.dev/',
  Render: 'https://render.com/',
  MediaPipe: 'https://developers.google.com/mediapipe',
}

/** Official URL for a skill/tech name, or undefined if there isn't one. */
export function skillUrl(name: string): string | undefined {
  return SKILL_URLS[name]
}
