import type { HomeIntro, NowPlaying, SkillGroup, SocialLink } from './types'

/**
 * Site-level identity that isn't tied to any single page: name, contact links,
 * the skills ticker, and the now-playing fallback. The per-page content
 * (Education / Experience / Projects) lives in the `pages/` folders and is
 * loaded separately — see src/content/loader.ts. The two are stitched together
 * into the final `profile` in src/content/index.ts.
 */
export interface SiteConfig {
  name: string
  tagline: string
  /** Path to the downloadable CV PDF (lives in public/). */
  cvUrl: string
  /** Direct contact address for the email popup. */
  contactEmail: string
  socials: SocialLink[]
  /** The welcome screen (shown on home). */
  home: HomeIntro
  /** Categorised skills shown on the cockpit's Skills board. */
  skillGroups: SkillGroup[]
  /** Categorised hobbies shown on the cockpit's Hobbies board. */
  hobbyGroups: SkillGroup[]
  /** Fallback now-playing track until the live Spotify data loads. */
  nowPlaying: NowPlaying
}

export const site: SiteConfig = {
  name: 'Satwik Bhatnagar',
  tagline: 'Full-stack software engineer · London.',
  // Drop your real CV here: public/cv.pdf
  cvUrl: '/cv.pdf',
  contactEmail: 'sa7wik@gmail.com',
  socials: [
    {
      label: 'GitHub',
      icon: 'github',
      hint: 'zatwik511',
      action: { kind: 'link', url: 'https://github.com/zatwik511' },
    },
    {
      label: 'LinkedIn',
      icon: 'linkedin',
      // TODO: confirm the exact LinkedIn vanity URL / handle.
      hint: 'satwik-bhatnagar',
      action: { kind: 'link', url: 'https://www.linkedin.com/in/satwik-bhatnagar' },
    },
    {
      label: 'Phone',
      icon: 'phone',
      hint: '+44 7352 668970',
      // tel: opens the dialler with the number prefilled on mobile.
      action: { kind: 'tel', number: '+447352668970' },
    },
    {
      label: 'Email',
      icon: 'email',
      hint: 'sa7wik@gmail.com',
      action: { kind: 'mailto', address: 'sa7wik@gmail.com' },
    },
  ],
  // The welcome screen. Edit `intro` freely; drop a square (1:1) photo in
  // public/ and set `photo` to its path (e.g. '/me.jpg') to replace the
  // placeholder.
  home: {
    heading: 'Welcome aboard.',
    intro:
      "Hi, I'm Satwik, a full-stack software engineer who likes building polished, slightly over-engineered things (this cockpit included). Use the controls on the right to explore my education, experience, and projects, or see what I get up to off duty. This is placeholder text, edit it in src/content/site.ts.",
    // Drop a 1:1 square image in public/ and point this at it, e.g. '/me.jpg'.
    photo: '',
  },
  // Add or reorder freely — each category renders as a row of chips on the
  // Skills board. Names that exist in skills.ts become clickable links.
  skillGroups: [
    {
      heading: 'Languages',
      items: ['Python', 'Java', 'C', 'C++', 'JavaScript', 'TypeScript', 'SQL', 'HTML/CSS'],
    },
    {
      heading: 'Frameworks & Libraries',
      items: [
        'React',
        'Node.js',
        'Express',
        'Flask',
        'SQLAlchemy',
        'Tailwind CSS',
        'Bootstrap',
        'Three.js',
        'Tkinter',
        'Cornerstone.js',
        'marked',
        'PostgreSQL',
      ],
    },
    {
      heading: 'AI & ML',
      items: [
        'llama.cpp',
        'Phi-3 Mini',
        'Whisper',
        'Groq',
        'Google Gemini',
        'scikit-learn',
        'Claude',
        'ChatGPT',
        'GitHub Copilot',
        'DeepSeek',
        'Perplexity',
      ],
    },
    {
      heading: 'Cloud & DevOps',
      items: [
        'AWS EC2',
        'AWS S3',
        'Vercel',
        'Render',
        'GitHub Actions',
        'Gunicorn',
        'Caddy',
        'Git',
      ],
    },
    {
      heading: 'Build & Tooling',
      items: [
        'Vite',
        'CMake',
        'MinGW-w64',
        'MSYS2',
        'PyInstaller',
        'Inno Setup',
        'nlohmann/json',
        'JWT',
        'Spotify API',
        'Gmail API',
      ],
    },
    {
      heading: 'Creative & Office',
      items: ['Adobe Premiere Pro', 'Adobe Photoshop', 'MS Office'],
    },
    {
      heading: 'Professional',
      items: [
        'Team Leadership',
        'Critical Problem Solving',
        'Communication',
        'Attention to Detail',
      ],
    },
  ],
  // Categorised hobbies shown on the cockpit's Hobbies board. Plain chips
  // (no links) — edit freely; each category renders as a row.
  hobbyGroups: [
    {
      heading: 'Physical & Sports',
      items: ['Gym', 'Table Tennis', 'Football', 'Dancing'],
    },
    {
      heading: 'Creative & Artistic',
      items: ['Singing', 'Guitar', 'Photography', 'Cooking'],
    },
    {
      heading: 'Cognitive & Intellectual',
      items: ['Coding', 'Reading', 'Physics', 'Philosophy', 'AI'],
    },
    {
      heading: 'Collection & Curation',
      items: ['CD Album Collecting', 'Comics'],
    },
    {
      heading: 'Observation & Entertainment',
      items: ['YouTube', 'Watching Sports', 'Movies', 'TV', 'Anime', 'Comedy'],
    },
    {
      heading: 'Tech & Exploration',
      items: ['PC Building', 'Gaming', 'Travel'],
    },
  ],
  nowPlaying: {
    track: 'Interstellar — Main Theme',
    artist: 'Hans Zimmer',
  },
}
