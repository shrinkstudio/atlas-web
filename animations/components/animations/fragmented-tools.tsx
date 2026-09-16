"use client"

import { useReducedMotion, motion } from "framer-motion"
import {
  Mail,
  StickyNote,
  Table,
  Phone,
  FileText,
  MessageSquare,
  LayoutGrid,
  AppWindow,
  type LucideIcon,
} from "lucide-react"

const STAGE_W = 558
const STAGE_H = 520

type Chip = {
  label: string
  Icon: LucideIcon
  color: string
  x: number
  y: number
  rotate: number
  /** Drift period in seconds; unique so chips never sync. */
  driftDuration: number
  /** Drift phase offset in seconds. */
  driftDelay: number
}

// Order top-to-bottom = pop-in order.
const CHIPS: Chip[] = [
  { label: "Email", Icon: Mail, color: "#5B48D8", x: 252, y: 123, rotate: 3, driftDuration: 6.3, driftDelay: 0 },
  { label: "Sticky notes", Icon: StickyNote, color: "#EA8A3E", x: 114, y: 163, rotate: -5, driftDuration: 8.1, driftDelay: 1.2 },
  { label: "Spreadsheets", Icon: Table, color: "#16A34A", x: 294, y: 182, rotate: -2, driftDuration: 5.5, driftDelay: 2.4 },
  { label: "Phone calls", Icon: Phone, color: "#2563EB", x: 319, y: 252, rotate: -4, driftDuration: 9.5, driftDelay: 0.6 },
  { label: "Paper files", Icon: FileText, color: "#EA8A3E", x: 131, y: 259, rotate: 5, driftDuration: 7.2, driftDelay: 3.1 },
  { label: "Text messages", Icon: MessageSquare, color: "#16A34A", x: 253, y: 333, rotate: 2, driftDuration: 6.8, driftDelay: 1.8 },
  { label: "Different apps", Icon: LayoutGrid, color: "#2563EB", x: 154, y: 397, rotate: -3, driftDuration: 8.7, driftDelay: 0.9 },
  { label: "Old portals", Icon: AppWindow, color: "#5B48D8", x: 287, y: 469, rotate: 4, driftDuration: 5.9, driftDelay: 2.7 },
]

const POP_FIRST_DELAY = 0.35
const POP_STAGGER = 0.16

const CHIP_SHADOW =
  "0 1px 3px rgba(26,20,64,0.05), 0 6px 16px -2px rgba(26,20,64,0.10)"

function ChipCard({ chip }: { chip: Chip }) {
  const { label, Icon, color } = chip
  return (
    <div
      className="flex items-center whitespace-nowrap rounded-[11px] border border-[#EFEFF1] bg-white"
      style={{
        gap: 9,
        paddingTop: 10,
        paddingBottom: 10,
        paddingLeft: 13,
        paddingRight: 15,
        boxShadow: CHIP_SHADOW,
      }}
    >
      <Icon size={17} color={color} strokeWidth={2} aria-hidden="true" />
      <span
        className="font-sans font-medium"
        style={{ fontSize: 14.5, color: "#33333A", lineHeight: 1 }}
      >
        {label}
      </span>
    </div>
  )
}

export default function FragmentedTools() {
  const prefersReducedMotion = useReducedMotion()

  return (
    <div
      className="relative"
      style={{ width: STAGE_W, height: STAGE_H, background: "transparent" }}
      aria-label="Scattered home-records tools"
    >
      {CHIPS.map((chip, i) => {
        if (prefersReducedMotion) {
          return (
            <div
              key={chip.label}
              className="absolute"
              style={{
                left: chip.x,
                top: chip.y,
                transform: `rotate(${chip.rotate}deg)`,
              }}
            >
              <ChipCard chip={chip} />
            </div>
          )
        }

        return (
          // Position + static rotation live on the outer element so the
          // inner motion layers are free to animate scale and drift.
          <div
            key={chip.label}
            className="absolute"
            style={{
              left: chip.x,
              top: chip.y,
              transform: `rotate(${chip.rotate}deg)`,
              willChange: "transform",
            }}
          >
            {/* Pop-in: fades + overshoots to rest, once. */}
            <motion.div
              initial={{ opacity: 0, scale: 0.4 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{
                type: "spring",
                stiffness: 340,
                damping: 17,
                delay: POP_FIRST_DELAY + i * POP_STAGGER,
              }}
            >
              {/* Endless gentle vertical drift, per-chip phase/period. */}
              <motion.div
                animate={{ y: [-4, 4] }}
                transition={{
                  duration: chip.driftDuration,
                  delay: chip.driftDelay,
                  repeat: Number.POSITIVE_INFINITY,
                  repeatType: "reverse",
                  ease: "easeInOut",
                }}
              >
                <ChipCard chip={chip} />
              </motion.div>
            </motion.div>
          </div>
        )
      })}
    </div>
  )
}
