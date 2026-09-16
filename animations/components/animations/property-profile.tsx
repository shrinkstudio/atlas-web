'use client'

import { useEffect, useState } from 'react'
import { motion, useReducedMotion } from 'framer-motion'

type Item = {
  id: string
  title: string
  subtitle: string
}

const ITEMS: Item[] = [
  { id: 'roof', title: 'Roof replacement', subtitle: 'Vela Roofing · 2021' },
  { id: 'kitchen', title: 'Kitchen remodel', subtitle: 'GC Mike · 2023' },
  { id: 'hvac', title: 'HVAC install', subtitle: 'Summit Air · 2024' },
  { id: 'deck', title: 'Deck rebuild', subtitle: 'Owner-confirmed · 2025' },
]

// Timing (ms)
const START = 400 // header-only beat before the first row
const STAGGER = 550 // gap between each row confirming
const CHECK_OFFSET = 130 // check starts drawing after the circle pops
const TEXT_OFFSET = 240 // title/subtitle slide in
const CONFIRM_OFFSET = 400 // CONFIRMED label lands last

const LAST_ROW = START + (ITEMS.length - 1) * STAGGER
const LAST_CONFIRM = LAST_ROW + CONFIRM_OFFSET
const PILL_DELAY = LAST_CONFIRM + 250 // estimate arrives once history is confirmed
const PILL_DUR = 300
const HOLD = 2000
const EXIT_START = PILL_DELAY + PILL_DUR + HOLD
const EXIT_DUR = 400
const CYCLE_TOTAL = EXIT_START + EXIT_DUR

type Phase = 'in' | 'out'

function rowDelay(i: number) {
  return (START + i * STAGGER) / 1000
}

function Check({ phase, index, animate }: { phase: Phase; index: number; animate: boolean }) {
  return (
    <svg
      width={13}
      height={13}
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden
      className="shrink-0"
    >
      <motion.path
        d="M20 6L9 17l-5-5"
        stroke="#16A34A"
        strokeWidth={2.75}
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={animate ? { pathLength: 0, opacity: 0 } : false}
        animate={
          !animate
            ? { pathLength: 1, opacity: 1 }
            : phase === 'out'
              ? { opacity: 0 }
              : { pathLength: 1, opacity: 1 }
        }
        transition={
          !animate
            ? { duration: 0 }
            : phase === 'out'
              ? { duration: EXIT_DUR / 1000, ease: 'easeIn' }
              : {
                  pathLength: { delay: rowDelay(index) + CHECK_OFFSET / 1000, duration: 0.35, ease: 'easeOut' },
                  opacity: { delay: rowDelay(index) + CHECK_OFFSET / 1000, duration: 0.15 },
                }
        }
      />
    </svg>
  )
}

function RowItem({ item, index, phase, animate }: { item: Item; index: number; phase: Phase; animate: boolean }) {
  const isLast = index === ITEMS.length - 1
  const out = phase === 'out'

  return (
    <div
      className="flex items-center gap-[10.7px] px-[19.5px] py-[12.4px]"
      style={!isLast ? { borderBottom: '1px solid #F2F2F4' } : undefined}
    >
      {/* Circle + drawing check */}
      <motion.span
        className="flex size-[23px] shrink-0 items-center justify-center rounded-full"
        style={{ backgroundColor: '#E8F5EC' }}
        initial={animate ? { scale: 0, opacity: 0 } : false}
        animate={
          !animate
            ? { scale: 1, opacity: 1 }
            : out
              ? { opacity: 0 }
              : { scale: 1, opacity: 1 }
        }
        transition={
          !animate
            ? { duration: 0 }
            : out
              ? { duration: EXIT_DUR / 1000, ease: 'easeIn' }
              : { delay: rowDelay(index), type: 'spring', stiffness: 500, damping: 24, mass: 0.7 }
        }
      >
        <Check phase={phase} index={index} animate={animate} />
      </motion.span>

      {/* Title + subtitle */}
      <motion.div
        className="min-w-0 flex-1"
        initial={animate ? { opacity: 0, x: 8 } : false}
        animate={
          !animate
            ? { opacity: 1, x: 0 }
            : out
              ? { opacity: 0 }
              : { opacity: 1, x: 0 }
        }
        transition={
          !animate
            ? { duration: 0 }
            : out
              ? { duration: EXIT_DUR / 1000, ease: 'easeIn' }
              : { delay: rowDelay(index) + TEXT_OFFSET / 1000, duration: 0.3, ease: [0.16, 1, 0.3, 1] }
        }
      >
        <p className="font-[family-name:var(--font-dm-sans)] text-[12.5px] font-semibold leading-tight text-[#18181B]">
          {item.title}
        </p>
        <p className="mt-[1px] font-[family-name:var(--font-dm-sans)] text-[10.7px] font-normal leading-tight text-[#8B8B93]">
          {item.subtitle}
        </p>
      </motion.div>

      {/* CONFIRMED */}
      <motion.span
        className="shrink-0 font-[family-name:var(--font-dm-mono)] text-[8px] font-medium uppercase leading-none tracking-[0.16px] text-[#16A34A]"
        initial={animate ? { opacity: 0 } : false}
        animate={!animate ? { opacity: 1 } : out ? { opacity: 0 } : { opacity: 1 }}
        transition={
          !animate
            ? { duration: 0 }
            : out
              ? { duration: EXIT_DUR / 1000, ease: 'easeIn' }
              : { delay: rowDelay(index) + CONFIRM_OFFSET / 1000, duration: 0.25 }
        }
      >
        Confirmed
      </motion.span>
    </div>
  )
}

export function PropertyProfileCard() {
  const reduce = useReducedMotion()
  const animate = !reduce
  const [phase, setPhase] = useState<Phase>('in')
  const [cycle, setCycle] = useState(0)

  useEffect(() => {
    if (!animate) return
    const timers: ReturnType<typeof setTimeout>[] = []
    setPhase('in')
    timers.push(setTimeout(() => setPhase('out'), EXIT_START))
    timers.push(setTimeout(() => setCycle((c) => c + 1), CYCLE_TOTAL))
    return () => timers.forEach(clearTimeout)
  }, [cycle, animate])

  const out = phase === 'out'

  return (
    <div
      className="w-[409px] overflow-hidden bg-white"
      style={{
        border: '1px solid #E8E8EC',
        borderRadius: 14,
        boxShadow: '0 18px 43px -5px rgba(26,20,64,0.08)',
      }}
    >
      {/* Header */}
      <div
        className="flex flex-col gap-[3.5px]"
        style={{
          backgroundColor: '#FAF9FC',
          borderBottom: '1px solid #EFEFF2',
          padding: '16px 19.5px 14px',
        }}
      >
        <div className="flex items-center justify-between">
          <span className="font-[family-name:var(--font-dm-mono)] text-[9px] font-medium uppercase leading-none tracking-[0.27px] text-[#9381FF]">
            Property Profile
          </span>
          <motion.span
            className="font-[family-name:var(--font-dm-sans)] text-[10px] font-medium leading-none text-[#16A34A]"
            style={{ backgroundColor: '#E8F5EC', borderRadius: 4.5, padding: '2.7px 7px' }}
            initial={animate ? { opacity: 0, scale: 0.6 } : false}
            animate={
              !animate
                ? { opacity: 1, scale: 1 }
                : out
                  ? { opacity: 0 }
                  : { opacity: 1, scale: 1 }
            }
            transition={
              !animate
                ? { duration: 0 }
                : out
                  ? { duration: EXIT_DUR / 1000, ease: 'easeIn' }
                  : { delay: PILL_DELAY / 1000, type: 'spring', stiffness: 520, damping: 20, mass: 0.7 }
            }
          >
            Est. $612,000
          </motion.span>
        </div>
        <span className="font-[family-name:var(--font-dm-sans)] text-[16px] font-semibold leading-tight text-[#18181B]">
          148 Summit Ave, Westfield NJ
        </span>
      </div>

      {/* Rows — always mounted so the card height never changes */}
      <div key={cycle}>
        {ITEMS.map((item, i) => (
          <RowItem key={item.id} item={item} index={i} phase={phase} animate={animate} />
        ))}
      </div>
    </div>
  )
}

export default PropertyProfileCard
