import { motion, useReducedMotion, type Transition } from 'framer-motion'
import { Lock } from 'lucide-react'

type Row = {
  id: string
  title: string
  year: string
}

const ROWS: Row[] = [
  { id: 'roof', title: 'Roof replacement', year: '2025' },
  { id: 'kitchen', title: 'Kitchen remodel', year: '2023' },
  { id: 'hvac', title: 'HVAC install', year: '2021' },
]

// One full loop. Everything is expressed as a fraction of this duration so the
// keyframe timelines line up. The loop is seamless because every animated value
// starts and ends on the same frame (the chip only differs while opacity is 0,
// so its scale/rotate reset is invisible).
const D = 6.8

const CardCheck = () => (
  <svg width={12} height={12} viewBox="0 0 24 24" fill="none" aria-hidden>
    <path
      d="M20 6L9 17l-5-5"
      stroke="#16A34A"
      strokeWidth={2.75}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
)

export function RecordEnduresCard() {
  const reduce = useReducedMotion()
  const animate = !reduce

  const loop = (extra: Omit<Transition, 'duration' | 'repeat'>): Transition => ({
    duration: D,
    repeat: Infinity,
    repeatDelay: 0,
    ...extra,
  })

  // Card breathes a single 1px sympathetic dip as the stamp lands.
  const cardDip = animate
    ? {
        y: [0, 1, 0, 0],
      }
    : undefined

  return (
    <motion.div
      className="w-[340px] overflow-hidden bg-white"
      style={{
        border: '1px solid #E8E8EC',
        borderRadius: 14,
        boxShadow: '0 8px 24px -6px rgba(27,20,97,0.08)',
      }}
      animate={cardDip}
      transition={
        animate
          ? loop({ times: [0, 0.035, 0.06, 1], ease: ['easeOut', 'easeIn', 'linear'] })
          : undefined
      }
    >
      {/* Header */}
      <div
        className="flex items-start justify-between"
        style={{ padding: '14px 16px', borderBottom: '1px solid #F0F0F2' }}
      >
        <div className="flex flex-col gap-[3px]">
          <span className="font-[family-name:var(--font-dm-mono)] text-[8.5px] font-medium uppercase leading-none tracking-[0.26px] text-[#9381FF]">
            Property Profile
          </span>
          <span className="font-[family-name:var(--font-dm-sans)] text-[15px] font-semibold leading-tight text-[#18181B]">
            148 Summit Ave
          </span>
        </div>

        {/* SOLD 2026 — stamps in, holds, fades, re-stamps */}
        <motion.span
          className="shrink-0 font-[family-name:var(--font-dm-mono)] text-[8.5px] font-medium uppercase leading-none text-[#6B6B76]"
          style={{
            backgroundColor: '#EFEFF2',
            borderRadius: 5,
            padding: '3px 8px',
            transformOrigin: 'center',
          }}
          animate={
            animate
              ? {
                  opacity: [0, 1, 1, 0, 0],
                  scale: [1.6, 1, 1, 1, 1],
                  rotate: [-6, 0, 0, 0, 0],
                }
              : { opacity: 1, scale: 1, rotate: 0 }
          }
          transition={
            animate
              ? loop({
                  times: [0, 0.056, 0.897, 0.949, 1],
                  ease: [
                    [0.16, 1, 0.3, 1],
                    'linear',
                    'easeIn',
                    'linear',
                  ],
                })
              : undefined
          }
        >
          Sold 2026
        </motion.span>
      </div>

      {/* Three permanent rows — drawn from the start, they never move. */}
      <div>
        {ROWS.map((row, i) => (
          <div
            key={row.id}
            className="flex items-center gap-3"
            style={{
              padding: '11px 16px',
              borderBottom: i < ROWS.length - 1 ? '1px solid #F4F4F6' : undefined,
            }}
          >
            <span
              className="flex size-5 shrink-0 items-center justify-center rounded-full"
              style={{ backgroundColor: '#E8F5EC' }}
            >
              <CardCheck />
            </span>
            <p className="min-w-0 flex-1 font-[family-name:var(--font-dm-sans)] text-[13px] font-semibold leading-tight text-[#18181B]">
              {row.title}
            </p>
            <span className="shrink-0 font-[family-name:var(--font-dm-sans)] text-[11.5px] font-normal leading-none text-[#8B8B93]">
              {row.year}
            </span>
          </div>
        ))}
      </div>

      {/* Footer band — glows once per loop, otherwise perfectly still. */}
      <motion.div
        className="flex items-center gap-2"
        style={{ padding: '10px 16px', backgroundColor: '#F0EDFF' }}
        animate={
          animate
            ? {
                backgroundColor: ['#F0EDFF', '#F0EDFF', '#E4DEFF', '#F0EDFF', '#F0EDFF'],
              }
            : undefined
        }
        transition={
          animate
            ? loop({
                times: [0, 0.1544, 0.2426, 0.3309, 1],
                ease: ['linear', 'easeInOut', 'easeInOut', 'linear'],
              })
            : undefined
        }
      >
        <motion.span
          className="flex shrink-0 items-center justify-center"
          style={{ transformOrigin: 'center' }}
          animate={animate ? { rotate: [0, 0, 8, -4, 0, 0] } : undefined}
          transition={
            animate
              ? loop({
                  times: [0, 0.1544, 0.22, 0.27, 0.3309, 1],
                  ease: ['linear', 'easeOut', 'easeInOut', 'easeInOut', 'linear'],
                })
              : undefined
          }
        >
          <Lock size={13} color="#7059FF" strokeWidth={2.25} aria-hidden />
        </motion.span>
        <span className="font-[family-name:var(--font-dm-sans)] text-[12px] font-medium leading-none text-[#5B48D8]">
          The record stays with the home.
        </span>
      </motion.div>
    </motion.div>
  )
}

export default RecordEnduresCard
