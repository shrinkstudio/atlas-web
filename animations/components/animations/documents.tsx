'use client'

import { useEffect, useState } from 'react'
import { motion, useReducedMotion } from 'framer-motion'

type Doc = {
  id: string
  name: string
  year: string
}

const DOCS: Doc[] = [
  { id: 'roof', name: 'Roof warranty.pdf', year: '2025' },
  { id: 'permit', name: 'Permit #4471', year: '2023' },
  { id: 'furnace', name: 'Furnace invoice.pdf', year: '2021' },
]

const STEP_MS = 1000

const REST_TINT = '#f5f2ff'
const ACTIVE_TINT = '#ece7ff'
const REST_SHADOW = '0 0 0 0 rgba(112,89,255,0)'
const ACTIVE_SHADOW = '0 6px 16px -6px rgba(112,89,255,0.35)'
const ICON_REST = '#9381ff'
const ICON_ACTIVE = '#7059ff'

// Exact Figma artwork (frame-1.svg), stroke driven by currentColor so it can animate.
function FileIcon() {
  return (
    <svg
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="size-4"
      aria-hidden
    >
      <path
        d="M18.67 2.66H8C7.29 2.66 6.62 2.95 6.12 3.45C5.61 3.95 5.33 4.62 5.33 5.33V26.66C5.33 27.37 5.61 28.05 6.12 28.55C6.62 29.05 7.29 29.33 8 29.33H24C24.71 29.33 25.39 29.05 25.89 28.55C26.39 28.05 26.67 27.37 26.67 26.66V10.66L18.67 2.66Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M18.67 2.66V10.66H26.67"
        stroke="currentColor"
        strokeWidth="3.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

// Exact Figma artwork (frame.svg).
function LockIcon() {
  return (
    <svg
      viewBox="0 0 28 28"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="size-3.5"
      aria-hidden
    >
      <path
        d="M19.83 12.84H8.17C6.88 12.84 5.83 13.88 5.83 15.17V22.17C5.83 23.46 6.88 24.5 8.17 24.5H19.83C21.12 24.5 22.17 23.46 22.17 22.17V15.17C22.17 13.88 21.12 12.84 19.83 12.84Z"
        stroke="#7059FF"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M9.33 12.83V8.17C9.33 6.93 9.83 5.74 10.7 4.87C11.58 3.99 12.76 3.5 14 3.5C15.24 3.5 16.43 3.99 17.3 4.87C18.18 5.74 18.67 6.93 18.67 8.17V12.83"
        stroke="#7059FF"
        strokeWidth="3.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function DocRow({ doc, active }: { doc: Doc; active: boolean }) {
  return (
    <motion.li
      className="relative flex items-center gap-[9px] overflow-hidden rounded-lg py-[9px] pl-[10px] pr-3"
      initial={false}
      animate={{
        backgroundColor: active ? ACTIVE_TINT : REST_TINT,
        scale: active ? 1.015 : 1,
        boxShadow: active ? ACTIVE_SHADOW : REST_SHADOW,
      }}
      transition={{ duration: active ? 0.35 : 0.3, ease: 'easeOut' }}
    >
      {/* Left-to-right sheen that plays once each time the row becomes active. */}
      {active && (
        <motion.span
          key={`sheen-${doc.id}-${active}`}
          aria-hidden
          className="pointer-events-none absolute inset-y-0 -left-1/3 w-1/3"
          style={{
            background:
              'linear-gradient(100deg, transparent 0%, rgba(255,255,255,0.75) 50%, transparent 100%)',
          }}
          initial={{ x: 0, opacity: 0 }}
          animate={{ x: '450%', opacity: [0, 1, 0] }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
        />
      )}

      <motion.span
        className="relative shrink-0"
        initial={false}
        animate={{ x: active ? 2 : 0, color: active ? ICON_ACTIVE : ICON_REST }}
        transition={{ duration: active ? 0.35 : 0.3, ease: 'easeOut' }}
      >
        <FileIcon />
      </motion.span>

      <span className="relative min-w-0 flex-1 truncate font-[family-name:var(--font-dm-sans)] text-[14px] font-medium leading-none text-[#262626]">
        {doc.name}
      </span>

      <span className="relative shrink-0 font-[family-name:var(--font-dm-sans)] text-[13px] font-medium leading-none text-[#8b8b93]">
        {doc.year}
      </span>
    </motion.li>
  )
}

export function DocumentsCard() {
  const reduceMotion = useReducedMotion()
  const [active, setActive] = useState(0)
  const [pulseKey, setPulseKey] = useState(0)

  useEffect(() => {
    if (reduceMotion) return

    const timer = setInterval(() => {
      setActive((prev) => {
        const next = (prev + 1) % DOCS.length
        // Completed a full loop — pulse the lock once.
        if (next === 0) setPulseKey((k) => k + 1)
        return next
      })
    }, STEP_MS)

    return () => clearInterval(timer)
  }, [reduceMotion])

  return (
    <div className="flex w-80 flex-col gap-3.5 p-[18px]">
      <p className="font-[family-name:var(--font-dm-mono)] text-[10.5px] font-medium uppercase leading-none tracking-[0.315px] text-[#7059ff]">
        Documents
      </p>

      <div className="flex items-center gap-1.5">
        <motion.span
          className="shrink-0"
          animate={reduceMotion ? undefined : { scale: [1, 1.12, 1] }}
          transition={{ duration: 0.5, ease: 'easeInOut' }}
          key={pulseKey}
        >
          <LockIcon />
        </motion.span>
        <span className="font-[family-name:var(--font-dm-sans)] text-[12.5px] font-medium leading-none text-[#5b48d8]">
          Kept private to you
        </span>
      </div>

      <ul className="flex flex-col gap-3.5">
        {DOCS.map((doc, i) => (
          <DocRow key={doc.id} doc={doc} active={!reduceMotion && i === active} />
        ))}
      </ul>
    </div>
  )
}

export default DocumentsCard;
