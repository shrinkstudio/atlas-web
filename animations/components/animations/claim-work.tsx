"use client"

import { useEffect, useState } from "react"
import { AnimatePresence, motion, useReducedMotion } from "framer-motion"

type Job = { title: string; detail: string }

const JOBS: Job[] = [
  { title: "Roof replacement", detail: "148 Summit Ave · 2025" },
  { title: "Fence install", detail: "30 Oak Ln · 2025" },
  { title: "Gutter replacement", detail: "12 Maple Dr · 2024" },
  { title: "Siding repair", detail: "88 Elm St · 2025" },
]

const EASE_OUT = [0.16, 1, 0.3, 1] as const
const EASE_IN_OUT = [0.65, 0, 0.35, 1] as const

const sans = { fontFamily: "var(--font-dm-sans)" }
const mono = { fontFamily: "var(--font-dm-mono)" }

// Exact check path exported from the Figma asset (24x24 viewBox).
const CHECK_PATH = "M20 6L9 17L4 12"

function StaticCheck({ size = 12 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d={CHECK_PATH}
        stroke="#16A34A"
        strokeWidth={4}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function DrawnCheck({ size = 14, animate }: { size?: number; animate: boolean }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden>
      <motion.path
        d={CHECK_PATH}
        stroke="#16A34A"
        strokeWidth={4}
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={animate ? { pathLength: 0 } : false}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.45, ease: EASE_OUT, delay: animate ? 0.08 : 0 }}
      />
    </svg>
  )
}

const PENDING_TINT = { backgroundColor: "#f5f2ff", borderColor: "#e0d9ff" }
const CONFIRMED_TINT = { backgroundColor: "#f0fdf4", borderColor: "#c7ebd2" }

function PendingRow({
  job,
  confirmed,
  pressing,
  reduced,
}: {
  job: Job
  confirmed: boolean
  pressing: boolean
  reduced: boolean
}) {
  return (
    <motion.div
      className="flex items-center gap-[10px] rounded-[10px] border px-3 py-[11px]"
      initial={false}
      animate={confirmed ? CONFIRMED_TINT : PENDING_TINT}
      transition={{ duration: 0.5, ease: EASE_IN_OUT }}
      style={PENDING_TINT}
    >
      <div className="flex min-w-0 flex-1 flex-col gap-[2px]">
        <p
          className="truncate"
          style={{ ...sans, color: "#262626", fontSize: 13.5, fontWeight: 500, lineHeight: "17.6px" }}
        >
          {job.title}
        </p>
        <p style={{ ...sans, color: "#8b8b93", fontSize: 11.5, fontWeight: 400, lineHeight: "15px" }}>
          {job.detail}
        </p>
      </div>

      {/* Right slot — fixed height reserved so the swap never shifts the row */}
      <div className="relative flex h-[30px] shrink-0 items-center justify-end">
        <AnimatePresence mode="popLayout" initial={false}>
          {!confirmed ? (
            <motion.div
              key="claim"
              className="flex items-center rounded-[7px] px-3 py-[7px]"
              style={{ backgroundColor: "#7059ff" }}
              initial={reduced ? false : { opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: pressing ? 0.94 : 1 }}
              exit={reduced ? { opacity: 0 } : { opacity: 0, scale: 0.85 }}
              transition={{
                scale: { duration: 0.18, ease: EASE_IN_OUT },
                opacity: { duration: 0.2, ease: EASE_OUT },
              }}
            >
              <span style={{ ...sans, color: "#ffffff", fontSize: 12, fontWeight: 500, lineHeight: "15.6px" }}>
                Claim
              </span>
            </motion.div>
          ) : (
            <motion.div
              key="confirmed"
              className="flex items-center gap-1"
              initial={reduced ? false : { opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, ease: EASE_OUT }}
            >
              <DrawnCheck size={14} animate={!reduced} />
              <span
                style={{ ...mono, color: "#15803d", fontSize: 9, fontWeight: 500, letterSpacing: 0.18 }}
              >
                CONFIRMED
              </span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  )
}

export function ClaimYourWork() {
  const reduced = useReducedMotion()

  const [jobIndex, setJobIndex] = useState(0)
  const [confirmed, setConfirmed] = useState(false)
  const [pressing, setPressing] = useState(false)
  const [pulse, setPulse] = useState(false)

  useEffect(() => {
    if (reduced) return

    let cancelled = false
    const timers: ReturnType<typeof setTimeout>[] = []
    const wait = (ms: number) =>
      new Promise<void>((resolve) => {
        timers.push(setTimeout(resolve, ms))
      })

    async function run() {
      let i = 0
      while (!cancelled) {
        setJobIndex(i)
        setConfirmed(false)
        setPressing(false)
        setPulse(false)

        await wait(900) // hold on pending
        if (cancelled) return

        // Quick tap on the Claim button
        setPressing(true)
        await wait(180)
        if (cancelled) return
        setPressing(false)

        // Confirm: button swaps to check + CONFIRMED, tint goes green, line pulses
        setConfirmed(true)
        setPulse(true)
        await wait(700)
        if (cancelled) return
        setPulse(false)

        await wait(1400) // hold on confirmed
        if (cancelled) return

        i = (i + 1) % JOBS.length // file it away, next job slides in
      }
    }

    run()

    return () => {
      cancelled = true
      timers.forEach(clearTimeout)
    }
  }, [reduced])

  const job = JOBS[jobIndex]

  return (
    <div
      className="w-80 rounded-[14px] p-[18px]"
      style={{
        backgroundColor: "#ffffff",
        border: "1px solid #ececed",
        boxShadow: "0 8px 24px -6px rgba(27, 20, 97, 0.08)",
      }}
      role="img"
      aria-label="Claim your work. A pending job is claimed and confirmed by the owner, then filed into your record."
    >
      <p
        className="mb-[14px]"
        style={{ ...mono, color: "#7059ff", fontSize: 10.5, fontWeight: 500, letterSpacing: 0.315 }}
      >
        CLAIM YOUR WORK
      </p>

      {/* Top pending slot — reserve height so nothing jumps between jobs */}
      <div className="relative mb-[14px] min-h-[59px]">
        {reduced ? (
          <PendingRow job={JOBS[0]} confirmed={false} pressing={false} reduced />
        ) : (
          <AnimatePresence mode="popLayout" initial={false}>
            <motion.div
              key={jobIndex}
              initial={{ opacity: 0, y: -26 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 26 }}
              transition={{ duration: 0.5, ease: EASE_OUT }}
            >
              <PendingRow job={job} confirmed={confirmed} pressing={pressing} reduced={false} />
            </motion.div>
          </AnimatePresence>
        )}
      </div>

      {/* Bottom row — already recorded, fixed context */}
      <div className="mb-[14px] flex items-center gap-[10px]">
        <div className="flex min-w-0 flex-1 flex-col gap-[2px]">
          <p style={{ ...sans, color: "#262626", fontSize: 13.5, fontWeight: 500, lineHeight: "17.6px" }}>
            HVAC install
          </p>
          <p style={{ ...sans, color: "#8b8b93", fontSize: 11.5, fontWeight: 400, lineHeight: "15px" }}>
            22 Elm St · 2024
          </p>
        </div>
        <div className="flex shrink-0 items-center gap-1">
          <StaticCheck size={12} />
          <span style={{ ...mono, color: "#15803d", fontSize: 9, fontWeight: 500, letterSpacing: 0.18 }}>
            CONFIRMED
          </span>
        </div>
      </div>

      <motion.p
        initial={false}
        animate={
          reduced
            ? { opacity: 1, scale: 1 }
            : pulse
              ? { opacity: [0.6, 1], scale: [1, 1.02, 1] }
              : { opacity: 1, scale: 1 }
        }
        transition={{ duration: 0.45, ease: EASE_OUT }}
        style={{ ...sans, color: "#8b8b93", fontSize: 11.5, fontWeight: 400, lineHeight: "15px", transformOrigin: "left" }}
      >
        The owner confirms it was you.
      </motion.p>
    </div>
  )
}

export default ClaimYourWork;
