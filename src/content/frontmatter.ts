/**
 * Minimal front-matter parser for the content markdown files.
 *
 * Each page file starts with a `---` fenced block of `key: value` lines,
 * followed by the markdown body. We only need a tiny YAML subset, so this is
 * hand-rolled (no dependency, no `Buffer`, works in the browser bundle):
 *
 *   - scalars:        title: MediSync
 *   - quoted scalars: title: "Has: a colon"
 *   - numbers/bools:  order: 2        featured: true
 *   - inline arrays:  tech: [TypeScript, Node.js, PostgreSQL]
 *
 * Anything richer (nested maps) is intentionally unsupported — keep the page
 * files flat and readable. See pages/README.md for the authoring guide.
 */

export type FrontmatterValue = string | number | boolean | string[]
export type Frontmatter = Record<string, FrontmatterValue>

export interface ParsedDoc {
  data: Frontmatter
  /** Everything after the closing `---`, with leading blank lines trimmed. */
  body: string
}

/** Strip a single pair of matching surrounding quotes, if present. */
function unquote(s: string): string {
  if (s.length >= 2) {
    const a = s[0]
    if ((a === '"' || a === "'") && s[s.length - 1] === a) {
      return s.slice(1, -1)
    }
  }
  return s
}

/** Coerce a raw scalar string into string | number | boolean. */
function coerce(raw: string): string | number | boolean {
  const v = raw.trim()
  if (v === 'true') return true
  if (v === 'false') return false
  if (/^-?\d+(\.\d+)?$/.test(v)) return Number(v)
  // Double-quoted strings support \n (and \t) escapes, like YAML — handy for
  // forcing a line break inside a value (e.g. a two-line meta).
  if (v.length >= 2 && v[0] === '"' && v[v.length - 1] === '"') {
    return v.slice(1, -1).replace(/\\n/g, '\n').replace(/\\t/g, '\t')
  }
  return unquote(v)
}

export function parseFrontmatter(input: string): ParsedDoc {
  // Normalise line endings so Windows-authored files parse the same.
  const text = input.replace(/\r\n/g, '\n')

  if (!text.startsWith('---')) {
    return { data: {}, body: text.trim() }
  }

  // Find the closing fence on its own line.
  const end = text.indexOf('\n---', 3)
  if (end === -1) {
    return { data: {}, body: text.trim() }
  }

  const head = text.slice(3, end)
  // Body starts after the closing `---` line.
  const afterFence = text.indexOf('\n', end + 1)
  const body = afterFence === -1 ? '' : text.slice(afterFence + 1)

  const data: Frontmatter = {}
  for (const line of head.split('\n')) {
    const trimmed = line.trim()
    if (!trimmed || trimmed.startsWith('#')) continue

    const colon = trimmed.indexOf(':')
    if (colon === -1) continue

    const key = trimmed.slice(0, colon).trim()
    const rawValue = trimmed.slice(colon + 1).trim()
    if (!key) continue

    if (rawValue.startsWith('[') && rawValue.endsWith(']')) {
      const inner = rawValue.slice(1, -1).trim()
      data[key] = inner
        ? inner.split(',').map((item) => unquote(item.trim())).filter(Boolean)
        : []
    } else {
      data[key] = coerce(rawValue)
    }
  }

  return { data, body: body.trim() }
}
