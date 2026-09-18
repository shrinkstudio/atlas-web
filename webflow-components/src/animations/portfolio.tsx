import { useEffect, useRef, useState } from "react"
import {
  motion,
  animate,
  useMotionValue,
  useTransform,
  useReducedMotion,
} from "framer-motion"

type Pin = {
  /** horizontal center as a percentage of the map width */
  x: number
  /** vertical center as a percentage of the map height */
  y: number
  size: "lg" | "sm"
}

type Town = {
  label: string
  location: string
  total: number
  /** small per-town nudge applied to the shared pin layout, in percent */
  jitter: { dx: number; dy: number }[]
}

// Pin layout carried over from the Figma frame. Larger pins are listed first so
// they drop before the smaller ones. Positions are percentages of the map box.
const BASE_PINS: Pin[] = [
  { x: 20, y: 38, size: "lg" },
  { x: 74, y: 33, size: "lg" },
  { x: 46, y: 60, size: "lg" },
  { x: 37, y: 26, size: "sm" },
  { x: 60, y: 80, size: "sm" },
  { x: 87, y: 70, size: "sm" },
]

const TOWNS: Town[] = [
  {
    label: "Westfield, NJ",
    total: 34,
    location: "Westfield, NJ",
    jitter: [
      { dx: 0, dy: 0 },
      { dx: 0, dy: 0 },
      { dx: 0, dy: 0 },
      { dx: 0, dy: 0 },
      { dx: 0, dy: 0 },
      { dx: 0, dy: 0 },
    ],
  },
  {
    label: "Cranford, NJ",
    total: 28,
    location: "Cranford, NJ",
    jitter: [
      { dx: -3, dy: 4 },
      { dx: 4, dy: -3 },
      { dx: -2, dy: -4 },
      { dx: 3, dy: 3 },
      { dx: -4, dy: 2 },
      { dx: 2, dy: -3 },
    ],
  },
  {
    label: "Summit, NJ",
    total: 41,
    location: "Summit, NJ",
    jitter: [
      { dx: 4, dy: -3 },
      { dx: -3, dy: 4 },
      { dx: 3, dy: 2 },
      { dx: -4, dy: -2 },
      { dx: 2, dy: 4 },
      { dx: -3, dy: -3 },
    ],
  },
]

// Timing (ms)
const PIN_STEP = 200 // gap between each pin drop
const SETTLE = 480 // time for the final pin to visually settle
const HOLD = 1800 // pause once everything is placed
const EXIT_STEP = 55 // stagger between fade-outs
const EXIT_DUR = 260 // fade-out duration per pin

const ALL_PLACED = (BASE_PINS.length - 1) * PIN_STEP + SETTLE
const COUNTER_DUR = ALL_PLACED / 1000 // seconds, tracks the pin drops
const EXIT_TOTAL = (BASE_PINS.length - 1) * EXIT_STEP + EXIT_DUR

export function JobsMapCard() {
  const reduce = useReducedMotion()
  const [townIndex, setTownIndex] = useState(0)
  const [cycle, setCycle] = useState(0)
  const [phase, setPhase] = useState<"enter" | "exit">("enter")

  const town = TOWNS[townIndex]

  const count = useMotionValue(reduce ? town.total : 0)
  const rounded = useTransform(count, (v) => Math.round(v))

  const timers = useRef<ReturnType<typeof setTimeout>[]>([])

  useEffect(() => {
    if (reduce) {
      count.set(town.total)
      return
    }

    setPhase("enter")
    count.set(0)
    const controls = animate(count, town.total, {
      duration: COUNTER_DUR,
      ease: "easeOut",
    })

    const startExit = setTimeout(() => setPhase("exit"), ALL_PLACED + HOLD)
    const nextCycle = setTimeout(() => {
      setTownIndex((i) => (i + 1) % TOWNS.length)
      setCycle((c) => c + 1)
    }, ALL_PLACED + HOLD + EXIT_TOTAL)

    timers.current = [startExit, nextCycle]

    return () => {
      controls.stop()
      timers.current.forEach(clearTimeout)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cycle, reduce])

  return (
    <div
      className="relative flex w-[320px] flex-col gap-3.5 rounded-[14px] border bg-white p-[18px]"
      style={{
        borderColor: "#ececed",
        boxShadow: "0 8px 24px -6px rgba(27, 20, 97, 0.08)",
      }}
    >
      <span
        className="font-mono text-[10.5px] font-medium uppercase"
        style={{ color: "#7059ff", letterSpacing: "0.315px" }}
      >
        Portfolio
      </span>

      {/* Map */}
      <div
        className="relative h-[120px] w-full overflow-hidden rounded-[10px] border"
        style={{ backgroundColor: "#faf9fe", borderColor: "#ece8f6" }}
      >
        {/* Parcel grid */}
        <div className="absolute inset-[8px] grid grid-cols-7 grid-rows-3 gap-[5px]">
          {Array.from({ length: 21 }).map((_, i) => (
            <div
              key={i}
              className="rounded-[3px] border border-dashed"
              style={{ borderColor: "rgba(112, 89, 255, 0.14)" }}
            />
          ))}
        </div>

        {/* Pins */}
        {BASE_PINS.map((pin, i) => {
          const j = town.jitter[i]
          return (
            <MapPin
              key={`${cycle}-${i}`}
              x={pin.x + j.dx}
              y={pin.y + j.dy}
              size={pin.size}
              index={i}
              phase={phase}
              reduce={!!reduce}
            />
          )
        })}
      </div>

      {/* Stat row */}
      <div className="flex items-center gap-2">
        <p
          className="font-sans text-[15px] font-semibold leading-tight"
          style={{ color: "#18181b" }}
        >
          <motion.span
            className="inline-block text-right tabular-nums"
            style={{ minWidth: "2ch" }}
          >
            {rounded}
          </motion.span>{" "}
          jobs on record
        </p>
        <span
          className="ml-auto font-sans text-[12px] font-normal"
          style={{ color: "#8b8b93" }}
        >
          {town.location}
        </span>
      </div>
    </div>
  )
}

function MapPin({
  x,
  y,
  size,
  index,
  phase,
  reduce,
}: {
  x: number
  y: number
  size: "lg" | "sm"
  index: number
  phase: "enter" | "exit"
  reduce: boolean
}) {
  const diameter = size === "lg" ? 13 : 10

  if (reduce) {
    return (
      <div
        className="absolute rounded-full border-2 border-white"
        style={{
          width: diameter,
          height: diameter,
          left: `${x}%`,
          top: `${y}%`,
          backgroundColor: "#7059ff",
          transform: "translate(-50%, -50%)",
        }}
      />
    )
  }

  const dropDelay = (index * PIN_STEP) / 1000

  return (
    <div
      className="absolute"
      style={{ left: `${x}%`, top: `${y}%`, transform: "translate(-50%, -50%)" }}
    >
      {/* expanding pulse ring, emitted once on landing */}
      {phase === "enter" && (
        <motion.span
          className="absolute rounded-full"
          style={{
            width: diameter,
            height: diameter,
            left: "50%",
            top: "50%",
            x: "-50%",
            y: "-50%",
            border: "1.5px solid #7059ff",
          }}
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 3.2, opacity: [0, 0.45, 0] }}
          transition={{
            delay: dropDelay + SETTLE / 1000 - 0.18,
            duration: 0.65,
            ease: "easeOut",
          }}
        />
      )}

      {/* the pin itself */}
      <motion.span
        className="block rounded-full border-2 border-white"
        style={{
          width: diameter,
          height: diameter,
          backgroundColor: "#7059ff",
        }}
        initial={{ y: -12, scale: 0.6, opacity: 0 }}
        animate={
          phase === "exit"
            ? { opacity: 0, scale: 0.8 }
            : { y: 0, scale: 1, opacity: 1 }
        }
        transition={
          phase === "exit"
            ? { delay: index * (EXIT_STEP / 1000), duration: EXIT_DUR / 1000, ease: "easeIn" }
            : {
                delay: dropDelay,
                type: "spring",
                stiffness: 420,
                damping: 30,
                mass: 0.9,
              }
        }
      />
    </div>
  )
}

export default JobsMapCard;
