import { useEffect, useState } from 'react'
import { motion, useReducedMotion } from 'framer-motion'

type Field = { label: string; value: string }

const FIELDS: Field[] = [
  { label: 'Job', value: 'Roof replacement' },
  { label: 'Date', value: 'Jun 2025' },
  { label: 'Home', value: '148 Summit Ave' },
]

// Loop timeline (ms). Everything reserves its space permanently; we only
// animate opacity/transform so the card size never changes.
const V0 = 400
const V1 = 750
const V2 = 1100
const P0 = 1650
const P1 = 2000
const PRESS = 2750
const PRESS_UP = 2900
const POSTED = 2800
const RESET = 4400
const RESTART = 6500

function KeyValueRow({ field, show }: { field: Field; show: boolean }) {
  return (
    <div className="flex items-center justify-between border-b border-[#f2f2f4] py-[11px] last:border-b-0">
      <span className="font-[family-name:var(--font-dm-sans)] text-[12px] leading-none text-[#8b8b93]">
        {field.label}
      </span>
      {/* Value reserves its slot even when hidden. */}
      <motion.span
        className="font-[family-name:var(--font-dm-sans)] text-[13px] font-semibold leading-none text-[#18181b]"
        initial={false}
        animate={{ opacity: show ? 1 : 0, x: show ? 0 : 16 }}
        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
      >
        {field.value}
      </motion.span>
    </div>
  )
}

export function LogJobCard() {
  const reduceMotion = useReducedMotion()

  const [values, setValues] = useState<boolean[]>([false, false, false])
  const [photos, setPhotos] = useState<boolean[]>([false, false])
  const [pressed, setPressed] = useState(false)
  const [posted, setPosted] = useState(false)
  const [pulseKey, setPulseKey] = useState(0)

  useEffect(() => {
    if (reduceMotion) {
      setValues([true, true, true])
      setPhotos([true, true])
      setPosted(true)
      return
    }

    const timers: ReturnType<typeof setTimeout>[] = []

    const runLoop = () => {
      setValues([false, false, false])
      setPhotos([false, false])
      setPressed(false)
      setPosted(false)

      timers.push(setTimeout(() => setValues([true, false, false]), V0))
      timers.push(setTimeout(() => setValues([true, true, false]), V1))
      timers.push(setTimeout(() => setValues([true, true, true]), V2))

      timers.push(setTimeout(() => setPhotos([true, false]), P0))
      timers.push(
        setTimeout(() => {
          setPhotos([true, true])
          setPulseKey((k) => k + 1)
        }, P1),
      )

      timers.push(setTimeout(() => setPressed(true), PRESS))
      timers.push(setTimeout(() => setPressed(false), PRESS_UP))
      timers.push(setTimeout(() => setPosted(true), POSTED))

      timers.push(
        setTimeout(() => {
          setValues([false, false, false])
          setPhotos([false, false])
          setPosted(false)
        }, RESET),
      )

      timers.push(setTimeout(runLoop, RESTART))
    }

    runLoop()

    return () => timers.forEach(clearTimeout)
  }, [reduceMotion])

  return (
    <div className="w-[340px] rounded-[14px] border border-[#ececed] bg-white p-4 shadow-[0_8px_24px_-6px_rgba(27,20,97,0.08)]">
      {/* Header */}
      <div className="flex items-center gap-2.5">
        <div className="flex size-[34px] shrink-0 items-center justify-center rounded-full bg-[#7059ff]">
          <span className="font-[family-name:var(--font-dm-sans)] text-[13px] font-semibold leading-none text-white">
            VR
          </span>
        </div>
        <div className="min-w-0">
          <p className="font-[family-name:var(--font-dm-sans)] text-[14px] font-semibold leading-tight text-[#18181b]">
            Vela Roofing
          </p>
          <p className="mt-0.5 font-[family-name:var(--font-dm-mono)] text-[8px] font-medium uppercase leading-none tracking-[0.16px] text-[#9381ff]">
            Contractor
          </p>
        </div>
      </div>

      {/* Key-value rows */}
      <div className="mt-3">
        {FIELDS.map((field, i) => (
          <KeyValueRow key={field.label} field={field} show={values[i]} />
        ))}
      </div>

      {/* Photo strip */}
      <div className="mt-3.5 flex gap-2">
        {[0, 1].map((i) => (
          <motion.div
            key={i}
            className="size-11 rounded-lg bg-[#e8eaf5]"
            initial={false}
            animate={
              photos[i]
                ? { opacity: 1, scale: 1 }
                : { opacity: 0, scale: 0.6 }
            }
            transition={
              photos[i]
                ? { type: 'spring', stiffness: 520, damping: 22 }
                : { duration: 0.3, ease: 'easeOut' }
            }
            aria-hidden
          />
        ))}
        <motion.div
          key={`slot-${pulseKey}`}
          className="size-11 rounded-lg border-[1.5px] border-dashed border-[#d5d5dd]"
          initial={false}
          animate={
            reduceMotion || pulseKey === 0
              ? { opacity: 1 }
              : { opacity: [1, 0.35, 1] }
          }
          transition={{ duration: 0.9, ease: 'easeInOut' }}
          aria-hidden
        />
      </div>

      {/* Button */}
      <motion.button
        type="button"
        className="mt-3.5 w-full rounded-[10px] p-3 font-[family-name:var(--font-dm-sans)] text-[14px] font-medium leading-none text-white"
        initial={false}
        animate={{
          scale: pressed ? 0.97 : 1,
          backgroundColor: posted ? '#16a34a' : '#1b1461',
        }}
        transition={{
          scale: { duration: 0.15, ease: 'easeOut' },
          backgroundColor: { duration: 0.25, ease: 'easeOut' },
        }}
      >
        {posted ? 'Posted \u2713' : 'Post to the record'}
      </motion.button>
    </div>
  )
}

export default LogJobCard
