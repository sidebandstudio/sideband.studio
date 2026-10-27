// Server-only. Reads the pixel size of an image under public/ from its file
// header, for data that lists photos without their dimensions.
import { readFileSync } from 'node:fs'
import { join } from 'node:path'

export interface PixelSize {
  width: number
  height: number
}

function jpegSize(buf: Buffer): PixelSize | null {
  let i = 2
  while (i + 9 < buf.length) {
    if (buf[i] !== 0xff) return null
    const marker = buf[i + 1]
    const length = buf.readUInt16BE(i + 2)
    // Start-of-frame markers carry the size. C4, C8 and CC are not frames.
    if (
      marker >= 0xc0 &&
      marker <= 0xcf &&
      marker !== 0xc4 &&
      marker !== 0xc8 &&
      marker !== 0xcc
    )
      return { height: buf.readUInt16BE(i + 5), width: buf.readUInt16BE(i + 7) }
    i += 2 + length
  }
  return null
}

/** Width and height of a JPEG or PNG in public/, or null if it cannot be read. */
export function imageSize(src: string): PixelSize | null {
  try {
    const buf = readFileSync(join(process.cwd(), 'public', src))
    if (buf.readUInt32BE(0) === 0x89504e47)
      return { width: buf.readUInt32BE(16), height: buf.readUInt32BE(20) }
    if (buf[0] === 0xff && buf[1] === 0xd8) return jpegSize(buf)
    return null
  } catch {
    return null
  }
}

/** Sizes keyed by src, for a list of images. */
export function imageSizes(srcs: string[]): Record<string, PixelSize> {
  const out: Record<string, PixelSize> = {}
  for (const src of srcs) {
    const size = imageSize(src)
    if (size) out[src] = size
  }
  return out
}
