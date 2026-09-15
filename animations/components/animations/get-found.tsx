"use client"

import { useEffect, useRef, useState } from "react"
import { motion, useReducedMotion, type Variants } from "framer-motion"

type Pro = {
  query: string
  name: string
  initials: string
  rating: string
}

const POOL: Pro[] = [
  { query: "roofers near Westfield", name: "Vela Roofing", initials: "VR", rating: "4.9 · 34 verified jobs" },
  { query: "HVAC in Westfield", name: "Summit Air", initials: "SA", rating: "4.8 · 27 verified jobs" },
  { query: "gutter cleaning nearby", name: "GC Mike", initials: "GM", rating: "5.0 · 41 verified jobs" },
]

// Smooth, premium ease — not bouncy.
const EASE = [0.22, 0.61, 0.36, 1] as const

const avatarV: Variants = {
  hidden: { opacity: 0, scale: 0.85, transition: { duration: 0.35, ease: EASE } },
  show: { opacity: 1, scale: 1, transition: { duration: 0.45, ease: EASE, delay: 0 } },
}
const nameV: Variants = {
  hidden: { opacity: 0, x: -8, transition: { duration: 0.35, ease: EASE } },
  show: { opacity: 1, x: 0, transition: { duration: 0.4, ease: EASE, delay: 0.18 } },
}
const badgeV: Variants = {
  hidden: { opacity: 0, scale: 0.9, transition: { duration: 0.3, ease: EASE } },
  show: { opacity: 1, scale: 1, transition: { duration: 0.35, ease: EASE, delay: 0.46 } },
}
const checkV: Variants = {
  hidden: { pathLength: 0, transition: { duration: 0.2, ease: EASE } },
  show: { pathLength: 1, transition: { duration: 0.4, ease: EASE, delay: 0.5 } },
}
const ratingV: Variants = {
  hidden: { opacity: 0, y: 2, transition: { duration: 0.3, ease: EASE } },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: EASE, delay: 0.66 } },
}
const noteV: Variants = {
  hidden: { opacity: 0, transition: { duration: 0.35, ease: EASE } },
  show: { opacity: 1, transition: { duration: 0.45, ease: EASE, delay: 0.9 } },
}

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms))

export function GetFoundCard() {
  const reduceMotion = useReducedMotion()
  const [typed, setTyped] = useState("")
  const [reveal, setReveal] = useState(false)
  const [searching, setSearching] = useState(false)
  const [typing, setTyping] = useState(false)
  const [active, setActive] = useState<Pro>(POOL[0])
  const activeRef = useRef(active)
  activeRef.current = active

  useEffect(() => {
    if (reduceMotion) {
      setActive(POOL[0])
      setTyped(POOL[0].query)
      setReveal(true)
      setTyping(false)
      setSearching(false)
      return
    }

    let cancelled = false
    let i = 0

    async function run() {
      while (!cancelled) {
        const item = POOL[i]
        setActive(item)
        setReveal(false)
        setTyped("")
        setSearching(false)
        setTyping(true)
        await sleep(500)
        if (cancelled) return

        // 1. Type the query character by character (~40ms/char).
        for (let c = 1; c <= item.query.length; c++) {
          if (cancelled) return
          setTyped(item.query.slice(0, c))
          await sleep(40)
        }
        if (cancelled) return

        // 2. Short pause as if searching — shimmer sweep.
        setTyping(false)
        setSearching(true)
        await sleep(400)
        if (cancelled) return

        // 3 & 4. Surface the result (staged reveal handled by variants).
        setSearching(false)
        setReveal(true)
        await sleep(1000)
        if (cancelled) return

        // 5. Hold, then clear + fade out and rotate.
        await sleep(1800)
        if (cancelled) return
        setReveal(false)
        setTyped("")
        await sleep(600)
        if (cancelled) return

        i = (i + 1) % POOL.length
      }
    }

    run()
    return () => {
      cancelled = true
    }
  }, [reduceMotion])

  const animateState = reveal ? "show" : "hidden"

  return (
    <div
      className="flex w-80 flex-col gap-[14px] rounded-[14px] border border-[#ececed] bg-[#ffffff] p-[18px]"
      style={{ boxShadow: "0 8px 24px -6px rgba(27,20,97,0.08)" }}
    >
      <p className="font-mono text-[10.5px] font-medium uppercase tracking-[0.315px] text-[#7059ff]">Get Found</p>

      {/* Search bar */}
      <div className="flex items-center gap-2 rounded-[8px] border border-[#ececed] bg-[#f7f6fb] px-[11px] py-[9px]">
        <img src="/figma/get-found/frame.svg" alt="" aria-hidden="true" className="h-[15px] w-[15px] shrink-0" />
        <span className="relative font-sans text-[12.5px] leading-none text-[#717171]">
          {typed}
          {!reduceMotion && typing && (
            <motion.span
              aria-hidden="true"
              className="ml-px inline-block h-[13px] w-px translate-y-[2px] bg-[#717171] align-middle"
              animate={{ opacity: [1, 1, 0, 0] }}
              transition={{ duration: 1, times: [0, 0.5, 0.5, 1], repeat: Infinity, ease: "linear" }}
            />
          )}
        </span>
      </div>

      {/* Reserved result area — fixed height so nothing shifts when it surfaces */}
      <div className="relative flex min-h-[64px] flex-col gap-[14px]">
        {/* Shimmer sweep while "searching" */}
        {!reduceMotion && searching && (
          <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-[8px]">
            <motion.div
              className="absolute inset-y-0 w-1/2"
              style={{
                background:
                  "linear-gradient(90deg, transparent 0%, rgba(112,89,255,0.07) 50%, transparent 100%)",
              }}
              initial={{ x: "-120%" }}
              animate={{ x: "240%" }}
              transition={{ duration: 0.9, ease: "easeInOut", repeat: Infinity }}
            />
          </div>
        )}

        {/* Result row */}
        <div className="flex items-center gap-[10px]">
          <motion.div
            variants={avatarV}
            initial="hidden"
            animate={animateState}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[10px] bg-[#7059ff]"
          >
            <span className="font-sans text-[12.24px] font-semibold text-[#ffffff]">{active.initials}</span>
          </motion.div>

          <div className="flex min-w-0 flex-col gap-[2px]">
            <div className="flex items-center gap-[6px]">
              <motion.span
                variants={nameV}
                initial="hidden"
                animate={animateState}
                className="font-sans text-[13.5px] font-semibold text-[#18181b]"
              >
                {active.name}
              </motion.span>

              <motion.span
                variants={badgeV}
                initial="hidden"
                animate={animateState}
                className="flex items-center gap-[3px] rounded-[5px] bg-[#eaf7ef] py-[2px] pl-[6px] pr-[7px]"
              >
                <svg width="10" height="10" viewBox="0 0 20 20" fill="none" aria-hidden="true">
                  <motion.path
                    d="M16.67 5L7.5 14.17L3.33 10"
                    stroke="#16A34A"
                    strokeWidth={4}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    variants={checkV}
                    initial="hidden"
                    animate={animateState}
                  />
                </svg>
                <span className="font-mono text-[8.5px] font-medium uppercase tracking-[0.085px] text-[#15803d]">
                  Verified
                </span>
              </motion.span>
            </div>

            <motion.span
              variants={ratingV}
              initial="hidden"
              animate={animateState}
              className="flex items-center gap-[3px] font-sans text-[11.5px] text-[#8b8b93]"
            >
              <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M12 2.5l2.9 5.88 6.49.94-4.7 4.58 1.11 6.46L12 17.9l-5.8 3.05 1.11-6.46-4.7-4.58 6.49-.94z" />
              </svg>
              {active.rating}
            </motion.span>
          </div>
        </div>

        {/* Google note */}
        <motion.p
          variants={noteV}
          initial="hidden"
          animate={animateState}
          className="font-sans text-[11.5px] text-[#8b8b93]"
        >
          Your record shows up on Google.
        </motion.p>
      </div>
    </div>
  )
}

export default GetFoundCard;
