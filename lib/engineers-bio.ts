// Server-only. Reads content/engineers/<id>/bio.md at build time and parses
// the small Markdown subset the bios use: ## sections, ### headings,
// paragraphs, lists, a blockquote, **bold**, _italic_, `code` and [links](url).
import { readFileSync } from 'node:fs'
import { join } from 'node:path'

export type Inline =
  | { type: 'text'; text: string }
  | { type: 'strong' | 'em'; children: Inline[] }
  | { type: 'code'; text: string }
  | { type: 'link'; href: string; children: Inline[] }

export type Block =
  | { type: 'paragraph'; content: Inline[] }
  | { type: 'list'; items: Inline[][] }
  | { type: 'quote'; content: Inline[] }
  | { type: 'heading'; content: Inline[] }

export interface BioSection {
  title: string
  blocks: Block[]
}

export interface Bio {
  /** The pull quote under the name, if the bio opens with one. */
  quote: Inline[] | null
  sections: BioSection[]
}

// Italic is `_text_` only, and only at a word boundary, so snake_case names
// and underscores inside URLs stay as they are.
const INLINE =
  /\*\*(.+?)\*\*|(^|[^\w])_([^_\s][^_]*?)_(?!\w)|`([^`]+)`|\[([^\]]+)\]\(([^)\s]+)\)/g

export function parseInline(text: string): Inline[] {
  const out: Inline[] = []
  let last = 0
  for (const m of Array.from(text.matchAll(INLINE))) {
    const i = m.index ?? 0
    if (i > last) out.push({ type: 'text', text: text.slice(last, i) })
    if (m[1] !== undefined)
      out.push({ type: 'strong', children: parseInline(m[1]) })
    else if (m[3] !== undefined) {
      if (m[2]) out.push({ type: 'text', text: m[2] })
      out.push({ type: 'em', children: parseInline(m[3]) })
    } else if (m[4] !== undefined) out.push({ type: 'code', text: m[4] })
    else out.push({ type: 'link', href: m[6], children: parseInline(m[5]) })
    last = i + m[0].length
  }
  if (last < text.length) out.push({ type: 'text', text: text.slice(last) })
  return out
}

function parseBlocks(lines: string[]): Block[] {
  const blocks: Block[] = []
  let para: string[] = []
  let list: string[] | null = null
  let quote: string[] = []

  const flush = () => {
    if (para.length)
      blocks.push({ type: 'paragraph', content: parseInline(para.join(' ')) })
    if (list) blocks.push({ type: 'list', items: list.map(parseInline) })
    if (quote.length)
      blocks.push({ type: 'quote', content: parseInline(quote.join(' ')) })
    para = []
    list = null
    quote = []
  }

  for (const raw of lines) {
    const line = raw.trim()
    if (!line || line === '---') {
      flush()
    } else if (line.startsWith('### ')) {
      flush()
      blocks.push({ type: 'heading', content: parseInline(line.slice(4)) })
    } else if (/^[-*] /.test(line)) {
      if (!list) {
        flush()
        list = []
      }
      list.push(line.slice(2))
    } else if (line.startsWith('> ')) {
      if (!quote.length) flush()
      quote.push(line.slice(2))
    } else if (list && raw.startsWith('  ')) {
      // A continuation line indented under the last list item.
      list[list.length - 1] += ` ${line}`
    } else {
      if (list || quote.length) flush()
      para.push(line)
    }
  }
  flush()
  return blocks
}

export function parseBio(markdown: string): Bio {
  const [preamble, ...rest] = markdown.split(/^## /m)
  const lead = parseBlocks(preamble.split('\n')).find((b) => b.type === 'quote')
  return {
    quote: lead && lead.type === 'quote' ? lead.content : null,
    sections: rest.map((chunk) => {
      const [title, ...body] = chunk.split('\n')
      return { title: title.trim(), blocks: parseBlocks(body) }
    }),
  }
}

export function readBio(id: string): Bio | null {
  try {
    const md = readFileSync(
      join(process.cwd(), 'content', 'engineers', id, 'bio.md'),
      'utf8',
    )
    return parseBio(md)
  } catch {
    return null
  }
}

export function bioSection(bio: Bio | null, title: string): BioSection | null {
  return (
    bio?.sections.find((s) => s.title.toLowerCase() === title.toLowerCase()) ??
    null
  )
}

/** The plain text of some inline content, for labels and tests. */
export function inlineText(content: Inline[]): string {
  return content
    .map((n) =>
      n.type === 'text' || n.type === 'code' ? n.text : inlineText(n.children),
    )
    .join('')
}
