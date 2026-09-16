"use client"

import { useEffect, useRef, useState, type ReactNode } from "react"

/**
 * Scales each card animation to fill its iframe viewport.
 *
 * Stage size per card = the card's maximum rendered size, sampled across a
 * full loop of its animation (heights change as rows enter/leave, so a live
 * measurement would make the scale pump — these are fixed instead). Scale is
 * capped at 1: DOM text rasterizes at layout size, so upscaling blurs it.
 */
const PAD = 16
const SIZES: Record<string, [number, number]> = {
  "work-history": [877, 391],
  "documents": [320, 221],
  "neighborhood-network": [320, 222],
  "find-contractor": [320, 193],
  "claim-work": [320, 204],
  "portfolio": [320, 221],
  "get-found": [320, 188],
  "leads": [320, 308],
  "your-street": [320, 201],
  "block-events": [320, 171],
  "town-notices": [320, 201],
  "verified-neighbors": [320, 252],
  "fragmented-tools": [380, 434],
  "property-profile": [409, 294],
}

export default function Fit({
  slug,
  children,
}: {
  slug: string
  children: ReactNode
}) {
  const outerRef = useRef<HTMLDivElement>(null)
  const [scale, setScale] = useState(1)
  const [w, h] = SIZES[slug] ?? [320, 320]

  useEffect(() => {
    const outer = outerRef.current
    if (!outer) return
    const update = () =>
      setScale(
        Math.min(
          1,
          outer.clientWidth / (w + PAD * 2),
          outer.clientHeight / (h + PAD * 2)
        )
      )
    update()
    const ro = new ResizeObserver(update)
    ro.observe(outer)
    return () => ro.disconnect()
  }, [w, h])

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
          width: w,
          height: h,
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
