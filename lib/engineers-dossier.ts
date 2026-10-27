// Server-only. Decides what a dossier shows so that each fact appears once:
// the bio prose in lib/engineers.ts, the quotes and notes in bio.md, and the
// structured fields (languages, interests) overlap, and this keeps only the
// first place a fact is told.
import type { Engineer } from '@/lib/engineers'
import {
  inlineText,
  type Bio,
  type Block,
  type BioSection,
} from '@/lib/engineers-bio'
import { isOwnVenture } from '@/lib/engineers-view'
import { products } from '@/lib/products'

const plain = (s: string) =>
  s
    .toLowerCase()
    .replace(/[“”"‘’']/g, '')
    .replace(/\s+/g, ' ')
    .trim()

function blockText(blocks: Block[]): string {
  return blocks
    .map((b) =>
      b.type === 'list'
        ? b.items.map(inlineText).join(' ')
        : inlineText(b.content),
    )
    .join(' ')
}

/** An interest counts as told when a word in the text starts like a word of it (its first four letters). */
function mentions(text: string, interest: string): boolean {
  return plain(interest)
    .split(/[^a-z]+/)
    .filter((w) => w.length >= 3)
    .some((w) => new RegExp(`\\b${w.slice(0, 4)}`).test(text))
}

/** The text without product names, so "Exerly Fitness" does not count as fitness. */
function withoutProducts(text: string): string {
  return products.reduce((t, p) => t.split(plain(p.name)).join(' '), text)
}

export interface DossierText {
  /** "In his words" without the line the pull quote already shows. */
  words: BioSection | null
  offDuty: BioSection | null
  /** Interests not already named in the prose. */
  interests: string[]
  /** Spoken languages for the header, unless the bio already lists them. */
  speaks: string[] | null
  /** Experience highlights that repeat a venture card, by the venture's name. */
  ventureNames: string[]
}

export function dossierText(engineer: Engineer, bio: Bio | null): DossierText {
  const quote = bio?.quote ? plain(inlineText(bio.quote)) : ''
  const found = bio?.sections.find((s) => /^in \w+ words$/i.test(s.title))
  const words = found
    ? {
        ...found,
        blocks: found.blocks.map((b) =>
          b.type === 'list' && quote
            ? {
                ...b,
                items: b.items.filter(
                  (item) => !plain(inlineText(item)).includes(quote),
                ),
              }
            : b,
        ),
      }
    : null

  const offDutyFound =
    bio?.sections.find((s) => s.title.toLowerCase() === 'off duty') ?? null
  const offDuty =
    offDutyFound && offDutyFound.blocks.length > 0 ? offDutyFound : null

  const prose = plain(
    [
      ...engineer.longBio,
      words ? blockText(words.blocks) : '',
      offDuty ? blockText(offDuty.blocks) : '',
    ].join(' '),
  )

  const languages = engineer.spokenLanguages ?? []
  const speaks =
    languages.length > 0 && !languages.every((l) => prose.includes(plain(l)))
      ? languages
      : null

  return {
    words,
    offDuty,
    interests: (engineer.interests ?? []).filter(
      (i) => !mentions(withoutProducts(prose), i),
    ),
    speaks,
    ventureNames: (engineer.projects ?? [])
      .filter(isOwnVenture)
      .map((p) => p.name),
  }
}
