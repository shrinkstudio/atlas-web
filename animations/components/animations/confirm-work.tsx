"use client"

import { useEffect, useState } from "react"
import { AnimatePresence, motion, useReducedMotion } from "framer-motion"
import { Bell } from "lucide-react"

const EASE_OUT = [0.16, 1, 0.3, 1] as const

const sans = { fontFamily: "var(--font-dm-sans)" }

// Single check mark (24x24 viewBox), drawn with pathLength.
const CHECK_PATH = "M20 6L9 17L4 12"

function DrawnCheck({
  size = 14,
  animate,
  delay = 0,
}: {
  size?: number
  animate: boolean
  delay?: number
}) {
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
        transition={{ duration: 0.32, ease: EASE_OUT, delay: animate ? delay : 0 }}
      />
    </svg>
  )
}

function CardBody({
  play,
  step,
  reduced,
}: {
  play: boolean
  // step: 0 = arriving/idle, 1 = confirm pressed, 2 = confirmed strip
  step: number
  reduced: boolean
}) {
  const confirmed = step >= 2
  const pressing = step === 1

  // Staggered content fade-in on arrival.
  const contentFade = (i: number) =>
    reduced
      ? false
      : {
          initial: { opacity: 0, y: 4 },
          animate: play ? { opacity: 1, y: 0 } : { opacity: 0, y: 4 },
          transition: { duration: 0.4, ease: EASE_OUT, delay: 0.18 + i * 0.12 },
        }

  return (
    <div className="flex flex-col gap-3">
      {/* Notification header */}
      <motion.div className="flex items-center gap-3" {...(contentFade(0) || {})}>
        <div
          className="flex h-[34px] w-[34px] shrink-0 items-center justify-center rounded-[8px]"
          style={{ backgroundColor: "#EAE6FF" }}
        >
          <Bell size={16} color="#7059FF" strokeWidth={2} />
        </div>
        <div className="flex min-w-0 flex-col">
          <p
            className="truncate"
            style={{ ...sans, color: "#18181B", fontSize: 14, fontWeight: 600, lineHeight: "18px" }}
          >
            Vela Roofing added work
          </p>
          <p style={{ ...sans, color: "#8B8B93", fontSize: 12, fontWeight: 400, lineHeight: "16px" }}>
            Roof replacement · Jun 2025
          </p>
        </div>
      </motion.div>

      {/* Question bubble */}
      <motion.div
        className="rounded-[8px] p-[11px]"
        style={{ backgroundColor: "#F7F6FB" }}
        {...(contentFade(1) || {})}
      >
        <p style={{ ...sans, color: "#33333A", fontSize: 13, fontWeight: 400, lineHeight: "18px" }}>
          Did this work happen at your home?
        </p>
      </motion.div>

      {/* Action slot — button row and confirmed strip share this reserved space */}
      <motion.div className="relative h-[38px]" {...(contentFade(2) || {})}>
        <AnimatePresence mode="popLayout" initial={false}>
          {!confirmed ? (
            <motion.div
              key="buttons"
              className="absolute inset-0 flex gap-2"
              initial={reduced ? false : { opacity: 1 }}
              animate={{ opacity: 1 }}
              exit={reduced ? { opacity: 0 } : { opacity: 0 }}
              transition={{ duration: 0.35, ease: EASE_OUT }}
            >
              <motion.div
                className="flex flex-1 items-center justify-center rounded-[8px] p-[10px]"
                initial={false}
                animate={{
                  scale: pressing ? 0.96 : 1,
                  backgroundColor: pressing ? "#128A3C" : "#16A34A",
                }}
                transition={{ duration: 0.16, ease: EASE_OUT }}
              >
                <span
                  className="flex items-center gap-1"
                  style={{ ...sans, color: "#FFFFFF", fontSize: 13, fontWeight: 500, lineHeight: "18px" }}
                >
                  <svg width={13} height={13} viewBox="0 0 24 24" fill="none" aria-hidden>
                    <path
                      d={CHECK_PATH}
                      stroke="#FFFFFF"
                      strokeWidth={3.5}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  Confirm
                </span>
              </motion.div>
              <div
                className="flex flex-1 items-center justify-center rounded-[8px] p-[10px]"
                style={{ border: "1px solid #ECECED" }}
              >
                <span style={{ ...sans, color: "#33333A", fontSize: 13, fontWeight: 500, lineHeight: "18px" }}>
                  Not mine
                </span>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="confirmed"
              className="absolute inset-0 flex items-center justify-center rounded-[8px]"
              style={{ backgroundColor: "#E8F5EC" }}
              initial={reduced ? false : { opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.35, ease: EASE_OUT }}
            >
              <span
                className="flex items-center gap-1"
                style={{ ...sans, color: "#16A34A", fontSize: 13, fontWeight: 500, lineHeight: "18px" }}
              >
                <span className="flex items-center" style={{ marginRight: -6 }}>
                  <DrawnCheck size={14} animate={!reduced} delay={0.05} />
                </span>
                <DrawnCheck size={14} animate={!reduced} delay={0.22} />
                <span className="ml-1">Confirmed by you</span>
              </span>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  )
}

export function ConfirmWork() {
  const reduced = useReducedMotion()

  const [play, setPlay] = useState(false)
  const [step, setStep] = useState(0)

  useEffect(() => {
    if (reduced) return

    let cancelled = false
    const timers: ReturnType<typeof setTimeout>[] = []
    const wait = (ms: number) =>
      new Promise<void>((resolve) => {
        timers.push(setTimeout(resolve, ms))
      })

    async function run() {
      while (!cancelled) {
        // Card slides in, contents fade staggered
        setStep(0)
        setPlay(true)
        await wait(1200) // beat while it settles
        if (cancelled) return

        // Confirm presses itself
        setStep(1)
        await wait(220)
        if (cancelled) return

        // Cross-fade to confirmed strip, checks draw in
        setStep(2)
        await wait(2000) // hold on confirmed
        if (cancelled) return

        // Fade the whole card out
        setPlay(false)
        await wait(700)
        if (cancelled) return
      }
    }

    run()

    return () => {
      cancelled = true
      timers.forEach(clearTimeout)
    }
  }, [reduced])

  return (
    <div
      className="w-[330px]"
      role="img"
      aria-label="A homeowner receives a notification that Vela Roofing added a roof replacement, then confirms the work happened at their home."
    >
      <motion.div
        className="rounded-[14px] p-4"
        style={{
          backgroundColor: "#FFFFFF",
          border: "1px solid #ECECED",
          boxShadow: "0 8px 24px -6px rgba(27, 20, 97, 0.08)",
        }}
        initial={reduced ? false : { opacity: 0, y: -12 }}
        animate={
          reduced
            ? { opacity: 1, y: 0 }
            : play
              ? { opacity: 1, y: 0 }
              : { opacity: 0, y: -12 }
        }
        transition={
          play
            ? { type: "spring", stiffness: 260, damping: 22, mass: 0.9 }
            : { duration: 0.5, ease: EASE_OUT }
        }
      >
        <CardBody play={play} step={reduced ? 2 : step} reduced={!!reduced} />
      </motion.div>
    </div>
  )
}

export default ConfirmWork
