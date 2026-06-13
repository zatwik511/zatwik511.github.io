import type { Profile } from './types'

/**
 * The real content for zatwik.com. Authored once here and consumed by every
 * mode. Add a project = add one entry to the relevant group.
 *
 * Items marked "[…]" are placeholders carried over from the design mock —
 * fill them in with real details when available.
 */
export const profile: Profile = {
  name: 'Satwik Bhatnagar',
  tagline: 'Full-stack software engineer · London.',
  socials: [
    { label: 'GitHub', url: 'https://github.com/zatwik511', icon: 'github' },
    {
      label: 'LinkedIn',
      // TODO: confirm the exact LinkedIn vanity URL.
      url: 'https://www.linkedin.com/in/satwik-bhatnagar',
      icon: 'linkedin',
    },
  ],
  skills: [
    'TypeScript',
    'Python',
    'C++',
    'React',
    'Node.js',
    'PostgreSQL',
    'Three.js',
    'JavaScript',
    'Git',
    'HTML/CSS',
  ],
  nowPlaying: {
    track: 'Interstellar — Main Theme',
    artist: 'Hans Zimmer',
  },
  groups: [
    {
      heading: 'Education',
      entries: [
        {
          id: 'school',
          kind: 'education',
          navLabel: 'School',
          hudLabel: 'SCHOOL',
          title: '[Your school] · [years]',
          meta: '',
          body: 'Add your school, board, and any standout results or activities here.',
          universe: { galaxy: 'Education' },
        },
        {
          id: 'bachelors',
          kind: 'education',
          navLabel: "Bachelor's",
          hudLabel: "BACHELOR’S",
          title: '[Degree] · [University] · [years]',
          meta: '',
          body: 'Add your undergraduate degree, focus area, and notable coursework.',
          universe: { galaxy: 'Education' },
        },
        {
          id: 'masters',
          kind: 'education',
          navLabel: "Master's",
          hudLabel: "MASTER’S",
          title: 'MSc Software Engineering with Management Studies',
          meta: 'Kingston University London · 2025-26',
          body:
            'Dissertation: quantifying software-delivery pipeline bottlenecks (the LPBQ model).',
          universe: { galaxy: 'Education' },
        },
      ],
    },
    {
      heading: 'Experience',
      entries: [
        {
          id: 'job1',
          kind: 'experience',
          navLabel: 'Software intern — [company]',
          hudLabel: 'SOFTWARE INTERN',
          title: '[Company] · [dates]',
          meta: '',
          body: 'Add the role, the stack, and one or two things you shipped or improved.',
          universe: { galaxy: 'Experience' },
        },
        {
          id: 'job2',
          kind: 'experience',
          navLabel: 'Part-time — [role]',
          hudLabel: 'PART-TIME / FREELANCE',
          title: '[Role] · [dates]',
          meta: '',
          body: 'Add part-time work, freelance web builds, or client projects.',
          universe: { galaxy: 'Experience' },
        },
      ],
    },
    {
      heading: 'Projects',
      entries: [
        {
          id: 'medisync',
          kind: 'project',
          navLabel: 'MediSync',
          hudLabel: 'MEDISYNC',
          title: 'MediSync',
          summary:
            'Full-stack hospital management system · TypeScript, Node, PostgreSQL.',
          features:
            'Features: role-based access, appointment scheduling, records management, analytics dashboard. Feature-complete.',
          tech: ['TypeScript', 'Node.js', 'PostgreSQL'],
          media: [
            { type: 'video', caption: 'admin demo' },
            { type: 'image', caption: 'landing page' },
          ],
          link: { label: 'open MediSync', url: '#' },
          universe: { galaxy: 'Engineering', system: 'Web apps' },
        },
        {
          id: 'zathas',
          kind: 'project',
          navLabel: 'Zathas AI',
          hudLabel: 'ZATHAS AI',
          title: 'Zathas AI',
          summary: 'Dual-mode AI chatbot · Groq + Gemini routing.',
          features:
            'Public layer plus a hidden admin panel, GitHub-to-Render auto-deploy. A "Peter Parker / Spider-Man" public-vs-private architecture.',
          tech: ['Groq', 'Gemini', 'Node.js', 'Render'],
          media: [
            { type: 'video', caption: 'live demo' },
            { type: 'image', caption: 'admin panel' },
          ],
          link: { label: 'open Zathas AI', url: '#' },
          universe: { galaxy: 'Engineering', system: 'AI' },
        },
        {
          id: 'eval',
          kind: 'project',
          navLabel: 'Answer Eval',
          hudLabel: 'ANSWER EVAL',
          title: 'Answer Eval',
          summary: 'Subjective answer evaluation · Python, NLP/ML.',
          features:
            'Scores free-text answers against a reference using semantic similarity and keyword analysis. In active development.',
          tech: ['Python', 'NLP', 'ML'],
          media: [
            { type: 'video', caption: 'demo run' },
            { type: 'image', caption: 'results view' },
          ],
          link: { label: 'open project', url: '#' },
          universe: { galaxy: 'Research', system: 'NLP' },
        },
        {
          id: 'pong',
          kind: 'project',
          navLabel: 'CV Ping Pong',
          hudLabel: 'CV PING PONG',
          title: 'CV Ping Pong',
          summary: 'Hand-tracked 3D pong in the browser · MediaPipe, Three.js.',
          features:
            'Tracks your hand via webcam to control a paddle in a 3D scene. Vite + TypeScript stack.',
          tech: ['MediaPipe', 'Three.js', 'Vite', 'TypeScript'],
          media: [
            { type: 'video', caption: 'gameplay clip' },
            { type: 'image', caption: 'game screen' },
          ],
          link: { label: 'open game', url: '#' },
          universe: { galaxy: 'Creative', system: 'Games' },
        },
      ],
    },
  ],
}
