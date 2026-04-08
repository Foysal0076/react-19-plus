import ChatRoomDemo from '@/components/use-effect-hook/ChatRoomDemo'
import {
  TimerWithEffectEvent,
  TimerWithoutEffectEvent,
} from '@/components/use-effect-hook/TimerDemo'

// ─── code snippets ────────────────────────────────────────────────────────────

const codeStale = `// ❌ Option A — stale closure: increment is read once and never updated
useEffect(() => {
  const id = setInterval(() => {
    setCount(count + increment) // always uses the initial value of increment
  }, 1000)
  return () => clearInterval(id)
}, []) // interval never re-runs — increment is stale`

const codeDepsRestart = `// ❌ Option B — add increment to deps: timer restarts on every change
useEffect(() => {
  const id = setInterval(() => {
    setCount(count + increment)
  }, 1000)
  return () => clearInterval(id)
}, [increment]) // timer resets when the user hits +/–`

const codeEffectEvent = `// ✅ useEffectEvent — reads latest values, stays out of deps
import { useEffectEvent } from 'react'

function Timer() {
  const [count, setCount] = useState(0)
  const [increment, setIncrement] = useState(1)

  // onTick always sees the latest count and increment...
  const onTick = useEffectEvent(() => {
    setCount(count + increment)
  })

  useEffect(() => {
    const id = setInterval(() => {
      onTick() // ...but it is NOT a dependency.
    }, 1000)
    return () => clearInterval(id)
  }, []) // ← empty — timer never restarts
}`

const codeChatRoom = `// ✅ Non-reactive values inside an Effect Event
function ChatRoom({ roomId, muted }) {
  // onConnected reads latest \`muted\` — but is NOT a dep
  const onConnected = useEffectEvent((room) => {
    if (!muted) showNotification('Connected to ' + room)
  })

  useEffect(() => {
    const conn = createConnection(roomId)
    conn.on('connected', () => onConnected(roomId))
    conn.connect()
    return () => conn.disconnect()
  }, [roomId]) // ← ONLY roomId — muted never causes a reconnect
}`

// ─── comparison rows ──────────────────────────────────────────────────────────

const comparisons = [
  {
    concern: 'Reads latest prop/state',
    without: 'Stale closure unless listed as dep',
    with: 'Always reads latest committed value',
    highlight: true,
  },
  {
    concern: 'Effect re-runs when value changes',
    without: 'Yes — if listed as dep (may cause reconnects)',
    with: 'No — Effect Event is excluded from deps',
    highlight: true,
  },
  {
    concern: 'Function identity',
    without: 'Stable with useCallback',
    with: 'Intentionally unstable — never put in deps',
    highlight: false,
  },
  {
    concern: 'Can call during render',
    without: '✅ Regular functions can',
    with: '❌ Only callable from inside Effects',
    highlight: false,
  },
  {
    concern: 'Can pass to child components',
    without: '✅ Regular functions / useCallback',
    with: '❌ Must stay local to the component',
    highlight: false,
  },
  {
    concern: 'Ideal for',
    without: 'Logic that should re-run when values change',
    with: 'Side effects triggered by events, not reactive values',
    highlight: true,
  },
  {
    concern: 'Custom Hook support',
    without: 'Possible but tricky with stable callback deps',
    with: 'Wrap callback in useEffectEvent — deps disappear',
    highlight: false,
  },
]

// ─── key takeaways ────────────────────────────────────────────────────────────

const takeaways = [
  'useEffectEvent extracts the "event" part of an Effect — logic that reads current values but should not re-trigger the Effect.',
  'The function always sees the latest props/state at call time, like a snapshot taken on every render.',
  'Never list an Effect Event in dependency arrays — the linter enforces this. Its identity is intentionally unstable.',
  'Only call Effect Events from inside Effects or other Effect Events — never during rendering or from event handlers.',
  'Do not use useEffectEvent just to suppress linter warnings about deps. That hides bugs. Use it only for genuinely non-reactive logic.',
  "Wrapping a callback in useEffectEvent inside a custom Hook removes it from that Hook's effect dependencies entirely.",
  'useEffectEvent is the official React 19 answer to the classic "stale closure in setInterval" problem.',
]

// ─── page ────────────────────────────────────────────────────────────────────

export default function UseEffectHookPage() {
  return (
    <main className="page-wrap px-4 pb-16 pt-10">
      {/* ── Hero ── */}
      <section className="island-shell rise-in relative overflow-hidden rounded-4xl px-6 py-10 sm:px-10 sm:py-14">
        <div className="pointer-events-none absolute -left-20 -top-24 h-56 w-56 rounded-full bg-[radial-gradient(circle,rgba(79,184,178,0.28),transparent_66%)]" />
        <div className="pointer-events-none absolute -bottom-16 -right-16 h-56 w-56 rounded-full bg-[radial-gradient(circle,rgba(47,106,74,0.16),transparent_66%)]" />
        <p className="island-kicker mb-3">React 19 · Hook</p>
        <h1 className="display-title mb-4 text-4xl font-bold leading-tight tracking-tight text-(--sea-ink) sm:text-5xl">
          <code className="text-(--lagoon-deep)">useEffectEvent</code>
        </h1>
        <p className="mb-0 max-w-2xl text-base text-(--sea-ink-soft) sm:text-lg">
          A hook that lets you{' '}
          <strong className="text-(--sea-ink)">
            separate events from Effects
          </strong>{' '}
          — carving out the parts of your Effect logic that should{' '}
          <em>always read the latest values</em> but should{' '}
          <em>never cause the Effect to re-run</em>.
        </p>
      </section>

      {/* ── 3-card intro ── */}
      <section className="mt-8 grid gap-4 sm:grid-cols-3">
        {[
          {
            kicker: 'The Problem',
            title: 'Reactive values vs. reactive logic',
            body: 'useEffect deps must list every reactive value — but sometimes you need to read a value without re-triggering the Effect. Stale closures break correctness; adding the value as a dep causes unwanted side-effects like reconnects or timer resets.',
          },
          {
            kicker: 'The Solution',
            title: 'Extract the "event" out of the Effect',
            body: 'useEffectEvent wraps a callback so it always reads the latest values from render, while being excluded from dependencies. The Effect reacts to the deps you care about; the event handler reads everything else fresh.',
          },
          {
            kicker: 'The Rule',
            title: 'Events are not deps — never list them',
            body: 'Effect Events have intentionally unstable identity. The React linter forbids including them in dependency arrays. They can only be called from inside Effects or other Effect Events — never during render.',
          },
        ].map(({ kicker, title, body }, i) => (
          <article
            key={title}
            className="island-shell feature-card rise-in rounded-2xl p-6"
            style={{ animationDelay: `${i * 80 + 60}ms` }}
          >
            <p className="island-kicker mb-2">{kicker}</p>
            <h2 className="mb-2 text-base font-semibold text-(--sea-ink)">
              {title}
            </h2>
            <p className="m-0 text-sm leading-relaxed text-(--sea-ink-soft)">
              {body}
            </p>
          </article>
        ))}
      </section>

      {/* ═══════════════════════════════════════════════════════════════════════
          Code — the stale closure problem + solutions
      ═══════════════════════════════════════════════════════════════════════ */}
      <section className="mt-14">
        <p className="island-kicker mb-2">Syntax</p>
        <h2 className="display-title mb-1 text-2xl font-bold text-(--sea-ink) sm:text-3xl">
          The stale closure problem — and the fix
        </h2>
        <p className="mb-6 text-sm text-(--sea-ink-soft)">
          A timer that increments by a user-controlled value. Two broken
          approaches, then the clean solution with <code>useEffectEvent</code>.
        </p>

        <div className="grid gap-4 lg:grid-cols-2">
          <div className="island-shell flex flex-col overflow-hidden rounded-2xl">
            <div className="flex items-center gap-2 border-b border-(--line) px-5 py-3">
              <span className="h-2.5 w-2.5 rounded-full bg-orange-400" />
              <span className="text-xs font-semibold uppercase tracking-widest text-(--sea-ink-soft)">
                Option A — stale closure
              </span>
            </div>
            <pre
              className="m-0 flex-1 overflow-x-auto p-5 text-xs leading-relaxed"
              style={{
                background: '#1d2e45',
                color: '#e8efff',
                borderRadius: 0,
              }}
            >
              <code>{codeStale}</code>
            </pre>
          </div>

          <div className="island-shell flex flex-col overflow-hidden rounded-2xl">
            <div className="flex items-center gap-2 border-b border-(--line) px-5 py-3">
              <span className="h-2.5 w-2.5 rounded-full bg-orange-400" />
              <span className="text-xs font-semibold uppercase tracking-widest text-(--sea-ink-soft)">
                Option B — dep causes restarts
              </span>
            </div>
            <pre
              className="m-0 flex-1 overflow-x-auto p-5 text-xs leading-relaxed"
              style={{
                background: '#1d2e45',
                color: '#e8efff',
                borderRadius: 0,
              }}
            >
              <code>{codeDepsRestart}</code>
            </pre>
          </div>
        </div>

        {/* The fix */}
        <div className="mt-4 island-shell flex flex-col overflow-hidden rounded-2xl">
          <div className="flex items-center gap-2 border-b border-(--line) px-5 py-3">
            <span className="h-2.5 w-2.5 rounded-full bg-(--lagoon)" />
            <span className="text-xs font-semibold uppercase tracking-widest text-(--sea-ink-soft)">
              The fix — useEffectEvent
            </span>
          </div>
          <pre
            className="m-0 overflow-x-auto p-5 text-xs leading-relaxed"
            style={{ background: '#1d2e45', color: '#e8efff', borderRadius: 0 }}
          >
            <code>{codeEffectEvent}</code>
          </pre>
        </div>
      </section>

      {/* ── Non-reactive values code panel ── */}
      <section className="mt-8">
        <div className="island-shell flex flex-col overflow-hidden rounded-2xl">
          <div className="flex items-center gap-2 border-b border-(--line) px-5 py-3">
            <span className="h-2.5 w-2.5 rounded-full bg-(--lagoon)" />
            <span className="text-xs font-semibold uppercase tracking-widest text-(--sea-ink-soft)">
              Non-reactive values — avoiding reconnects
            </span>
          </div>
          <pre
            className="m-0 overflow-x-auto p-5 text-xs leading-relaxed"
            style={{ background: '#1d2e45', color: '#e8efff', borderRadius: 0 }}
          >
            <code>{codeChatRoom}</code>
          </pre>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════════
          Comparison table
      ═══════════════════════════════════════════════════════════════════════ */}
      <section className="mt-14">
        <p className="island-kicker mb-2">Comparison</p>
        <h2 className="display-title mb-6 text-2xl font-bold text-(--sea-ink) sm:text-3xl">
          Without vs with at a glance
        </h2>
        <div className="island-shell overflow-hidden rounded-2xl">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-(--line)">
                  <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-widest text-(--sea-ink-soft)">
                    Concern
                  </th>
                  <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-widest text-orange-500">
                    Without useEffectEvent
                  </th>
                  <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-widest text-(--lagoon-deep)">
                    With useEffectEvent
                  </th>
                </tr>
              </thead>
              <tbody>
                {comparisons.map(
                  ({ concern, without: wo, with: wi, highlight }) => (
                    <tr
                      key={concern}
                      className={`border-b border-(--line) last:border-0 ${highlight ? 'bg-(--surface-strong)/40' : ''}`}
                    >
                      <td className="px-5 py-3 font-medium text-(--sea-ink)">
                        {concern}
                      </td>
                      <td className="px-5 py-3 text-(--sea-ink-soft)">{wo}</td>
                      <td className="px-5 py-3 text-(--sea-ink-soft)">{wi}</td>
                    </tr>
                  ),
                )}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════════
          Demo 1 — timer
      ═══════════════════════════════════════════════════════════════════════ */}
      <section className="mt-14">
        <p className="island-kicker mb-2">Demo 1 of 2</p>
        <h2 className="display-title mb-1 text-2xl font-bold text-(--sea-ink) sm:text-3xl">
          Timer with a variable increment
        </h2>
        <p className="mb-6 text-sm text-(--sea-ink-soft)">
          Both counters tick every second using <code>setInterval</code>. Click
          +/– to change the increment amount and watch what happens to each
          timer.
        </p>

        <div className="grid gap-5 lg:grid-cols-2">
          {/* without */}
          <div className="island-shell overflow-hidden rounded-2xl">
            <div className="flex items-center gap-2 border-b border-(--line) bg-orange-50/40 px-5 py-3 dark:bg-orange-950/10">
              <span className="h-2.5 w-2.5 rounded-full bg-orange-400" />
              <span className="text-xs font-semibold uppercase tracking-widest text-orange-600 dark:text-orange-400">
                increment in deps — timer restarts
              </span>
            </div>
            <div className="p-5">
              <TimerWithoutEffectEvent />
            </div>
          </div>

          {/* with */}
          <div className="island-shell overflow-hidden rounded-2xl">
            <div className="flex items-center gap-2 border-b border-(--line) bg-teal-50/40 px-5 py-3 dark:bg-teal-950/10">
              <span className="h-2.5 w-2.5 rounded-full bg-(--lagoon)" />
              <span className="text-xs font-semibold uppercase tracking-widest text-(--lagoon-deep)">
                useEffectEvent — timer keeps running
              </span>
            </div>
            <div className="p-5">
              <TimerWithEffectEvent />
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════════
          Demo 2 — chat room
      ═══════════════════════════════════════════════════════════════════════ */}
      <section className="mt-14">
        <p className="island-kicker mb-2">Demo 2 of 2</p>
        <h2 className="display-title mb-1 text-2xl font-bold text-(--sea-ink) sm:text-3xl">
          Non-reactive values in a chat room
        </h2>
        <p className="mb-6 text-sm text-(--sea-ink-soft)">
          Switching the room is{' '}
          <strong className="text-(--sea-ink)">reactive</strong> — the Effect
          re-runs and reconnects. Toggling mute is{' '}
          <strong className="text-(--sea-ink)">non-reactive</strong> —{' '}
          <code>muted</code> lives inside an Effect Event so it never triggers a
          reconnect, but the next connection still respects the setting.
        </p>

        <div className="island-shell overflow-hidden rounded-2xl">
          <div className="flex items-center gap-2 border-b border-(--line) bg-teal-50/40 px-5 py-3 dark:bg-teal-950/10">
            <span className="h-2.5 w-2.5 rounded-full bg-(--lagoon)" />
            <span className="text-xs font-semibold uppercase tracking-widest text-(--lagoon-deep)">
              onConnected reads muted via useEffectEvent — no reconnect on
              toggle
            </span>
          </div>
          <div className="p-5">
            <ChatRoomDemo />
          </div>
        </div>
      </section>

      {/* ── Key takeaways ── */}
      <section className="mt-14">
        <div className="island-shell rounded-2xl p-6 sm:p-8">
          <p className="island-kicker mb-3">Key takeaways</p>
          <h2 className="display-title mb-5 text-xl font-bold text-(--sea-ink) sm:text-2xl">
            What to remember
          </h2>
          <ul className="space-y-3">
            {takeaways.map((point) => (
              <li
                key={point}
                className="flex gap-3 text-sm text-(--sea-ink-soft)"
              >
                <span className="mt-0.5 shrink-0 text-(--lagoon)">✦</span>
                <span>{point}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </main>
  )
}
