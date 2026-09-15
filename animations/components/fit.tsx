"use client"

import { useEffect, useRef, useState, type ReactNode } from "react"

/**
 * Fixed 620x388 design stage (the 16/10 frame the cards were designed
 * against), scaled to the iframe viewport like object-fit: contain.
 * Scale depends only on the viewport, so cards whose height animates
 * (rows entering/leaving) never cause the whole embed to pump.
 */
const STAGE_W = 620
const STAGE_H = 388

export default function Fit({ children }: { children: ReactNode }) {
  const outerRef = useRef<HTMLDivElement>(null)
  const [scale, setScale] = useState(1)

  useEffect(() => {
    const outer = outerRef.current
    if (!outer) return
    const update = () =>
      setScale(
        Math.min(outer.clientWidth / STAGE_W, outer.clientHeight / STAGE_H)
      )
    update()
    const ro = new ResizeObserver(update)
    ro.observe(outer)
    return () => ro.disconnect()
  }, [])

  return (
    <div
      ref={outerRef}
      style={{
        width: "100vw",
        height: "100dvh",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Absolute + translate centering: grid/flex start-align an item
          bigger than its container, which left the stage half off-screen. */}
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: "50%",
          width: STAGE_W,
          height: STAGE_H,
          display: "grid",
          placeItems: "center",
          transform: `translate(-50%, -50%) scale(${scale})`,
        }}
      >
        {children}
      </div>
    </div>
  )
}
