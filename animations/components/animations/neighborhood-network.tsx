"use client"

import { useEffect, useState } from "react"
import { AnimatePresence, motion, useReducedMotion } from "framer-motion"

type Pair = { q: string; a: string; replies: number }

const PAIRS: Pair[] = [
  { q: "Anyone used a good roofer near here?", a: "Vela did mine, solid work.", replies: 3 },
  { q: "Best HVAC on the block?", a: "Summit Air, came same day.", replies: 4 },
  { q: "Plow guy for this winter?", a: "Dan K keeps a list, ask him.", replies: 5 },
]

// question -> reply (VR pop + typing dots) -> typing (typewriter) -> done (+N counter)
type Phase = "question" | "reply" | "typing" | "done"

const EASE_OUT = [0.16, 1, 0.3, 1] as const

const sans = { fontFamily: "var(--font-dm-sans)" }
const mono = { fontFamily: "var(--font-dm-mono)" }

function TypingDots() {
  return (
    <span className="inline-flex items-center gap-[3px]" aria-hidden>
      {[0, 1, 2].map((i) => (
        <motion.span
          key={i}
          className="block h-[5px] w-[5px] rounded-full"
          style={{ backgroundColor: "#8b8b93" }}
          animate={{ y: [0, -3, 0], opacity: [0.4, 1, 0.4] }}
          transition={{
            duration: 0.9,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
            delay: i * 0.15,
          }}
        />
      ))}
    </span>
  )
}

export function NeighborhoodNetwork() {
  const reducedMotion = useReducedMotion()

  const [pairIndex, setPairIndex] = useState(0)
  const [phase, setPhase] = useState<Phase>("question")
  const [typed, setTyped] = useState("")
  const [count, setCount] = useState(0)
  const [bump, setBump] = useState(false)

  const pair = PAIRS[pairIndex]

  useEffect(() => {
    if (reducedMotion) return

    let cancelled = false
    const timers: ReturnType<typeof setTimeout>[] = []
    const wait = (ms: number) =>
      new Promise<void>((resolve) => {
        timers.push(setTimeout(resolve, ms))
      })

    async function run() {
      let i = 0
      while (!cancelled) {
        // 1. Header only + question slides in
        setPairIndex(i)
        setPhase("question")
        setTyped("")
        setCount(0)
        setBump(false)

        await wait(350) // question fade/slide
        if (cancelled) return
        await wait(500) // beat before reply appears
        if (cancelled) return

        // 3. Reply row: VR pops in + typing indicator
        setPhase("reply")
        await wait(1100)
        if (cancelled) return

        // 4. Typewriter reply
        setPhase("typing")
        const text = PAIRS[i].a
        for (let c = 1; c <= text.length; c++) {
          await wait(35)
          if (cancelled) return
          setTyped(text.slice(0, c))
        }

        // 5. +N replies counts up
        setPhase("done")
        const target = PAIRS[i].replies
        for (let n = 1; n <= target; n++) {
          await wait(180)
          if (cancelled) return
          setCount(n)
        }
        setBump(true) // tiny bump on settle

        // 6. Hold, then loop (AnimatePresence handles the fade-out)
        await wait(1800)
        if (cancelled) return

        i = (i + 1) % PAIRS.length
      }
    }

    run()

    return () => {
      cancelled = true
      timers.forEach(clearTimeout)
    }
  }, [reducedMotion])

  // Static final state for reduced motion
  const staticText = reducedMotion ? pair.a : typed
  const staticCount = reducedMotion ? pair.replies : count
  const showReply = reducedMotion || phase === "reply" || phase === "typing" || phase === "done"
  const showDots = !reducedMotion && phase === "reply"
  const showText = reducedMotion || phase === "typing" || phase === "done"
  const showCaret = !reducedMotion && phase === "typing"
  const showCounter = reducedMotion || phase === "done"

  const content = (
    <>
      {/* Question row */}
      <motion.div
        className="flex items-start gap-2"
        initial={reducedMotion ? false : { opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: EASE_OUT }}
      >
        <div
          className="flex h-[30px] w-[30px] shrink-0 items-center justify-center rounded-lg"
          style={{ backgroundColor: "#e9e5fb" }}
        >
          <span style={{ ...sans, color: "#5b48d8", fontSize: 10.2, fontWeight: 600 }}>GM</span>
        </div>
        <div className="flex-1 rounded-[10px] px-3 py-[9px]" style={{ backgroundColor: "#f5f2ff" }}>
          <p style={{ ...sans, color: "#5b48d8", fontSize: 11, fontWeight: 600, lineHeight: "14.3px" }}>
            Grace M · Summit Ave
          </p>
          <p
            className="mt-[2px]"
            style={{ ...sans, color: "#333333", fontSize: 13, fontWeight: 400, lineHeight: "16.9px" }}
          >
            {pair.q}
          </p>
        </div>
      </motion.div>

      {/* Reply row — height reserved to avoid layout shift */}
      <div className="flex min-h-[34px] items-stretch gap-2 pl-6">
        {showReply && (
          <>
            <motion.div
              className="flex h-[26px] w-[26px] shrink-0 items-center justify-center rounded-[7px]"
              style={{ backgroundColor: "#7059ff" }}
              initial={reducedMotion ? false : { opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, ease: EASE_OUT }}
            >
              <span style={{ ...sans, color: "#ffffff", fontSize: 8.84, fontWeight: 600 }}>VR</span>
            </motion.div>
            <motion.div
              className="flex flex-1 items-center rounded-[10px] px-3 py-2"
              style={{ backgroundColor: "#ffffff", border: "1px solid #ebebeb" }}
              initial={reducedMotion ? false : { opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, ease: EASE_OUT }}
            >
              {showDots ? (
                <TypingDots />
              ) : (
                <p
                  className="whitespace-nowrap"
                  style={{ ...sans, color: "#333333", fontSize: 12.5, fontWeight: 400, lineHeight: "16.3px" }}
                >
                  {showText ? staticText : ""}
                  {showCaret && (
                    <motion.span
                      aria-hidden
                      className="ml-[1px] inline-block"
                      style={{ color: "#7059ff" }}
                      animate={{ opacity: [1, 1, 0, 0] }}
                      transition={{ duration: 0.8, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                    >
                      |
                    </motion.span>
                  )}
                </p>
              )}
            </motion.div>
          </>
        )}
      </div>

      {/* +N replies — height reserved */}
      <div className="min-h-[13px]">
        {showCounter && (
          <motion.span
            className="inline-block"
            style={{ ...mono, color: "#8b8b93", fontSize: 10, fontWeight: 500, letterSpacing: 0.2 }}
            initial={reducedMotion ? false : { opacity: 0 }}
            animate={{ opacity: 1, scale: bump ? [1, 1.12, 1] : 1 }}
            transition={{ opacity: { duration: 0.3, ease: EASE_OUT }, scale: { duration: 0.28, ease: EASE_OUT } }}
          >
            +{staticCount} REPLIES
          </motion.span>
        )}
      </div>
    </>
  )

  return (
    <div
      className="w-80 p-[18px]"
      style={{
      }}
      role="img"
      aria-label={`Neighborhood Network conversation. Question: ${pair.q} Reply: ${pair.a}. ${pair.replies} replies.`}
    >
      <p
        className="mb-[14px]"
        style={{ ...mono, color: "#7059ff", fontSize: 10.5, fontWeight: 500, letterSpacing: 0.315 }}
      >
        NEIGHBORHOOD NETWORK
      </p>

      {reducedMotion ? (
        <div className="flex flex-col gap-[14px]">{content}</div>
      ) : (
        <AnimatePresence mode="wait">
          <motion.div
            key={pairIndex}
            className="flex flex-col gap-[14px]"
            initial={{ opacity: 1 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.35, ease: EASE_OUT }}
          >
            {content}
          </motion.div>
        </AnimatePresence>
      )}
    </div>
  )
}

export default NeighborhoodNetwork;
