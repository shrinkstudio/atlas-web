import { useEffect, useState } from "react"
import { motion, useReducedMotion } from "framer-motion"
import { Search, House, Check } from "lucide-react"

const sans = { fontFamily: "var(--font-dm-sans)" }

const FULL_TEXT = "148 Summit Ave, Westfield NJ"
const CHAR_MS = 45

// Loop timing (ms)
const START_HOLD = 500 // empty field beat before typing

const POP_BEAT = 550 // pause after the row pops in
const PRESS_DUR = 260 // button self-press
const CLAIM_BEAT = 260 // gap after chip flips
const HOLD = 1800 // hold on the claimed state
const RESET_DUR = 450 // fade out + clear

const EASE_OUT = [0.16, 1, 0.3, 1] as const

export function ClaimPropertyProfile() {
  const reduced = useReducedMotion()

  const [typed, setTyped] = useState("")
  const [rowIn, setRowIn] = useState(false)
  const [pressing, setPressing] = useState(false)
  const [claimed, setClaimed] = useState(false)

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
        // reset
        setTyped("")
        setRowIn(false)
        setPressing(false)
        setClaimed(false)

        await wait(START_HOLD)
        if (cancelled) return

        // type character by character
        for (let i = 1; i <= FULL_TEXT.length; i++) {
          if (cancelled) return
          setTyped(FULL_TEXT.slice(0, i))
          await wait(CHAR_MS)
        }

        // result row pops in
        setRowIn(true)
        await wait(POP_BEAT)
        if (cancelled) return

        // button presses itself
        setPressing(true)
        await wait(PRESS_DUR)
        if (cancelled) return
        setPressing(false)

        // chip flips to claimed
        setClaimed(true)
        await wait(CLAIM_BEAT)
        if (cancelled) return

        await wait(HOLD)
        if (cancelled) return

        // fade row + reset field, then loop
        setRowIn(false)
        await wait(RESET_DUR)
      }
    }

    run()

    return () => {
      cancelled = true
      timers.forEach(clearTimeout)
    }
  }, [reduced])

  // In reduced-motion mode, render the finished state statically.
  const showTyped = reduced ? FULL_TEXT : typed
  const showRow = reduced ? true : rowIn
  const showClaimed = reduced ? true : claimed
  const typing = !reduced && typed.length < FULL_TEXT.length

  return (
    <div
      className="flex w-[340px] flex-col gap-3"
      style={{
        backgroundColor: "#ffffff",
        border: "1px solid #ECECED",
        borderRadius: 14,
        boxShadow: "0 8px 24px -6px rgba(27, 20, 97, 0.08)",
        padding: 16,
      }}
      role="img"
      aria-label="Claiming a Property Profile: search an address, the result appears, and the home is claimed."
    >
      {/* Search field */}
      <div
        className="flex items-center gap-2"
        style={{
          backgroundColor: "#F7F6FB",
          border: "1px solid #ECECED",
          borderRadius: 8,
          padding: 11,
        }}
      >
        <Search size={15} color="#8B8B93" strokeWidth={2.25} className="shrink-0" aria-hidden />
        <div className="flex min-w-0 flex-1 items-center">
          {showTyped.length === 0 ? (
            <span style={{ ...sans, fontSize: 13, color: "#8B8B93" }}>Search your address</span>
          ) : (
            <span
              className="truncate"
              style={{ ...sans, fontSize: 13, color: "#33333A", lineHeight: "16px" }}
            >
              {showTyped}
            </span>
          )}
          {typing && (
            <motion.span
              aria-hidden
              style={{
                display: "inline-block",
                width: 1,
                height: 15,
                marginLeft: 1,
                backgroundColor: "#33333A",
              }}
              animate={{ opacity: [1, 1, 0, 0] }}
              transition={{ duration: 0.9, repeat: Infinity, ease: "linear" }}
            />
          )}
        </div>
      </div>

      {/* Result row — always occupies its space so the card height never changes */}
      <motion.div
        className="flex items-center gap-3"
        style={{
          backgroundColor: "#F7F6FB",
          borderRadius: 10,
          padding: 12,
        }}
        initial={false}
        animate={
          showRow
            ? { opacity: 1, scale: 1, y: 0 }
            : { opacity: 0, scale: 0.96, y: 6 }
        }
        transition={
          showRow
            ? { type: "spring", stiffness: 520, damping: 22, mass: 0.8 }
            : { duration: RESET_DUR / 1000, ease: EASE_OUT }
        }
      >
        <span
          className="flex shrink-0 items-center justify-center"
          style={{ width: 34, height: 34, backgroundColor: "#EAE6FF", borderRadius: 8 }}
        >
          <House size={16} color="#7059FF" strokeWidth={2.25} aria-hidden />
        </span>

        <div className="flex min-w-0 flex-1 flex-col items-start gap-[5px]">
          <span
            className="truncate"
            style={{ ...sans, fontSize: 14, fontWeight: 600, color: "#18181B", lineHeight: "18px" }}
          >
            148 Summit Ave
          </span>
          <motion.span
            className="inline-flex items-center gap-[3px]"
            style={{
              ...sans,
              fontSize: 10.5,
              fontWeight: 500,
              padding: "3px 8px",
              borderRadius: 5,
              lineHeight: "13px",
              backgroundColor: showClaimed ? "#E8F5EC" : "#EFEFF2",
              color: showClaimed ? "#16A34A" : "#8B8B93",
            }}
            initial={false}
            animate={showClaimed && !reduced ? { scale: [1, 1.12, 1] } : { scale: 1 }}
            transition={{ type: "spring", stiffness: 480, damping: 16, mass: 0.7 }}
          >
            {showClaimed ? "Claimed" : "Unclaimed"}
            {showClaimed && <Check size={11} color="#16A34A" strokeWidth={3} aria-hidden />}
          </motion.span>
        </div>
      </motion.div>

      {/* Claim button */}
      <motion.button
        type="button"
        tabIndex={-1}
        className="w-full"
        style={{
          borderRadius: 10,
          padding: 12,
          ...sans,
          fontSize: 14,
          fontWeight: 500,
          color: "#ffffff",
        }}
        initial={false}
        animate={{
          scale: pressing ? 0.97 : 1,
          backgroundColor: pressing ? "#14103F" : "#1B1461",
        }}
        transition={{ duration: 0.18, ease: EASE_OUT }}
      >
        Claim your home
      </motion.button>
    </div>
  )
}

export default ClaimPropertyProfile
