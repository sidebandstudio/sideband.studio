// How every page writes a date: one style ("Oct 27, 2026") in UTC, the zone
// the GitHub snapshot records its timestamps in. The same instant then reads
// the same on every page, on the server and in the browser. Holds no data, so
// client components may import it.

const DAY = new Intl.DateTimeFormat('en-US', {
  month: 'short',
  day: 'numeric',
  year: 'numeric',
  timeZone: 'UTC',
})
const MONTH = new Intl.DateTimeFormat('en-US', {
  month: 'short',
  year: 'numeric',
  timeZone: 'UTC',
})
const MONTH_NAME = new Intl.DateTimeFormat('en-US', {
  month: 'short',
  timeZone: 'UTC',
})

/** A calendar date (2026-10-27) is midnight UTC. Timestamps keep their time. */
const toDate = (iso: string) =>
  new Date(iso.length === 10 ? `${iso}T00:00:00Z` : iso)

/** "Oct 27, 2026", never split across lines. Takes a date or a timestamp. */
export function formatDate(iso: string): string {
  return DAY.format(toDate(iso)).replace(/ /g, ' ')
}

/** "Feb 2024". */
export function formatMonth(iso: string): string {
  return MONTH.format(toDate(iso))
}

/** "Feb", for a calendar's month labels. */
export function formatMonthName(iso: string): string {
  return MONTH_NAME.format(toDate(iso))
}
