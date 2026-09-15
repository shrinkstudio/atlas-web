'use client'

import { useEffect, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'

type Entry = {
  id: string
  title: string
  company: string
  year: string
}

const ENTRIES: Entry[] = [
  { id: 'roof', title: 'Roof replacement', company: 'Vela Roofing', year: '2025' },
  { id: 'kitchen', title: 'Kitchen remodel', company: 'GC Mike', year: '2023' },
  { id: 'hvac', title: 'HVAC install', company: 'Summit Air', year: '2021' },
  { id: 'deck', title: 'Deck rebuild', company: 'Ridge Carpentry', year: '2020' },
  { id: 'water', title: 'Water heater', company: 'Summit Air', year: '2019' },
]

const VISIBLE = 3
const ROW_STAGGER = 700 // ms between each row entering
const ROW_SETTLE = 400 // ms row entrance duration
const BADGE_AFTER = 150 // ms after row settles before badge pops
const HOLD = 1600 // ms to hold all rows before clearing
const EXIT = 400 // ms clear animation
const START_DELAY = 450 // ms header-only beat before first row

function windowOf(start: number): Entry[] {
  return Array.from({ length: VISIBLE }, (_, i) => ENTRIES[(start + i) % ENTRIES.length])
}

function Bullet() {
  return <span className="mt-[7px] size-[7px] shrink-0 rounded-full bg-[#7059ff]" aria-hidden />
}

function ConfirmedBadge({ animate }: { animate: boolean }) {
  return (
    <motion.div
      className="mt-[3px] flex shrink-0 items-center gap-1.5"
      initial={animate ? { opacity: 0, scale: 0.6 } : false}
      animate={{ opacity: 1, scale: 1 }}
      transition={
        animate
          ? { delay: (ROW_SETTLE + BADGE_AFTER) / 1000, duration: 0.15, ease: 'easeOut' }
          : { duration: 0 }
      }
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/figma/work-history/check.svg" alt="" aria-hidden className="size-3.5" />
      <span className="font-[family-name:var(--font-dm-mono)] text-[11px] font-medium uppercase leading-none tracking-[0.4px] text-[#15803d]">
        Confirmed
      </span>
    </motion.div>
  )
}

function Row({ entry, animate }: { entry: Entry; animate: boolean }) {
  return (
    <motion.li
      layout={animate}
      className="flex items-start gap-2.5"
      initial={animate ? { opacity: 0, y: 12, scale: 0.98 } : false}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={animate ? { opacity: 0, y: -8 } : undefined}
      transition={{ duration: animate ? ROW_SETTLE / 1000 : 0, ease: [0.16, 1, 0.3, 1] }}
    >
      <Bullet />
      <div className="min-w-0 flex-1">
        <p className="font-[family-name:var(--font-dm-sans)] text-[15px] font-semibold leading-tight text-[#18181b]">
          {entry.title}
        </p>
        <p className="mt-0.5 font-[family-name:var(--font-dm-sans)] text-[13px] leading-tight text-[#8b8b93]">
          {entry.company} · {entry.year}
        </p>
      </div>
      <ConfirmedBadge animate={animate} />
    </motion.li>
  )
}

export function WorkHistoryCard() {
  const reduceMotion = useReducedMotion()
  const [rows, setRows] = useState<Entry[]>(reduceMotion ? windowOf(0) : [])

  useEffect(() => {
    if (reduceMotion) {
      setRows(windowOf(0))
      return
    }

    let start = 0
    const timers: ReturnType<typeof setTimeout>[] = []

    const runLoop = () => {
      const set = windowOf(start)
      setRows([])

      // Reveal rows one at a time.
      for (let i = 0; i < VISIBLE; i++) {
        timers.push(
          setTimeout(() => {
            setRows(set.slice(0, i + 1))
          }, START_DELAY + i * ROW_STAGGER),
        )
      }

      // Time from loop start until the last row + its badge have settled.
      const allSettled = START_DELAY + (VISIBLE - 1) * ROW_STAGGER + ROW_SETTLE + BADGE_AFTER + 150

      // Clear the list.
      timers.push(
        setTimeout(() => {
          setRows([])
        }, allSettled + HOLD),
      )

      // Advance the rolling window and restart.
      timers.push(
        setTimeout(() => {
          start = (start + VISIBLE) % ENTRIES.length
          runLoop()
        }, allSettled + HOLD + EXIT),
      )
    }

    runLoop()

    return () => timers.forEach(clearTimeout)
  }, [reduceMotion])

  return (
    <div className="w-80 p-[18px]">
      <p className="font-[family-name:var(--font-dm-mono)] text-[10.5px] font-medium uppercase tracking-[0.315px] text-[#7059ff]">
        Work History
      </p>

      <div className="mt-3.5 flex items-center gap-2">
        <h2 className="flex-1 font-[family-name:var(--font-dm-sans)] text-[15px] font-semibold leading-snug text-[#18181b]">
          148 Summit Ave
        </h2>
        <span className="size-2 rounded-full bg-[#16a34a]" aria-hidden />
        <span className="font-[family-name:var(--font-dm-sans)] text-[11.5px] font-medium text-[#15803d]">
          Claimed
        </span>
      </div>

      <div className="mt-3.5 h-px w-full bg-[#f2f2f4]" />

      {/* Fixed height + clip: entering/exiting rows overlap in the flow and
          would grow the card ~90px mid-transition; they swap inside this
          window instead so the card never changes size. */}
      <ul className="mt-3.5 flex h-[150px] flex-col gap-3.5 overflow-hidden">
        <AnimatePresence mode="popLayout">
          {rows.map((entry) => (
            <Row key={entry.id} entry={entry} animate={!reduceMotion} />
          ))}
        </AnimatePresence>
      </ul>
    </div>
  )
}

export default WorkHistoryCard;
