"use client"

import { useEffect, useRef, useState } from "react"
import { motion, useReducedMotion, type Transition } from "framer-motion"

/**
 * Geometry is taken verbatim from the Figma frame "home-hero" (765 x 492).
 * The shared center of every ring is (382.6, 236.5) in stage pixels.
 */
const STAGE_W = 765
const STAGE_H = 492
const CX = 382.6
const CY = 236.5

const RINGS = [
  { r: 76.5, stroke: "#7059ff", spin: 60 }, // inner
  { r: 150.3, stroke: "#c3b8ef", spin: 82 }, // middle
  { r: 232.3, stroke: "#dcd6f5", spin: 104 }, // outer
]

// Dots live on the middle and outer rings (the inner ring carries none in the design).
const MIDDLE_DOTS = [45, 165, -75]
const OUTER_DOTS = [30, 210]
const MIDDLE_R = 150.3
const OUTER_R = 232.3
const DOT = 22

const LABELS = [
  {
    text: "Home",
    left: 112.06,
    top: 83.46,
    fontSize: 21.86,
    color: "#1b1461",
    icon: true,
    letterSpacing: 0,
    delay: 0.95,
  },
  {
    text: "Neighborhood",
    left: 559.6,
    top: 86.19,
    fontSize: 19.13,
    color: "#7059ff",
    icon: false,
    letterSpacing: -0.38,
    delay: 1.05,
  },
  {
    text: "Town",
    left: 163.99,
    top: 427.83,
    fontSize: 19.13,
    color: "#7059ff",
    icon: false,
    letterSpacing: -0.38,
    delay: 1.15,
  },
]

const PILL_SHADOW = "1.37px 1.37px 32.8px rgba(26, 20, 64, 0.05)"

function dotPosition(deg: number, r: number) {
  const rad = (deg * Math.PI) / 180
  return { x: r * Math.cos(rad), y: r * Math.sin(rad) }
}

const easeOut: Transition["ease"] = [0.16, 1, 0.3, 1]

export default function OrbitHero() {
  const reduce = useReducedMotion()
  const wrapperRef = useRef<HTMLDivElement>(null)
  const [scale, setScale] = useState(1)
  const [play, setPlay] = useState(false)

  // When embedded, the parent shell reveals the iframe in the page-load
  // cadence and posts "ruxlo:play" so the entrance ripple runs on-screen.
  // The timeout covers standalone visits (and a missed message).
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

  useEffect(() => {
    const el = wrapperRef.current
    if (!el) return
    const update = () => setScale(Math.min(1, el.clientWidth / STAGE_W))
    update()
    const ro = new ResizeObserver(update)
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  // Perpetual spin transition helper.
  const spin = (duration: number): Transition =>
    reduce
      ? { duration: 0 }
      : { duration, ease: "linear", repeat: Number.POSITIVE_INFINITY }

  // Entrance transition helper (ripple / fade-in).
  const rippleIn = (delay: number): Transition =>
    reduce ? { duration: 0 } : { duration: 1.1, ease: easeOut, delay }

  return (
    <div
      ref={wrapperRef}
      className="relative mx-auto w-full max-w-[765px]"
      style={{ aspectRatio: `${STAGE_W} / ${STAGE_H}` }}
    >
      {play && (
      <div
        className="absolute left-0 top-0"
        style={{
          width: STAGE_W,
          height: STAGE_H,
          transform: `scale(${scale})`,
          transformOrigin: "top left",
        }}
      >
        {/* Dashed rings */}
        {RINGS.map((ring, i) => {
          const size = ring.r * 2
          return (
            <motion.div
              key={`ring-${i}`}
              className="absolute"
              style={{
                left: CX,
                top: CY,
                width: size,
                height: size,
                marginLeft: -ring.r,
                marginTop: -ring.r,
              }}
              initial={reduce ? false : { scale: 0.6, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={rippleIn(0.15 + i * 0.15)}
            >
              <motion.svg
                width={size}
                height={size}
                viewBox={`0 0 ${size} ${size}`}
                className="absolute inset-0"
                animate={reduce ? undefined : { rotate: 360 }}
                transition={spin(ring.spin)}
                style={{ transformOrigin: "center" }}
              >
                <circle
                  cx={ring.r}
                  cy={ring.r}
                  r={ring.r - 1}
                  fill="none"
                  stroke={ring.stroke}
                  strokeWidth={1.37}
                  strokeDasharray="4 7"
                  strokeLinecap="round"
                />
              </motion.svg>
            </motion.div>
          )
        })}

        {/* Orbiting dot groups (one group per ring, different speeds) */}
        <OrbitGroup
          dots={MIDDLE_DOTS}
          radius={MIDDLE_R}
          duration={55}
          entranceDelay={0.3}
          reduce={!!reduce}
          rippleIn={rippleIn}
          spin={spin}
        />
        <OrbitGroup
          dots={OUTER_DOTS}
          radius={OUTER_R}
          duration={70}
          entranceDelay={0.45}
          reduce={!!reduce}
          rippleIn={rippleIn}
          spin={spin}
        />

        {/* Center house tile (settles in first) */}
        <motion.div
          className="absolute flex items-center justify-center"
          style={{
            left: CX,
            top: CY,
            width: 87.46,
            height: 87.46,
            marginLeft: -43.73,
            marginTop: -43.73,
            borderRadius: 21.86,
            background: "#302588",
          }}
          initial={reduce ? false : { scale: 0.7, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={reduce ? { duration: 0 } : { duration: 0.9, ease: easeOut }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/figma/home/frame.svg"
            alt=""
            aria-hidden="true"
            width={38.26}
            height={38.26}
            style={{ width: 38.26, height: 38.26 }}
          />
        </motion.div>

        {/* Fixed labels with a gentle floating bob */}
        {LABELS.map((label) => (
          <motion.div
            key={label.text}
            className="absolute"
            style={{ left: label.left, top: label.top }}
            initial={reduce ? false : { opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={rippleIn(label.delay)}
          >
            <motion.div
              className="flex items-center whitespace-nowrap"
              style={{
                gap: label.icon ? 10.93 : 0,
                paddingTop: 13.66,
                paddingBottom: 13.66,
                paddingLeft: 20.5,
                paddingRight: 20.5,
                background: "#ffffff",
                border: "1.37px solid #eceaf7",
                borderRadius: 137,
                boxShadow: PILL_SHADOW,
              }}
              animate={reduce ? undefined : { y: [0, -3, 0] }}
              transition={
                reduce
                  ? { duration: 0 }
                  : {
                      duration: 4,
                      ease: "easeInOut",
                      repeat: Number.POSITIVE_INFINITY,
                      delay: label.delay + 0.6,
                    }
              }
            >
              {label.icon && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src="/figma/home/houseline.svg"
                  alt=""
                  aria-hidden="true"
                  width={19.13}
                  height={19.13}
                  style={{ width: 19.13, height: 19.13 }}
                />
              )}
              <span
                style={{
                  fontFamily: "var(--font-dm-sans), sans-serif",
                  fontWeight: 500,
                  fontSize: label.fontSize,
                  lineHeight: 1,
                  color: label.color,
                  letterSpacing: label.letterSpacing,
                }}
              >
                {label.text}
              </span>
            </motion.div>
          </motion.div>
        ))}
      </div>
      )}
    </div>
  )
}

function OrbitGroup({
  dots,
  radius,
  duration,
  entranceDelay,
  reduce,
  rippleIn,
  spin,
}: {
  dots: number[]
  radius: number
  duration: number
  entranceDelay: number
  reduce: boolean
  rippleIn: (delay: number) => Transition
  spin: (duration: number) => Transition
}) {
  return (
    <motion.div
      className="absolute"
      style={{ left: CX, top: CY, width: 0, height: 0 }}
      initial={reduce ? false : { scale: 0.6, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={rippleIn(entranceDelay)}
    >
      <motion.div
        className="absolute"
        style={{ left: 0, top: 0, width: 0, height: 0, transformOrigin: "center" }}
        animate={reduce ? undefined : { rotate: 360 }}
        transition={spin(duration)}
      >
        {dots.map((deg) => {
          const { x, y } = dotPosition(deg, radius)
          return (
            <div
              key={deg}
              className="absolute rounded-full"
              style={{
                left: x,
                top: y,
                width: DOT,
                height: DOT,
                marginLeft: -DOT / 2,
                marginTop: -DOT / 2,
                background: "#7059ff",
                border: "4.1px solid #ffffff",
              }}
            />
          )
        })}
      </motion.div>
    </motion.div>
  )
}
