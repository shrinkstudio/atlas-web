import { useEffect, useState } from "react"
import {
  AnimatePresence,
  motion,
  useReducedMotion,
  type Variants,
} from "framer-motion"

type Post = {
  message: string
  address: string
  initials: string
}

const POSTS: Post[] = [
  {
    message: "Package dropped at 146 by mistake, on your porch.",
    address: "146 SUMMIT AVE",
    initials: "DK",
  },
  {
    message: "Lost cat near the corner, orange tabby.",
    address: "152 SUMMIT AVE",
    initials: "GM",
  },
  {
    message: "Free mulch pile out front, help yourselves.",
    address: "138 SUMMIT AVE",
    initials: "AR",
  },
]

// premium, non-bouncy easing
const EASE_OUT = [0.22, 1, 0.36, 1] as const

// Full time a single post stays on screen before it fades out and the
// next one arrives. enter (~0.35s) + stamp settle (~0.5s) + hold (~1.9s).
const HOLD_MS = 2750

function HomeIcon() {
  return (
    <svg
      width={15}
      height={15}
      viewBox="0 0 30 30"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="M3.75 26.25H26.25M6.25 26.25V8.75L15 3.75L23.75 8.75V26.25M11.25 26.25V18.75H18.75V26.25"
        stroke="#7059FF"
        strokeWidth={3.6}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function PinIcon({ animate }: { animate: boolean }) {
  const draw: Variants = {
    hidden: { pathLength: 0, opacity: 0 },
    show: {
      pathLength: 1,
      opacity: 1,
      transition: {
        pathLength: { duration: 0.5, ease: "easeInOut", delay: 0.45 },
        opacity: { duration: 0.15, delay: 0.45 },
      },
    },
  }

  return (
    <svg
      width={11}
      height={11}
      viewBox="0 0 22 22"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <motion.path
        d="M18.33 9.17C18.33 14.67 11 20.17 11 20.17C11 20.17 3.67 14.67 3.67 9.17C3.67 7.22 4.44 5.36 5.81 3.98C7.19 2.61 9.05 1.84 11 1.84C12.94 1.84 14.81 2.61 16.18 3.98C17.56 5.36 18.33 7.22 18.33 9.17Z"
        stroke="#5B48D8"
        strokeWidth={1.8}
        strokeLinecap="round"
        strokeLinejoin="round"
        variants={animate ? draw : undefined}
        initial={animate ? "hidden" : false}
        animate={animate ? "show" : false}
      />
      <motion.path
        d="M11 11.46C12.27 11.46 13.29 10.43 13.29 9.17C13.29 7.9 12.27 6.88 11 6.88C9.74 6.88 8.71 7.9 8.71 9.17C8.71 10.43 9.74 11.46 11 11.46Z"
        stroke="#5B48D8"
        strokeWidth={1.8}
        strokeLinecap="round"
        strokeLinejoin="round"
        variants={animate ? draw : undefined}
        initial={animate ? "hidden" : false}
        animate={animate ? "show" : false}
      />
    </svg>
  )
}

function AddressChip({ address, animate }: { address: string; animate: boolean }) {
  return (
    <motion.div
      className="inline-flex w-fit items-center gap-1 rounded-[5px] border bg-white"
      style={{ borderColor: "#e0d9ff", padding: "3px 8px 3px 7px" }}
      initial={animate ? { scale: 1.15 } : false}
      animate={animate ? { scale: 1 } : false}
      transition={
        animate
          ? { duration: 0.45, ease: EASE_OUT, delay: 0.45 }
          : undefined
      }
    >
      <PinIcon animate={animate} />
      <span
        className="font-mono"
        style={{
          fontSize: 9,
          fontWeight: 500,
          lineHeight: "11.7px",
          letterSpacing: "0.09px",
          color: "#5b48d8",
        }}
      >
        {address}
      </span>
    </motion.div>
  )
}

function PostBody({ post, animate }: { post: Post; animate: boolean }) {
  return (
    <div className="flex items-start" style={{ gap: 8 }}>
      {/* avatar */}
      <div
        className="flex shrink-0 items-center justify-center rounded-[8px]"
        style={{ width: 28, height: 28, backgroundColor: "#e9e5fb" }}
      >
        <span
          className="font-sans"
          style={{
            fontSize: 9.5,
            fontWeight: 600,
            lineHeight: "12.4px",
            color: "#5b48d8",
          }}
        >
          {post.initials}
        </span>
      </div>

      {/* bubble */}
      <div
        className="flex flex-1 flex-col rounded-[10px]"
        style={{ gap: 5, padding: "9px 12px", backgroundColor: "#f5f2ff" }}
      >
        {/* fixed height reserves 2 lines so the chip never shifts */}
        <p
          className="font-sans"
          style={{
            height: 32,
            margin: 0,
            fontSize: 12.5,
            fontWeight: 400,
            lineHeight: "16.28px",
            color: "#333333",
          }}
        >
          {post.message}
        </p>
        <AddressChip address={post.address} animate={animate} />
      </div>
    </div>
  )
}

export function NeighborlyPosts() {
  const prefersReduced = useReducedMotion()
  const [index, setIndex] = useState(0)

  useEffect(() => {
    if (prefersReduced) return
    const id = setTimeout(() => {
      setIndex((i) => (i + 1) % POSTS.length)
    }, HOLD_MS)
    return () => clearTimeout(id)
  }, [index, prefersReduced])

  const post = POSTS[prefersReduced ? 0 : index]

  return (
    <div
      className="flex flex-col rounded-[14px] border bg-white"
      style={{
        width: 320,
        padding: 18,
        gap: 14,
        borderColor: "#ececed",
        boxShadow: "0 8px 24px -6px rgba(27, 20, 97, 0.08)",
      }}
      role="group"
      aria-label="Neighborly posts on Summit Ave"
    >
      {/* eyebrow label */}
      <span
        className="font-mono"
        style={{
          fontSize: 10.5,
          fontWeight: 500,
          lineHeight: "13.67px",
          letterSpacing: "0.315px",
          color: "#7059ff",
        }}
      >
        YOUR STREET
      </span>

      {/* fixed header */}
      <div className="flex items-center" style={{ gap: 7 }}>
        <HomeIcon />
        <span
          className="flex-1 font-sans"
          style={{
            fontSize: 13.5,
            fontWeight: 600,
            lineHeight: "17.58px",
            color: "#18181b",
          }}
        >
          Summit Ave
        </span>
        <span
          className="font-sans"
          style={{
            fontSize: 11.5,
            fontWeight: 400,
            lineHeight: "14.97px",
            color: "#8b8b93",
          }}
        >
          24 homes
        </span>
      </div>

      {/* post area — fixed height so nothing shifts as posts cycle */}
      <div style={{ height: 75 }}>
        {prefersReduced ? (
          <PostBody post={post} animate={false} />
        ) : (
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.35, ease: EASE_OUT }}
            >
              <PostBody post={post} animate />
            </motion.div>
          </AnimatePresence>
        )}
      </div>

      {/* footer */}
      <span
        className="font-sans"
        style={{
          fontSize: 11.5,
          fontWeight: 400,
          lineHeight: "14.97px",
          color: "#8b8b93",
        }}
      >
        Every post tied to a real address.
      </span>
    </div>
  )
}

export default NeighborlyPosts;
