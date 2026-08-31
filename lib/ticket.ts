export function generateTicketId(now: Date = new Date()): string {
  const year = now.getFullYear()
  const bytes = new Uint8Array(2)

  if (typeof crypto !== 'undefined' && crypto.getRandomValues) {
    crypto.getRandomValues(bytes)
  } else {
    bytes[0] = Math.floor(Math.random() * 256)
    bytes[1] = Math.floor(Math.random() * 256)
  }

  const hex = Array.from(bytes)
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('')
    .toUpperCase()

  return `SB-${year}-${hex}`
}
