import type { NowPlaying, SkillGroup, SocialLink } from './types'

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
  /** Categorised skills shown on the cockpit's Skills board. */
  skillGroups: SkillGroup[]
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
      // TODO: replace with the real number.
      hint: '+44 0000 000000',
      action: { kind: 'copy', value: '+44 0000 000000' },
    },
    {
      label: 'Email',
      icon: 'email',
      hint: 'sa7wik@gmail.com',
      action: { kind: 'mailto', address: 'sa7wik@gmail.com' },
    },
  ],
  // Add or reorder freely — each category renders as a row of chips on the
  // Skills board. Names that exist in skills.ts become clickable links.
  skillGroups: [
    {
      heading: 'Languages & Frameworks',
      items: [
        'Python',
        'Java',
        'C',
        'C++',
        'JavaScript',
        'TypeScript',
        'React',
        'Node.js',
        'SQL',
        'HTML/CSS',
        'Three.js',
      ],
    },
    {
      heading: 'AI Tools',
      items: ['Claude', 'ChatGPT', 'Gemini', 'GitHub Copilot', 'DeepSeek', 'Perplexity'],
    },
    {
      heading: 'Software',
      items: ['Adobe Premiere Pro', 'Adobe Photoshop', 'MS Office', 'Git'],
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
  nowPlaying: {
    track: 'Interstellar — Main Theme',
    artist: 'Hans Zimmer',
  },
}
