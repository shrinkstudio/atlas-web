import { FIGMA } from "../shared/figma-assets";
import { useEffect, useRef, useState } from "react"
import {
  AnimatePresence,
  motion,
  useAnimationControls,
  useReducedMotion,
} from "framer-motion"

type Lead = {
  title: string
  meta: string
}

const LEAD_POOL: Lead[] = [
  { title: "Roof leak repair", meta: "0.3 mi away · Summit Ave" },
  { title: "Gutter cleaning", meta: "0.6 mi away · Elm St" },
  { title: "Chimney inspection", meta: "0.4 mi away · Oak Ln" },
  { title: "Skylight install", meta: "0.8 mi away · Maple Dr" },
]

const INTERVAL = 1700
const FIRST_DELAY = 500

type FeedItem = {
  key: number
  lead: Lead
}

function LeadCard({ item, isNewest }: { item: FeedItem; isNewest: boolean }) {
  return (
    <motion.div
      layout
      initial={{ y: -12, opacity: 0, scale: 0.98 }}
      animate={{ y: 0, opacity: isNewest ? 1 : 0.55, scale: 1 }}
      exit={{ y: 20, opacity: 0, scale: 0.98 }}
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
      className="flex flex-col gap-2 rounded-[10px] bg-[#f7f6fb] px-[13px] py-3"
    >
      <div className="flex items-center gap-2">
        {isNewest ? (
          <motion.span
            initial={{ opacity: 0, scale: 0.6 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.47, duration: 0.22, ease: [0.34, 1.3, 0.64, 1] }}
            className="rounded-[5px] bg-[#7059ff] px-[7px] py-[3px] font-mono text-[9px] font-medium leading-none tracking-[0.09px] text-white"
          >
            NEW LEAD
          </motion.span>
        ) : (
          <span className="h-[18px]" aria-hidden="true" />
        )}
        <span className="flex-1" />
        <span className="font-sans text-[11px] font-normal text-[#8b8b93]">
          {isNewest ? "just now" : "2m ago"}
        </span>
      </div>
      <h3 className="font-sans text-[14px] font-semibold leading-[1.3] text-[#18181b]">
        {item.lead.title}
      </h3>
      <p className="font-sans text-[12px] font-normal leading-[1.3] text-[#717171]">
        {item.lead.meta}
      </p>
    </motion.div>
  )
}

export function LeadsFeed() {
  const prefersReducedMotion = useReducedMotion()
  const [items, setItems] = useState<FeedItem[]>([])
  const tagControls = useAnimationControls()
  const keyRef = useRef(0)
  const poolRef = useRef(0)

  useEffect(() => {
    if (prefersReducedMotion) {
      // Static: show a single lead card, no loop.
      setItems([{ key: 0, lead: LEAD_POOL[0] }])
      return
    }

    const addLead = () => {
      const lead = LEAD_POOL[poolRef.current % LEAD_POOL.length]
      poolRef.current += 1
      const next: FeedItem = { key: keyRef.current++, lead }
      setItems((prev) => [next, ...prev].slice(0, 2))
      tagControls.start({
        opacity: [0.7, 1],
        scale: [1, 1.03, 1],
        transition: { duration: 0.5, ease: "easeOut" },
      })
    }

    let interval: ReturnType<typeof setInterval>
    const timeout = setTimeout(() => {
      addLead()
      interval = setInterval(addLead, INTERVAL)
    }, FIRST_DELAY)

    return () => {
      clearTimeout(timeout)
      clearInterval(interval)
    }
  }, [prefersReducedMotion, tagControls])

  return (
    <div
      className="flex w-80 flex-col gap-[14px] rounded-[14px] border border-[#ececed] bg-white p-[18px]"
      style={{ boxShadow: "0 8px 24px -6px rgba(27, 20, 97, 0.08)" }}
      aria-label="Live lead feed"
    >
      <span className="font-mono text-[10.5px] font-medium tracking-[0.315px] text-[#7059ff]">
        LEADS
      </span>

      {/* Feed reserves the height of 2 cards so the tag never jumps */}
      <div className="relative h-[192px] overflow-hidden">
        <div className="flex flex-col gap-2">
          <AnimatePresence mode="popLayout" initial={false}>
            {items.map((item, index) => (
              <LeadCard key={item.key} item={item} isNewest={index === 0} />
            ))}
          </AnimatePresence>
        </div>
      </div>

      <motion.div
        animate={tagControls}
        className="flex items-center gap-[6px] rounded-[8px] border border-[#bbf7d0] bg-[#f0fdf4] px-[10px] py-[7px]"
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={FIGMA["leads/frame"]} alt="" className="h-[13px] w-[13px]" aria-hidden="true" />
        <span className="font-sans text-[12px] font-medium text-[#15803d]">
          Six months of leads, free
        </span>
      </motion.div>
    </div>
  )
}

export default LeadsFeed;
