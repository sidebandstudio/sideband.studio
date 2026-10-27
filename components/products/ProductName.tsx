import { Fragment } from 'react'

/**
 * A product name that may wrap between the words of a camel-case name
 * (Eternal·Rich·Presence) and nowhere else, so a long name set large breaks
 * at a word instead of running off a narrow screen. Reads as one word.
 */
export default function ProductName({ name }: { name: string }) {
  const parts = name.split(/(?<=[a-z0-9])(?=[A-Z])/)
  return (
    <>
      {parts.map((part, i) => (
        <Fragment key={i}>
          {i > 0 && <wbr />}
          {part}
        </Fragment>
      ))}
    </>
  )
}
