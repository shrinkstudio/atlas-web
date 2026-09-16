'use client'

import { useEffect, useState } from 'react'
import { motion, useReducedMotion, type Transition } from 'framer-motion'

/**
 * "Work history record fading into the past" — an ambient hero backdrop.
 * Geometry is verbatim from the Figma frame "who it's for" (877 x 391):
 * a central Work History card whose rows fade down the timeline, ringed by
 * five ghostly scattered documents. It sits behind hero copy, so every
 * motion here is deliberately calm.
 */
const STAGE_W = 877
const STAGE_H = 391

// Central card.
const CARD_X = 254
const CARD_W = 372

type Row = {
  id: string
  title: string
  year: string
  opacity: number // permanent resting opacity — the row never leaves this
  draw: boolean // animate the check drawing on (only the freshest rows)
  pulseYear?: boolean // the "20??" that someone keeps trying to remember
}

const ROWS: Row[] = [
  { id: 'deck', title: 'Deck rebuild', year: '2025', opacity: 1.0, draw: true },
  { id: 'hvac', title: 'HVAC install', year: '2024', opacity: 0.92, draw: true },
  { id: 'kitchen', title: 'Kitchen remodel', year: '2016', opacity: 0.6, draw: false },
  { id: 'roof', title: 'Roof replacement', year: '20??', opacity: 0.34, draw: false, pulseYear: true },
]

const ROW_BASE_DELAY = 0.15
const ROW_STAGGER = 0.35

type Ghost = {
  id: string
  label: string
  x: number
  y: number
  rot: number
  base: number
  period: number // drift/breath period (s) — all different
  phase: number // drift phase offset (s)
}

const GHOSTS: Ghost[] = [
  { id: 'receipt', label: 'RECEIPT', x: 0, y: 26, rot: 6, base: 0.55, period: 9, phase: 0 },
  { id: 'county', label: 'COUNTY FILING', x: 693, y: 46, rot: 4, base: 0.5, period: 13, phase: 1.5 },
  { id: 'warranty', label: 'WARRANTY', x: 60, y: 210, rot: -5, base: 0.42, period: 11, phase: 3 },
  { id: 'permit', label: 'PERMIT', x: 680, y: 217, rot: -6, base: 0.38, period: 14, phase: 4.5 },
  { id: 'memory', label: 'MEMORY', x: 235, y: 296, rot: 3, base: 0.3, period: 8, phase: 2.2 },
]

const CALM: Transition['ease'] = [0.16, 1, 0.3, 1]

// A drawable green check (13px). pathLength lets the freshest rows draw on.
function Check({ animate, draw, delay }: { animate: boolean; draw: boolean; delay: number }) {
  const shouldDraw = animate && draw
  return (
    <svg width={13} height={13} viewBox="0 0 13 13" fill="none" aria-hidden>
      <motion.path
        d="M3 6.9 L5.4 9.4 L10 3.8"
        stroke="#16A34A"
        strokeWidth={1.8}
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={shouldDraw ? { pathLength: 0 } : false}
        animate={shouldDraw ? { pathLength: 1 } : { pathLength: 1 }}
        transition={shouldDraw ? { duration: 0.4, ease: 'easeOut', delay } : { duration: 0 }}
      />
    </svg>
  )
}

function TimelineRow({ row, index, play, reduce }: { row: Row; index: number; play: boolean; reduce: boolean }) {
  const revealed = play || reduce
  const enterDelay = ROW_BASE_DELAY + index * ROW_STAGGER

  return (
    <motion.div
      className="flex items-center gap-[11px] border-b border-[#F4F4F6] px-[22px] py-[13px]"
      initial={reduce ? false : { opacity: 0, y: 8 }}
      animate={revealed ? { opacity: 1, y: 0 } : { opacity: 0, y: 8 }}
      transition={reduce ? { duration: 0 } : { duration: 0.4, ease: CALM, delay: enterDelay }}
    >
      <span
        className="flex size-[22px] shrink-0 items-center justify-center rounded-full bg-[#E8F5EC]"
        style={{ opacity: row.opacity }}
      >
        <Check animate={play && !reduce} draw={row.draw} delay={enterDelay + 0.45} />
      </span>
      <span
        className="min-w-0 flex-1 font-[family-name:var(--font-dm-sans)] text-[14px] font-semibold leading-none text-[#18181B]"
        style={{ opacity: row.opacity }}
      >
        {row.title}
      </span>
      {row.pulseYear ? (
        <motion.span
          className="shrink-0 font-[family-name:var(--font-dm-sans)] text-[12px] font-normal leading-none text-[#8B8B93]"
          initial={false}
          animate={play && !reduce ? { opacity: [0.34, 0.55, 0.34] } : { opacity: row.opacity }}
          transition={
            play && !reduce
              ? { duration: 1.2, ease: 'easeInOut', repeat: Number.POSITIVE_INFINITY, repeatDelay: 2.8 }
              : { duration: 0 }
          }
        >
          {row.year}
        </motion.span>
      ) : (
        <span
          className="shrink-0 font-[family-name:var(--font-dm-sans)] text-[12px] font-normal leading-none text-[#8B8B93]"
          style={{ opacity: row.opacity }}
        >
          {row.year}
        </span>
      )}
    </motion.div>
  )
}

function SkeletonRow({ play, reduce }: { play: boolean; reduce: boolean }) {
  const revealed = play || reduce
  const enterDelay = ROW_BASE_DELAY + ROWS.length * ROW_STAGGER

  return (
    <motion.div
      className="px-[22px] py-[13px]"
      style={{ opacity: 0.16 }}
      initial={reduce ? false : { opacity: 0, y: 8 }}
      animate={revealed ? { opacity: 0.16, y: 0 } : { opacity: 0, y: 8 }}
      transition={reduce ? { duration: 0 } : { duration: 0.4, ease: CALM, delay: enterDelay }}
    >
      <div className="flex h-[23px] items-center gap-[11px] overflow-hidden">
        <span className="size-[22px] shrink-0 rounded-full bg-[#F0F0F2]" aria-hidden />
        <span
          className="relative h-[8px] w-[140px] overflow-hidden rounded-[3px]"
          style={{ background: 'rgba(148,148,158,0.25)' }}
          aria-hidden
        >
          {play && !reduce && (
            <motion.span
              className="absolute inset-y-0 -left-1/2 w-1/2"
              style={{
                background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.7) 50%, transparent 100%)',
              }}
              initial={{ x: 0 }}
              animate={{ x: '400%' }}
              transition={{ duration: 0.9, ease: 'easeInOut', repeat: Number.POSITIVE_INFINITY, repeatDelay: 4.1 }}
            />
          )}
        </span>
        <span className="ml-auto font-[family-name:var(--font-dm-sans)] text-[12px] leading-none text-[#C0C0C8]">
          ——
        </span>
      </div>
    </motion.div>
  )
}

function GhostCard({ ghost, play, reduce }: { ghost: Ghost; play: boolean; reduce: boolean }) {
  const revealed = play || reduce
  const enterDelay = 0.1 + GHOSTS.indexOf(ghost) * 0.09
  const ambient = play && !reduce

  return (
    // Position + rotation layer.
    <div className="absolute" style={{ left: ghost.x, top: ghost.y, transform: `rotate(${ghost.rot}deg)` }}>
      {/* Entrance layer: a quiet fade-in (no pop). */}
      <motion.div
        initial={reduce ? false : { opacity: 0 }}
        animate={{ opacity: revealed ? 1 : 0 }}
        transition={reduce ? { duration: 0 } : { duration: 0.6, ease: 'easeOut', delay: enterDelay }}
      >
        {/* Ambient layer: slow drift + opacity breathing (multiplies with the fade above). */}
        <motion.div
          style={ambient ? undefined : { opacity: ghost.base }}
          animate={ambient ? { y: [0, -3, 0], opacity: [ghost.base, ghost.base + 0.06, ghost.base] } : {}}
          transition={
            ambient
              ? {
                  duration: ghost.period,
                  ease: 'easeInOut',
                  repeat: Number.POSITIVE_INFINITY,
                  delay: ghost.phase,
                }
              : { duration: 0 }
          }
        >
          <div
            className="flex w-[178px] flex-col gap-[9px] rounded-[10px] border border-[#E6E6EC] bg-white px-[14px] py-[13px]"
            style={{ boxShadow: '0 4px 12px rgba(26,20,64,0.06)' }}
          >
            <div className="flex items-center gap-[6px]">
              <span className="size-[6px] shrink-0 rounded-full bg-[#A99FD0]" aria-hidden />
              <span className="font-[family-name:var(--font-dm-mono)] text-[8px] font-medium uppercase leading-none tracking-[0.16px] text-[#A99FD0]">
                {ghost.label}
              </span>
            </div>
            <span className="h-[9px] w-[150px] rounded-[3px]" style={{ background: 'rgba(148,148,158,0.22)' }} aria-hidden />
            <span className="h-[7px] w-[100px] rounded-[3px]" style={{ background: 'rgba(148,148,158,0.12)' }} aria-hidden />
            <span className="h-[7px] w-[120px] rounded-[3px]" style={{ background: 'rgba(148,148,158,0.12)' }} aria-hidden />
          </div>
        </motion.div>
      </motion.div>
    </div>
  )
}

export function WorkHistoryScene() {
  const reduce = useReducedMotion()
  const [play, setPlay] = useState(false)

  // Wait for the parent shell's "ruxlo:play" so the entrance runs on-screen;
  // auto-start after 1.8s for standalone visits or a missed message. Both
  // paths are idempotent — once playing, extra triggers are ignored.
  useEffect(() => {
    if (reduce) {
      setPlay(true)
      return
    }
    const onMsg = (e: MessageEvent) => {
      if (e.data && e.data.type === 'ruxlo:play') setPlay(true)
    }
    window.addEventListener('message', onMsg)
    const t = window.setTimeout(() => setPlay(true), 1800)
    return () => {
      window.removeEventListener('message', onMsg)
      window.clearTimeout(t)
    }
  }, [reduce])

  return (
    <div className="relative" style={{ width: STAGE_W, height: STAGE_H }}>
      {/* Ghost documents drift behind the record. */}
      {GHOSTS.map((ghost) => (
        <GhostCard key={ghost.id} ghost={ghost} play={play} reduce={!!reduce} />
      ))}

      {/* Central Work History card. */}
      <div
        className="absolute overflow-hidden rounded-[16px] border border-[#E6E6EC] bg-white"
        style={{ left: CARD_X, top: 0, width: CARD_W, boxShadow: '0 16px 44px -4px rgba(26,20,64,0.08)' }}
      >
        <div className="flex flex-col gap-[5px] px-[22px] pb-[14px] pt-[18px]">
          <span className="font-[family-name:var(--font-dm-mono)] text-[9px] font-medium uppercase leading-none tracking-[0.27px] text-[#9381FF]">
            Work History
          </span>
          <span className="font-[family-name:var(--font-dm-sans)] text-[17px] font-semibold leading-none text-[#18181B]">
            148 Summit Ave
          </span>
        </div>

        <div className="h-px w-full bg-[#F0F0F2]" />

        {ROWS.map((row, i) => (
          <TimelineRow key={row.id} row={row} index={i} play={play} reduce={!!reduce} />
        ))}
        <SkeletonRow play={play} reduce={!!reduce} />

        {/* Gradient veil pinned to the card's bottom edge — the past dissolving. */}
        <div
          className="pointer-events-none absolute inset-x-0 bottom-0 h-[90px]"
          style={{ background: 'linear-gradient(to bottom, transparent, #ffffff)' }}
          aria-hidden
        />
      </div>
    </div>
  )
}

export default WorkHistoryScene
