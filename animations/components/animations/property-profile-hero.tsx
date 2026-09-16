"use client"

import { useEffect, useRef, useState } from "react"
import { AnimatePresence, motion, useReducedMotion, type Transition } from "framer-motion"
import { Clock, Lock } from "lucide-react"

/**
 * Property Profile hero — "the record stays with the home."
 *
 * A single 730px card. Three jobs are permanently confirmed; one is still
 * awaiting the owner. The card plays a calm entrance once, then loops a
 * single story beat: the pending "Deck rebuild" row confirms itself in place
 * and quietly reverts. Only that one row ever changes — everything else is
 * permanent, which is the point. The card's size is fixed for the whole loop:
 * the Confirm button and the CONFIRMED label share one reserved slot, and the
 * subtitle swaps as an in-place crossfade.
 */

const sans = { fontFamily: "var(--font-dm-sans)" }
const mono = { fontFamily: "var(--font-dm-mono)" }

const EASE_OUT: Transition["ease"] = [0.16, 1, 0.3, 1]
const EASE_IN_OUT: Transition["ease"] = [0.65, 0, 0.35, 1]

type Confirmed = { id: string; title: string; subtitle: string }

const CONFIRMED_ROWS: Confirmed[] = [
  { id: "roof", title: "Roof replacement", subtitle: "Vela Roofing · 2025" },
  { id: "kitchen", title: "Kitchen remodel", subtitle: "GC Mike · 2023" },
  { id: "hvac", title: "HVAC install", subtitle: "Summit Air · 2021" },
]

type Avatar = { label: string; gradient?: string; bg?: string; fg: string; size: number }

const AVATARS: Avatar[] = [
  { label: "VR", gradient: "linear-gradient(135deg, #7059FF, #4636B0)", fg: "#ffffff", size: 8.8 },
  { label: "GM", gradient: "linear-gradient(135deg, #16A34A, #15803D)", fg: "#ffffff", size: 8.8 },
  { label: "SA", gradient: "linear-gradient(135deg, #2563EB, #1E40AF)", fg: "#ffffff", size: 8.8 },
  { label: "+1", bg: "#EEF1F6", fg: "#6A6A72", size: 9 },
]

// A drawable green check on a 24-viewBox, sized to `size` px.
function DrawnCheck({ size, active, delay = 0 }: { size: number; active: boolean; delay?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden>
      <motion.path
        d="M20 6L9 17L4 12"
        stroke="#16A34A"
        strokeWidth={2.75}
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={false}
        animate={{ pathLength: active ? 1 : 0, opacity: active ? 1 : 0 }}
        transition={{ duration: active ? 0.4 : 0.25, ease: EASE_OUT, delay: active ? delay : 0 }}
      />
    </svg>
  )
}

function ConfirmedRow({ row, index, play, reduce }: { row: Confirmed; index: number; play: boolean; reduce: boolean }) {
  const shown = reduce || play
  // Cascade top-to-bottom on entrance (~250ms stagger).
  const enter = 0.3 + index * 0.25

  return (
    <motion.div
      className="flex items-center"
      style={{ padding: "13px 24px", gap: 12, borderBottom: "1px solid #F4F4F6" }}
      initial={false}
      animate={{ opacity: shown ? 1 : 0, y: shown ? 0 : 6 }}
      transition={reduce ? { duration: 0 } : { duration: 0.4, ease: EASE_OUT, delay: play ? enter : 0 }}
    >
      <span
        className="flex shrink-0 items-center justify-center rounded-full"
        style={{ width: 24, height: 24, backgroundColor: "#E8F5EC" }}
      >
        <DrawnCheck size={14} active={shown} delay={reduce ? 0 : (play ? enter + 0.12 : 0)} />
      </span>

      <div className="min-w-0 flex-1">
        <p style={{ ...sans, fontSize: 14.5, fontWeight: 600, lineHeight: 1.2, color: "#18181B" }}>{row.title}</p>
        <p style={{ ...sans, fontSize: 12, fontWeight: 400, lineHeight: 1.3, color: "#8B8B93", marginTop: 1 }}>
          {row.subtitle}
        </p>
      </div>

      <span
        className="shrink-0"
        style={{ ...mono, fontSize: 9, fontWeight: 500, letterSpacing: "0.18px", color: "#16A34A" }}
      >
        CONFIRMED
      </span>
    </motion.div>
  )
}

type Beat = "awaiting" | "confirmed"

function PendingRow({
  play,
  reduce,
  beat,
  pressing,
}: {
  play: boolean
  reduce: boolean
  beat: Beat
  pressing: boolean
}) {
  const shown = reduce || play
  const done = beat === "confirmed"

  return (
    <motion.div
      className="flex items-center"
      style={{ paddingTop: 13, paddingBottom: 13, paddingLeft: 24, paddingRight: 20, gap: 12 }}
      initial={false}
      animate={{
        opacity: shown ? 1 : 0,
        y: shown ? 0 : 6,
        // Row tint fades from lavender to white once confirmed.
        backgroundColor: done ? "#FFFFFF" : "#FAF9FF",
      }}
      transition={
        reduce
          ? { duration: 0 }
          : {
              opacity: { duration: 0.4, ease: EASE_OUT, delay: play ? 1.05 : 0 },
              y: { duration: 0.4, ease: EASE_OUT, delay: play ? 1.05 : 0 },
              backgroundColor: { duration: done ? 0.5 : 0.5, ease: EASE_IN_OUT },
            }
      }
    >
      {/* Status circle: clock flips to the drawn green check in place. */}
      <span className="relative flex shrink-0 items-center justify-center" style={{ width: 24, height: 24 }}>
        <motion.span
          className="absolute inset-0 rounded-full"
          initial={false}
          animate={{ backgroundColor: done ? "#E8F5EC" : "#F0EDFF" }}
          transition={{ duration: 0.4, ease: EASE_IN_OUT }}
        />
        <motion.span
          className="absolute inset-0 flex items-center justify-center"
          initial={false}
          animate={{ opacity: done ? 0 : 1 }}
          transition={{ duration: 0.25, ease: EASE_OUT }}
        >
          <Clock size={14} color="#7059FF" strokeWidth={2} />
        </motion.span>
        <span className="absolute inset-0 flex items-center justify-center">
          <DrawnCheck size={14} active={done} />
        </span>
      </span>

      {/* Title + crossfading subtitle (reserved height, no reflow). */}
      <div className="min-w-0 flex-1">
        <p style={{ ...sans, fontSize: 14.5, fontWeight: 600, lineHeight: 1.2, color: "#18181B" }}>Deck rebuild</p>
        <div className="relative" style={{ height: 16, marginTop: 1 }}>
          <motion.p
            className="absolute inset-0 truncate"
            style={{ ...sans, fontSize: 12, fontWeight: 400, lineHeight: "16px", color: "#8B8B93" }}
            initial={false}
            animate={{ opacity: done ? 0 : 1 }}
            transition={{ duration: 0.3, ease: EASE_OUT }}
          >
            Ridge Carpentry · awaiting you
          </motion.p>
          <motion.p
            className="absolute inset-0 truncate"
            style={{ ...sans, fontSize: 12, fontWeight: 400, lineHeight: "16px", color: "#8B8B93" }}
            initial={false}
            animate={{ opacity: done ? 1 : 0 }}
            transition={{ duration: 0.3, ease: EASE_OUT }}
          >
            Ridge Carpentry · 2026
          </motion.p>
        </div>
      </div>

      {/* Reserved right slot: Confirm button and CONFIRMED label share it. */}
      <div className="relative shrink-0" style={{ width: 78, height: 33 }}>
        <motion.div
          className="absolute inset-0 flex items-center justify-end"
          initial={false}
          animate={{ opacity: done ? 0 : 1 }}
          transition={{ duration: 0.3, ease: EASE_OUT }}
        >
          <motion.span
            className="flex items-center justify-center"
            style={{ backgroundColor: "#1B1461", borderRadius: 8, padding: "8px 14px" }}
            initial={false}
            animate={{ scale: pressing ? 0.96 : 1, filter: pressing ? "brightness(0.82)" : "brightness(1)" }}
            transition={{ duration: 0.18, ease: EASE_IN_OUT }}
          >
            <span style={{ ...sans, fontSize: 12.5, fontWeight: 500, lineHeight: 1, color: "#FFFFFF" }}>Confirm</span>
          </motion.span>
        </motion.div>

        <motion.span
          className="absolute inset-0 flex items-center justify-end"
          style={{ ...mono, fontSize: 9, fontWeight: 500, letterSpacing: "0.18px", color: "#16A34A" }}
          initial={false}
          animate={{ opacity: done ? 1 : 0 }}
          transition={{ duration: 0.3, ease: EASE_OUT, delay: done ? 0.15 : 0 }}
        >
          CONFIRMED
        </motion.span>
      </div>
    </motion.div>
  )
}

export function PropertyProfileHero() {
  const reduce = useReducedMotion()
  const [play, setPlay] = useState(false)
  const [beat, setBeat] = useState<Beat>("awaiting")
  const [pressing, setPressing] = useState(false)

  // Wait for the shell's "ruxlo:play"; auto-start after 1.8s otherwise.
  // Both paths are idempotent.
  useEffect(() => {
    if (reduce) {
      setPlay(true)
      return
    }
    const onMsg = (e: MessageEvent) => {
      if (e.data && e.data.type === "ruxlo:play") setPlay(true)
    }
    window.addEventListener("message", onMsg)
    const t = window.setTimeout(() => setPlay(true), 1800)
    return () => {
      window.removeEventListener("message", onMsg)
      window.clearTimeout(t)
    }
  }, [reduce])

  // The looping story beat. Starts once the entrance has settled.
  const timers = useRef<ReturnType<typeof setTimeout>[]>([])
  useEffect(() => {
    if (reduce || !play) return
    let cancelled = false
    const wait = (ms: number) =>
      new Promise<void>((resolve) => {
        timers.current.push(setTimeout(resolve, ms))
      })

    async function loop() {
      // Let the entrance finish before the first beat.
      await wait(1800)
      while (!cancelled) {
        await wait(1500) // settle on the awaiting state
        if (cancelled) return
        // The Confirm button presses itself.
        setPressing(true)
        await wait(180)
        if (cancelled) return
        setPressing(false)
        // The row transforms in place.
        setBeat("confirmed")
        await wait(2500) // hold the completed state
        if (cancelled) return
        // Quietly revert to awaiting, then repeat.
        setBeat("awaiting")
        await wait(500)
      }
    }

    loop()
    return () => {
      cancelled = true
      timers.current.forEach(clearTimeout)
      timers.current = []
    }
  }, [reduce, play])

  const headerShown = reduce || play

  return (
    <div
      className="overflow-hidden bg-white"
      style={{
        width: 730,
        borderRadius: 18,
        border: "1px solid #E8E8EC",
        boxShadow: "0 24px 56px -6px rgba(26,20,64,0.08)",
      }}
      role="img"
      aria-label="Property profile for 148 Summit Ave. Three jobs are permanently confirmed; a pending deck rebuild is confirmed by the owner. The record stays with the home."
    >
      {/* Header */}
      <motion.div
        className="flex flex-col"
        style={{ padding: "22px 24px 18px", gap: 10 }}
        initial={false}
        animate={{ opacity: headerShown ? 1 : 0, y: headerShown ? 0 : 4 }}
        transition={reduce ? { duration: 0 } : { duration: 0.4, ease: EASE_OUT }}
      >
        {/* Line 1 */}
        <div className="flex items-start justify-between">
          <div className="flex flex-col" style={{ gap: 4 }}>
            <span style={{ ...mono, fontSize: 9, fontWeight: 500, letterSpacing: "0.27px", color: "#9381FF" }}>
              PROPERTY PROFILE
            </span>
            <span style={{ ...sans, fontSize: 20, fontWeight: 600, lineHeight: 1, color: "#18181B" }}>
              148 Summit Ave
            </span>
          </div>

          <span
            className="flex items-center"
            style={{ backgroundColor: "#E8F5EC", borderRadius: 100, padding: "6px 11px 6px 9px", gap: 5 }}
          >
            <DrawnCheck size={13} active={headerShown} delay={reduce ? 0 : 0.35} />
            <span style={{ ...sans, fontSize: 12, fontWeight: 500, lineHeight: 1, color: "#15803D" }}>Claimed</span>
          </span>
        </div>

        {/* Line 2 */}
        <div className="flex items-center">
          <span style={{ ...sans, fontSize: 13, fontWeight: 400, color: "#8B8B93" }}>Westfield, NJ</span>
          <span
            className="shrink-0"
            style={{ width: 3, height: 3, borderRadius: 100, backgroundColor: "#8B8B93", margin: "0 8px" }}
            aria-hidden
          />
          <span style={{ ...sans, fontSize: 13, fontWeight: 400, color: "#8B8B93" }}>Est. $612,000</span>

          <span className="flex-1" aria-hidden />

          {/* Avatar stack */}
          <div className="flex items-center">
            {AVATARS.map((a, i) => (
              <span
                key={a.label}
                className="flex items-center justify-center rounded-full"
                style={{
                  width: 26,
                  height: 26,
                  marginLeft: i === 0 ? 0 : -8,
                  background: a.gradient ?? a.bg,
                  boxShadow: "0 0 0 2px #ffffff",
                  zIndex: i,
                }}
              >
                <span style={{ ...sans, fontSize: a.size, fontWeight: 600, lineHeight: 1, color: a.fg }}>
                  {a.label}
                </span>
              </span>
            ))}
          </div>
        </div>
      </motion.div>

      <div style={{ height: 1, backgroundColor: "#F0F0F2" }} aria-hidden />

      {/* Confirmed rows */}
      {CONFIRMED_ROWS.map((row, i) => (
        <ConfirmedRow key={row.id} row={row} index={i} play={play} reduce={!!reduce} />
      ))}

      {/* Pending row that confirms itself on loop */}
      <PendingRow play={play} reduce={!!reduce} beat={beat} pressing={pressing} />

      {/* Footer band */}
      <motion.div
        className="flex items-center"
        style={{ backgroundColor: "#F0EDFF", padding: "13px 24px", gap: 9 }}
        initial={false}
        animate={{ opacity: headerShown ? 1 : 0 }}
        transition={reduce ? { duration: 0 } : { duration: 0.4, ease: EASE_OUT, delay: play ? 1.25 : 0 }}
      >
        <Lock size={15} color="#1B1461" strokeWidth={2} />
        <span style={{ ...sans, fontSize: 13, fontWeight: 500, color: "#1B1461" }}>
          The record stays with the home when it sells.
        </span>
      </motion.div>
    </div>
  )
}

export default PropertyProfileHero
