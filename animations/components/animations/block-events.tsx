'use client'

import { useEffect, useState } from 'react'
import {
  AnimatePresence,
  animate,
  motion,
  useReducedMotion,
} from 'framer-motion'

type Attendee = { initials: string; color: string }

type BlockEvent = {
  month: string
  day: string
  title: string
  detail: string
  going: number
  attendees: Attendee[]
}

const EVENTS: BlockEvent[] = [
  {
    month: 'SEP',
    day: '20',
    title: 'Summit Ave block party',
    detail: 'Sat 2:00 PM · Corner lot',
    going: 12,
    attendees: [
      { initials: 'AR', color: '#7059ff' },
      { initials: 'JM', color: '#9381ff' },
      { initials: 'TK', color: '#5b48d8' },
    ],
  },
  {
    month: 'OCT',
    day: '04',
    title: 'Fall cleanup day',
    detail: 'Sat 9:00 AM · Elm St park',
    going: 18,
    attendees: [
      { initials: 'DL', color: '#7059ff' },
      { initials: 'PR', color: '#9381ff' },
      { initials: 'MG', color: '#5b48d8' },
    ],
  },
  {
    month: 'OCT',
    day: '18',
    title: 'Halloween walk',
    detail: 'Fri 5:00 PM · Oak Ln',
    going: 27,
    attendees: [
      { initials: 'SK', color: '#7059ff' },
      { initials: 'NV', color: '#9381ff' },
      { initials: 'BC', color: '#5b48d8' },
    ],
  },
]

// Timing (seconds) — smooth, premium, not bouncy.
const EASE = [0.22, 1, 0.36, 1] as const
const CONTENT_IN = 0.35
const AVATAR_START = 0.35
const AVATAR_STAGGER = 0.18
const AVATAR_DUR = 0.32
const COUNTER_START = 0.4
const COUNTER_DUR = 0.9
const HOLD_MS = 1900
// One full cycle before advancing to the next event.
const CYCLE_MS =
  (AVATAR_START + 3 * AVATAR_STAGGER + AVATAR_DUR) * 1000 + HOLD_MS

// Step between stacked avatars (24px wide, -8px overlap).
const STACK_STEP = 16
const STACK_ITEMS = 4 // 3 avatars + overflow chip

function Counter({
  value,
  animated,
}: {
  value: number
  animated: boolean
}) {
  const [display, setDisplay] = useState(animated ? 0 : value)

  useEffect(() => {
    if (!animated) {
      setDisplay(value)
      return
    }
    setDisplay(0)
    const controls = animate(0, value, {
      delay: COUNTER_START,
      duration: COUNTER_DUR,
      ease: EASE,
      onUpdate: (v) => setDisplay(Math.round(v)),
    })
    return () => controls.stop()
  }, [value, animated])

  return (
    <span className="text-[12px] leading-[15.6px] text-[#8b8b93] font-sans">
      {/* Fixed-width, tabular number prevents any layout shift as it rolls up. */}
      <span
        className="inline-block text-right tabular-nums"
        style={{ width: `${String(value).length}ch` }}
      >
        {display}
      </span>{' '}
      neighbors going
    </span>
  )
}

function AvatarStack({
  attendees,
  going,
  animated,
}: {
  attendees: Attendee[]
  going: number
  animated: boolean
}) {
  const overflow = going - attendees.length
  const items = [
    ...attendees.map((a) => ({
      key: a.initials,
      label: a.initials,
      color: a.color,
      bg: a.color,
      fg: '#ffffff',
    })),
    {
      key: 'overflow',
      label: `+${overflow}`,
      color: '#ece9ff',
      bg: '#ece9ff',
      fg: '#5b48d8',
    },
  ]

  return (
    // Fixed-width container so the counter text never shifts as avatars pop in.
    <div
      className="relative h-6 shrink-0"
      style={{ width: 24 + (STACK_ITEMS - 1) * STACK_STEP }}
    >
      {items.map((item, i) => (
        <motion.div
          key={item.key}
          className="absolute top-0 flex h-6 w-6 items-center justify-center rounded-[7px] ring-2 ring-white"
          style={{
            left: i * STACK_STEP,
            zIndex: i,
            backgroundColor: item.bg,
            transformOrigin: 'center',
          }}
          initial={animated ? { scale: 0.7, opacity: 0 } : false}
          animate={{ scale: 1, opacity: 1 }}
          transition={{
            delay: AVATAR_START + i * AVATAR_STAGGER,
            duration: AVATAR_DUR,
            ease: EASE,
          }}
        >
          <span
            className="text-[8.16px] font-semibold leading-none font-sans"
            style={{ color: item.fg }}
          >
            {item.label}
          </span>
        </motion.div>
      ))}
    </div>
  )
}

function EventContent({
  event,
  animated,
}: {
  event: BlockEvent
  animated: boolean
}) {
  return (
    <div className="flex flex-col gap-[14px]">
      {/* Date block + title + time slide/fade in together. */}
      <motion.div
        className="flex items-center gap-3"
        initial={animated ? { opacity: 0, y: 8 } : false}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: CONTENT_IN, ease: EASE }}
      >
        <div className="flex flex-col items-center rounded-[10px] bg-[#1b1461] px-3 py-2">
          <span className="text-[9.5px] font-medium leading-none tracking-[0.19px] text-[#9381ff] font-mono">
            {event.month}
          </span>
          <span className="mt-0.5 text-[22px] font-semibold leading-[28.6px] text-white font-sans">
            {event.day}
          </span>
        </div>
        <div className="flex flex-col gap-[3px]">
          <span className="text-[14.5px] font-semibold leading-[18.9px] text-[#18181b] font-sans text-pretty">
            {event.title}
          </span>
          <span className="text-[12px] leading-[15.6px] text-[#717171] font-sans">
            {event.detail}
          </span>
        </div>
      </motion.div>

      {/* Going row — avatar stack + rolling counter. */}
      <div className="flex items-center gap-2">
        <AvatarStack
          attendees={event.attendees}
          going={event.going}
          animated={animated}
        />
        <Counter value={event.going} animated={animated} />
      </div>
    </div>
  )
}

export function BlockEventCard() {
  const prefersReduced = useReducedMotion()
  const animated = !prefersReduced
  const [index, setIndex] = useState(0)

  useEffect(() => {
    if (!animated) return
    const id = window.setTimeout(() => {
      setIndex((i) => (i + 1) % EVENTS.length)
    }, CYCLE_MS)
    return () => window.clearTimeout(id)
  }, [index, animated])

  const event = EVENTS[index]

  return (
    <div
      className="w-80 p-[18px]"
    >
      <span className="text-[10.5px] font-medium leading-[13.7px] tracking-[0.315px] text-[#7059ff] font-mono">
        BLOCK EVENTS
      </span>

      {/* Fixed-height stage lets consecutive events crossfade without reflow. */}
      <div className="relative mt-[14px] h-[95px]">
        {animated ? (
          <AnimatePresence>
            <motion.div
              key={index}
              className="absolute inset-0"
              exit={{ opacity: 0, transition: { duration: 0.35, ease: EASE } }}
            >
              <EventContent event={event} animated />
            </motion.div>
          </AnimatePresence>
        ) : (
          <div className="absolute inset-0">
            <EventContent event={EVENTS[0]} animated={false} />
          </div>
        )}
      </div>
    </div>
  )
}

export default BlockEventCard;
