"use client"

import { useEffect, useState } from "react"
import { motion, useReducedMotion } from "framer-motion"

type Neighbor = {
  name: string
  address: string
  initials: string
}

const POOL: Neighbor[] = [
  { name: "Grace M", address: "148 Summit Ave", initials: "GM" },
  { name: "Dan K", address: "152 Summit Ave", initials: "DK" },
  { name: "Aisha R", address: "140 Summit Ave", initials: "AR" },
  { name: "Tom K", address: "156 Summit Ave", initials: "TK" },
]

const ROWS_PER_CYCLE = 2

// Timing (ms)
const PULSE_LEAD = 500 // wait for the shield pulse before the first row verifies
const ROW_GAP = 800
const SHIMMER = 500
const HOLD = 1600

function pairForCycle(cycle: number): Neighbor[] {
  const start = ((cycle % POOL.length) + POOL.length) % POOL.length
  return Array.from({ length: ROWS_PER_CYCLE }, (_, i) => POOL[(start + i) % POOL.length])
}

function CheckMark({ shown, reduced }: { shown: boolean; reduced: boolean }) {
  const active = reduced || shown
  return (
    <motion.svg
      width={20}
      height={20}
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      className="shrink-0"
      initial={false}
      animate={
        reduced
          ? { scale: 1, opacity: 1 }
          : { scale: shown ? [0.55, 1.18, 1] : 0.55, opacity: shown ? 1 : 0 }
      }
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
    >
      <motion.path
        d="M5 12.5l4.4 4.4L19 7"
        stroke="#16a34a"
        strokeWidth={2.4}
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={false}
        animate={{ pathLength: active ? 1 : 0 }}
        transition={{ duration: 0.45, ease: "easeInOut" }}
      />
    </motion.svg>
  )
}

function NeighborRow({
  neighbor,
  verified,
  shimmering,
  reduced,
}: {
  neighbor: Neighbor
  verified: boolean
  shimmering: boolean
  reduced: boolean
}) {
  return (
    <motion.div
      className="-mx-1.5 flex min-h-[32px] items-center gap-[9px] rounded-[10px] px-1.5 py-1"
      initial={false}
      animate={{
        backgroundColor:
          verified && !reduced
            ? ["rgba(22,163,74,0)", "rgba(22,163,74,0.09)", "rgba(22,163,74,0)"]
            : "rgba(22,163,74,0)",
      }}
      transition={{ duration: 1.3, ease: "easeOut" }}
    >
      <div className="flex size-[30px] shrink-0 items-center justify-center rounded-[8px] bg-[#e9e5fb]">
        <span className="text-[11px] font-semibold leading-none text-[#5b48d8]">{neighbor.initials}</span>
      </div>

      <div className="min-w-0 flex-1">
        <p className="text-[15px] font-semibold leading-tight text-[#18181b]">{neighbor.name}</p>
        <div className="relative mt-0.5 inline-block overflow-hidden rounded">
          <p className="text-[13px] leading-tight text-[#8b8b93]">{neighbor.address}</p>
          {shimmering && !reduced && (
            <motion.div
              aria-hidden="true"
              className="pointer-events-none absolute inset-y-0 -inset-x-2"
              style={{
                background:
                  "linear-gradient(90deg, transparent 0%, rgba(112,89,255,0.22) 50%, transparent 100%)",
              }}
              initial={{ x: "-130%" }}
              animate={{ x: "130%" }}
              transition={{ duration: SHIMMER / 1000, ease: "easeInOut" }}
            />
          )}
        </div>
      </div>

      <div className="grid size-5 place-items-center">
        <CheckMark shown={verified} reduced={reduced} />
      </div>
    </motion.div>
  )
}

export function VerifiedNeighbors() {
  const reduced = useReducedMotion() ?? false

  const [cycle, setCycle] = useState(0)
  const [verified, setVerified] = useState<boolean[]>(() => Array(ROWS_PER_CYCLE).fill(false))
  const [shimmer, setShimmer] = useState<number | null>(null)
  const [pulseKey, setPulseKey] = useState(0)

  const neighbors = reduced ? POOL.slice(0, ROWS_PER_CYCLE) : pairForCycle(cycle)

  useEffect(() => {
    if (reduced) {
      setVerified(Array(ROWS_PER_CYCLE).fill(true))
      setShimmer(null)
      return
    }

    const timers: ReturnType<typeof setTimeout>[] = []

    // Start of a cycle: reset checks, pulse the shield.
    setVerified(Array(ROWS_PER_CYCLE).fill(false))
    setShimmer(null)
    setPulseKey((k) => k + 1)

    for (let i = 0; i < ROWS_PER_CYCLE; i++) {
      const base = PULSE_LEAD + i * ROW_GAP
      timers.push(setTimeout(() => setShimmer(i), base))
      timers.push(
        setTimeout(() => {
          setShimmer((s) => (s === i ? null : s))
          setVerified((v) => {
            const next = [...v]
            next[i] = true
            return next
          })
        }, base + SHIMMER),
      )
    }

    const lastVerify = PULSE_LEAD + (ROWS_PER_CYCLE - 1) * ROW_GAP + SHIMMER
    timers.push(setTimeout(() => setCycle((c) => c + 1), lastVerify + HOLD))

    return () => timers.forEach(clearTimeout)
  }, [cycle, reduced])

  return (
    <div className="flex w-[320px] flex-col gap-[14px] p-[18px] font-sans">
      <p className="font-mono text-[10.5px] font-medium uppercase tracking-[0.315px] text-[#7059ff]">
        Verified neighbors
      </p>

      <div className="flex items-center gap-[7px]">
        <motion.img
          key={pulseKey}
          src="/figma/verified-neighbors/shield.svg"
          alt=""
          aria-hidden="true"
          width={16}
          height={16}
          className="size-4 shrink-0"
          initial={false}
          animate={reduced ? { scale: 1 } : { scale: [1, 1.1, 1] }}
          transition={{ duration: 0.6, ease: "easeInOut" }}
        />
        <span className="text-[13.5px] font-semibold text-[#18181b]">Only real neighbors</span>
      </div>

      <div className="flex flex-col gap-[14px]">
        {neighbors.map((neighbor, i) => (
          <NeighborRow
            key={`${cycle}-${neighbor.initials}`}
            neighbor={neighbor}
            verified={verified[i] ?? false}
            shimmering={shimmer === i}
            reduced={reduced}
          />
        ))}
      </div>

      <p className="text-[13px] text-[#8b8b93]">Verified to their parcel, not a username.</p>
    </div>
  )
}

export default VerifiedNeighbors;
