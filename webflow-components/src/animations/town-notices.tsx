import { useEffect, useState } from 'react'
import {
  AnimatePresence,
  motion,
  useReducedMotion,
  type Transition,
} from 'framer-motion'
import {
  Trash2,
  CreditCard,
  House,
  Brush,
  Leaf,
  ShoppingBasket,
  type LucideIcon,
} from 'lucide-react'

type Notice = {
  id: string
  label: string
  date: string
  Icon: LucideIcon
}

// Notice pool cycled through the three slots so the board always shows the next three.
const NOTICES: Notice[] = [
  { id: 'recycling', label: 'Recycling collection', date: 'Wed', Icon: Trash2 },
  { id: 'bulk', label: 'Bulk pickup', date: 'Sep 20', Icon: CreditCard },
  { id: 'council', label: 'Council meeting', date: 'Sep 24', Icon: House },
  { id: 'sweeping', label: 'Street sweeping', date: 'Sep 26', Icon: Brush },
  { id: 'leaf', label: 'Leaf pickup begins', date: 'Oct 1', Icon: Leaf },
  { id: 'market', label: 'Farmers market', date: 'Sat', Icon: ShoppingBasket },
]

const ROWS = 3
const CYCLE_MS = 2400
const ROW_STAGGER = 0.15

const EASE = [0.4, 0, 0.2, 1] as const
const FLIP: Transition = { duration: 0.28, ease: EASE }
const FADE: Transition = { duration: 0.28, ease: EASE }

function NoticeIcon({ Icon }: { Icon: LucideIcon }) {
  return <Icon size={15} strokeWidth={2.2} className="text-[#7059ff]" />
}

function Row({ notice, delay }: { notice: Notice; delay: number }) {
  const { Icon } = notice
  return (
    <div className="flex h-9 items-center gap-[9px] rounded-lg bg-[#f7f6fb] py-[10px] pl-[11px] pr-3">
      {/* Icon crossfades to the next one */}
      <div className="relative h-[15px] w-[15px] shrink-0">
        <AnimatePresence initial={false}>
          <motion.span
            key={notice.id}
            className="absolute inset-0 flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ ...FADE, delay }}
          >
            <NoticeIcon Icon={Icon} />
          </motion.span>
        </AnimatePresence>
      </div>

      {/* Label flips like a split-flap card */}
      <div
        className="relative h-4 flex-1"
        style={{ perspective: 400 }}
      >
        <AnimatePresence initial={false}>
          <motion.span
            key={notice.id}
            className="absolute inset-0 origin-center font-sans text-[12.5px] font-medium leading-4 text-[#262626]"
            style={{ backfaceVisibility: 'hidden' }}
            initial={{ rotateX: 90, opacity: 0, filter: 'blur(2px)' }}
            animate={{ rotateX: 0, opacity: 1, filter: 'blur(0px)' }}
            exit={{ rotateX: -90, opacity: 0, filter: 'blur(2px)' }}
            transition={{ ...FLIP, delay }}
          >
            {notice.label}
          </motion.span>
        </AnimatePresence>
      </div>

      {/* Date flips in sync with the label */}
      <div
        className="relative h-[13px] w-[46px] shrink-0"
        style={{ perspective: 400 }}
      >
        <AnimatePresence initial={false}>
          <motion.span
            key={notice.id}
            className="absolute inset-0 origin-center text-right font-mono text-[10px] font-medium leading-[13px] text-[#8b8b93]"
            style={{ backfaceVisibility: 'hidden' }}
            initial={{ rotateX: 90, opacity: 0, filter: 'blur(2px)' }}
            animate={{ rotateX: 0, opacity: 1, filter: 'blur(0px)' }}
            exit={{ rotateX: -90, opacity: 0, filter: 'blur(2px)' }}
            transition={{ ...FLIP, delay }}
          >
            {notice.date}
          </motion.span>
        </AnimatePresence>
      </div>
    </div>
  )
}

function StaticRow({ notice }: { notice: Notice }) {
  const { Icon } = notice
  return (
    <div className="flex h-9 items-center gap-[9px] rounded-lg bg-[#f7f6fb] py-[10px] pl-[11px] pr-3">
      <div className="flex h-[15px] w-[15px] shrink-0 items-center justify-center">
        <NoticeIcon Icon={Icon} />
      </div>
      <span className="flex-1 font-sans text-[12.5px] font-medium leading-4 text-[#262626]">
        {notice.label}
      </span>
      <span className="w-[46px] shrink-0 text-right font-mono text-[10px] font-medium leading-[13px] text-[#8b8b93]">
        {notice.date}
      </span>
    </div>
  )
}

export function TownNoticesBoard() {
  const reduceMotion = useReducedMotion()
  const [cycle, setCycle] = useState(0)

  useEffect(() => {
    if (reduceMotion) return
    const id = setInterval(() => setCycle((c) => c + 1), CYCLE_MS)
    return () => clearInterval(id)
  }, [reduceMotion])

  const rows = Array.from({ length: ROWS }, (_, i) => {
    const notice = NOTICES[(cycle + i) % NOTICES.length]
    return { notice, delay: i * ROW_STAGGER }
  })

  return (
    <section
      aria-label="Town notices"
      className="flex w-80 flex-col gap-[14px] rounded-[14px] border border-[#ececed] bg-white p-[18px] shadow-[0_8px_24px_-6px_rgba(27,20,97,0.08)]"
    >
      <h2 className="font-mono text-[10.5px] font-medium uppercase leading-[13px] tracking-[0.315px] text-[#7059ff]">
        Town Notices
      </h2>

      {reduceMotion
        ? NOTICES.slice(0, ROWS).map((notice) => (
            <StaticRow key={notice.id} notice={notice} />
          ))
        : rows.map(({ notice, delay }, i) => (
            <Row key={i} notice={notice} delay={delay} />
          ))}
    </section>
  )
}

export default TownNoticesBoard;
