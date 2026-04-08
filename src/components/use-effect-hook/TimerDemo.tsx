import { useEffect, useEffectEvent, useState } from 'react'

// ── With useEffectEvent ───────────────────────────────────────────────────────

function TimerWithEffectEvent() {
  const [count, setCount] = useState(0)
  const [increment, setIncrement] = useState(1)
  const [ticks, setTicks] = useState(0)

  // ✅ onTick reads the latest `increment` without being a dep
  const onTick = useEffectEvent(() => {
    setCount((c) => c + increment)
    setTicks((t) => t + 1)
  })

  useEffect(() => {
    const id = setInterval(() => {
      onTick()
    }, 1000)
    return () => clearInterval(id)
  }, []) // ← empty deps: timer NEVER restarts

  return (
    <div className="space-y-4">
      <div className="rounded-lg border border-(--line) bg-(--surface) px-4 py-3">
        <p className="text-xs font-medium text-(--sea-ink-soft)">Counter</p>
        <p className="text-3xl font-bold tabular-nums text-(--lagoon-deep)">
          {count}
        </p>
        <p className="text-xs text-(--sea-ink-soft)">
          {ticks} tick{ticks !== 1 ? 's' : ''} — timer never restarted
        </p>
      </div>
      <div>
        <p className="mb-2 text-xs font-medium text-(--sea-ink-soft)">
          Increment per tick
        </p>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIncrement((i) => Math.max(0, i - 1))}
            className="flex h-7 w-7 items-center justify-center rounded-md border border-(--line) text-sm font-bold text-(--sea-ink) transition hover:bg-(--surface-strong)"
          >
            –
          </button>
          <span className="w-6 text-center text-sm font-semibold text-(--sea-ink)">
            {increment}
          </span>
          <button
            onClick={() => setIncrement((i) => i + 1)}
            className="flex h-7 w-7 items-center justify-center rounded-md border border-(--line) text-sm font-bold text-(--sea-ink) transition hover:bg-(--surface-strong)"
          >
            +
          </button>
        </div>
        <p className="mt-2 text-xs text-(--sea-ink-soft)">
          Change it — the counter uses the new value immediately, no restart.
        </p>
      </div>
    </div>
  )
}

// ── Without useEffectEvent (increment in deps → restarts on change) ──────────

function TimerWithoutEffectEvent() {
  const [count, setCount] = useState(0)
  const [increment, setIncrement] = useState(1)
  const [restartCount, setRestartCount] = useState(0)

  useEffect(() => {
    setRestartCount((r) => r + 1)
    const id = setInterval(() => {
      setCount((c) => c + increment)
    }, 1000)
    return () => clearInterval(id)
  }, [increment]) // ← increment in deps: restarts whenever increment changes

  return (
    <div className="space-y-4">
      <div className="rounded-lg border border-orange-200 bg-orange-50/50 px-4 py-3 dark:border-orange-900/40 dark:bg-orange-950/20">
        <p className="text-xs font-medium text-orange-600 dark:text-orange-400">
          Counter
        </p>
        <p className="text-3xl font-bold tabular-nums text-orange-600 dark:text-orange-400">
          {count}
        </p>
        <p className="text-xs text-orange-500 dark:text-orange-500">
          {restartCount} restart{restartCount !== 1 ? 's' : ''} — each increment
          change resets the 1s delay
        </p>
      </div>
      <div>
        <p className="mb-2 text-xs font-medium text-(--sea-ink-soft)">
          Increment per tick
        </p>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIncrement((i) => Math.max(0, i - 1))}
            className="flex h-7 w-7 items-center justify-center rounded-md border border-(--line) text-sm font-bold text-(--sea-ink) transition hover:bg-(--surface-strong)"
          >
            –
          </button>
          <span className="w-6 text-center text-sm font-semibold text-(--sea-ink)">
            {increment}
          </span>
          <button
            onClick={() => setIncrement((i) => i + 1)}
            className="flex h-7 w-7 items-center justify-center rounded-md border border-(--line) text-sm font-bold text-(--sea-ink) transition hover:bg-(--surface-strong)"
          >
            +
          </button>
        </div>
        <p className="mt-2 text-xs text-(--sea-ink-soft)">
          Click +/– rapidly — each click restarts the 1-second timer.
        </p>
      </div>
    </div>
  )
}

// ── export ────────────────────────────────────────────────────────────────────

export { TimerWithEffectEvent, TimerWithoutEffectEvent }
