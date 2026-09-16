'use client'

import { useEffect, useState } from 'react'
import {
  AnimatePresence,
  animate,
  motion,
  useReducedMotion,
} from 'framer-motion'

type Contractor = {
  name: string
  initials: string
  rating: number
  trade: string
  city: string
  homes: number
  trust: string
}

const CONTRACTORS: Contractor[] = [
  {
    name: 'Vela Roofing',
    initials: 'VR',
    rating: 4.9,
    trade: 'Roofing',
    city: 'Westfield',
    homes: 3,
    trust: 'Used by {n} homes on Summit Ave',
  },
  {
    name: 'Summit Air',
    initials: 'SA',
    rating: 4.8,
    trade: 'HVAC',
    city: 'Westfield',
    homes: 5,
    trust: 'Used by {n} homes on Elm St',
  },
  {
    name: 'GC Mike',
    initials: 'GM',
    rating: 5.0,
    trade: 'General',
    city: 'Westfield',
    homes: 4,
    trust: 'Used by {n} homes nearby',
  },
]

// Sequence timing (seconds) — one premium, non-bouncy timeline per result.
const T = {
  avatar: 0.15,
  name: 0.4,
  badge: 0.75,
  rating: 1.2,
  ratingDur: 0.6,
  pill: 1.85,
  pillDur: 0.6,
  arrow: 2.55,
}
const CYCLE_MS = 5000

const EASE = [0.22, 1, 0.36, 1] as const

function Counter({
  to,
  decimals = 0,
  delay,
  duration,
}: {
  to: number
  decimals?: number
  delay: number
  duration: number
}) {
  const [value, setValue] = useState(0)

  useEffect(() => {
    setValue(0)
    const controls = animate(0, to, {
      delay,
      duration,
      ease: 'easeOut',
      onUpdate: (v) => setValue(v),
    })
    return () => controls.stop()
  }, [to, delay, duration])

  return <>{value.toFixed(decimals)}</>
}

function RatingStar({ animated }: { animated: boolean }) {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" aria-hidden="true">
      <motion.path
        d="M12 2.2l2.95 5.98 6.6.96-4.78 4.66 1.13 6.57L12 17.27 6.1 20.37l1.13-6.57L2.45 9.14l6.6-.96L12 2.2z"
        fill="#18181b"
        stroke="#18181b"
        strokeWidth="1.4"
        strokeLinejoin="round"
        initial={animated ? { fillOpacity: 0 } : false}
        animate={animated ? { fillOpacity: 1 } : { fillOpacity: 1 }}
        transition={{ delay: T.rating, duration: T.ratingDur, ease: 'easeOut' }}
      />
    </svg>
  )
}

function VerifiedBadge({ animated }: { animated: boolean }) {
  return (
    <motion.svg
      width="17"
      height="17"
      viewBox="0 0 26 27"
      fill="none"
      aria-hidden="true"
      initial={animated ? { scale: 0.6 } : false}
      animate={{ scale: 1 }}
      transition={{ delay: T.badge, duration: 0.4, ease: EASE }}
      style={{ transformOrigin: 'center' }}
    >
      <motion.path
        d="M12.04 3.1C12.33 2.16 13.67 2.16 13.96 3.1L15.85 9.26C15.98 9.68 16.37 9.97 16.81 9.97H23.05C24.01 9.97 24.42 11.18 23.66 11.76L18.52 15.7C18.19 15.96 18.05 16.39 18.17 16.79L20.11 23.1C20.4 24.03 19.32 24.78 18.55 24.19L13.61 20.4C13.25 20.12 12.75 20.12 12.39 20.4L7.45 24.19C6.68 24.78 5.6 24.03 5.89 23.1L7.83 16.79C7.95 16.39 7.81 15.96 7.48 15.7L2.34 11.76C1.58 11.18 1.99 9.97 2.95 9.97H9.19C9.63 9.97 10.02 9.68 10.15 9.26L12.04 3.1Z"
        stroke="#16A34A"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="#16A34A"
        initial={animated ? { pathLength: 0, fillOpacity: 0 } : false}
        animate={{ pathLength: 1, fillOpacity: 1 }}
        transition={{
          pathLength: { delay: T.badge, duration: 0.4, ease: 'easeInOut' },
          fillOpacity: { delay: T.badge + 0.28, duration: 0.25 },
        }}
      />
    </motion.svg>
  )
}

function PillCheck({ animated }: { animated: boolean }) {
  const draw = {
    initial: animated ? { pathLength: 0 } : false,
    animate: { pathLength: 1 },
  }
  return (
    <svg width="16" height="16" viewBox="0 0 28 28" fill="none" aria-hidden="true">
      <motion.path
        d="M24.5 14V22.17C24.5 22.79 24.25 23.38 23.82 23.82C23.38 24.25 22.79 24.5 22.17 24.5H5.83C5.21 24.5 4.62 24.25 4.18 23.82C3.75 23.38 3.5 22.79 3.5 22.17V5.83C3.5 5.21 3.75 4.62 4.18 4.18C4.62 3.75 5.21 3.5 5.83 3.5H18.67"
        stroke="#16A34A"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
        {...draw}
        transition={{ delay: T.pill, duration: 0.35, ease: 'easeInOut' }}
      />
      <motion.path
        d="M10.5 12.83L14 16.33L25.67 4.66"
        stroke="#16A34A"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
        {...draw}
        transition={{ delay: T.pill + 0.2, duration: 0.35, ease: 'easeInOut' }}
      />
    </svg>
  )
}

function ResultContent({
  contractor,
  animated,
}: {
  contractor: Contractor
  animated: boolean
}) {
  const [before, after] = contractor.trust.split('{n}')

  return (
    <div className="flex flex-col gap-[14px]">
      {/* Profile row */}
      <div className="flex items-center gap-[10px]">
        <motion.div
          className="flex h-[38px] w-[38px] shrink-0 items-center justify-center rounded-[11px]"
          style={{ backgroundColor: '#7059ff' }}
          initial={animated ? { scale: 0.85, opacity: 0 } : false}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: T.avatar, duration: 0.25, ease: EASE }}
        >
          <span
            className="font-sans text-[12.9px] font-semibold"
            style={{ color: '#ffffff' }}
          >
            {contractor.initials}
          </span>
        </motion.div>

        <div className="flex min-w-0 flex-col gap-[2px]">
          <div className="flex items-center gap-[6px]">
            <motion.span
              className="font-sans text-[14px] font-semibold leading-none"
              style={{ color: '#18181b' }}
              initial={animated ? { x: -8, opacity: 0 } : false}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: T.name, duration: 0.3, ease: EASE }}
            >
              {contractor.name}
            </motion.span>
            <VerifiedBadge animated={animated} />
          </div>

          <motion.div
            className="flex items-center gap-[5px] font-sans text-[13px] leading-none"
            style={{ color: '#8b8b93' }}
            initial={animated ? { opacity: 0 } : false}
            animate={{ opacity: 1 }}
            transition={{ delay: T.rating, duration: 0.3 }}
          >
            <RatingStar animated={animated} />
            <span style={{ color: '#18181b' }} className="font-medium">
              {animated ? (
                <Counter
                  to={contractor.rating}
                  decimals={1}
                  delay={T.rating}
                  duration={T.ratingDur}
                />
              ) : (
                contractor.rating.toFixed(1)
              )}
            </span>
            <span>{`\u00B7 ${contractor.trade} \u00B7 ${contractor.city}`}</span>
          </motion.div>
        </div>
      </div>

      {/* Trust pill */}
      <motion.div
        className="flex items-center gap-[8px] rounded-[10px] border px-[12px] py-[10px]"
        style={{ backgroundColor: '#f0fdf4', borderColor: '#bbf7d0' }}
        initial={animated ? { y: 8, opacity: 0 } : false}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: T.pill, duration: 0.4, ease: EASE }}
      >
        <PillCheck animated={animated} />
        <span
          className="font-sans text-[13px] font-medium leading-none"
          style={{ color: '#15803d' }}
        >
          {before}
          {animated ? (
            <Counter to={contractor.homes} delay={T.pill} duration={T.pillDur} />
          ) : (
            contractor.homes
          )}
          {after}
        </span>
      </motion.div>

      {/* View their work */}
      <motion.div
        className="flex items-center gap-[8px]"
        initial={animated ? { opacity: 0 } : false}
        animate={{ opacity: 1 }}
        transition={{ delay: T.arrow, duration: 0.3 }}
      >
        <span
          className="font-sans text-[14px] font-semibold leading-none"
          style={{ color: '#7059ff' }}
        >
          View their work
        </span>
        <motion.svg
          width="16"
          height="16"
          viewBox="0 0 26 26"
          fill="none"
          aria-hidden="true"
          animate={animated ? { x: [0, 4, 0] } : { x: 0 }}
          transition={{ delay: T.arrow + 0.1, duration: 0.5, ease: 'easeInOut' }}
        >
          <path
            d="M5.42 13H20.58M14.08 19.5L20.58 13L14.08 6.5"
            stroke="#5B48D8"
            strokeWidth="3.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </motion.svg>
      </motion.div>
    </div>
  )
}

export function ContractorSearch() {
  const prefersReduced = useReducedMotion()
  const [index, setIndex] = useState(0)

  useEffect(() => {
    if (prefersReduced) return
    const id = setInterval(() => {
      setIndex((i) => (i + 1) % CONTRACTORS.length)
    }, CYCLE_MS)
    return () => clearInterval(id)
  }, [prefersReduced])

  const contractor = CONTRACTORS[index]

  return (
    <div
      className="w-[320px] rounded-[14px] border p-[18px]"
      style={{
        backgroundColor: '#ffffff',
        borderColor: '#ececed',
        boxShadow: '0 8px 24px -6px rgba(27, 20, 97, 0.08)',
      }}
    >
      <p
        className="mb-[14px] font-mono text-[10.5px] font-medium uppercase leading-none"
        style={{ color: '#7059ff', letterSpacing: '0.315px' }}
      >
        Find a contractor
      </p>

      {prefersReduced ? (
        <ResultContent contractor={CONTRACTORS[0]} animated={false} />
      ) : (
        <div className="relative h-[130px]">
          <AnimatePresence initial={false}>
            <motion.div
              key={index}
              className="absolute inset-x-0 top-0"
              initial={{ x: 44, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -44, opacity: 0 }}
              transition={{ duration: 0.45, ease: EASE }}
            >
              <ResultContent contractor={contractor} animated />
            </motion.div>
          </AnimatePresence>
        </div>
      )}
    </div>
  )
}
