import AsyncActionDemo from '@/components/use-transition-hook/AsyncActionDemo'
import BlockingSearchDemo from '@/components/use-transition-hook/BlockingSearchDemo'
import TransitionSearchDemo from '@/components/use-transition-hook/TransitionSearchDemo'
import PrevNextNav from '@/components/common/PrevNextNav'

// ─── code snippets ────────────────────────────────────────────────────────────

const codeBlocking = `// ❌ Without useTransition — blocks the UI on every keystroke
function SearchPage() {
  const [query, setQuery] = useState('')

  // Both updates are urgent — React renders them together.
  // With 250+ slow items, each keystroke causes ~250 ms of blocking.
  const filtered = filterItems(query)

  return (
    <>
      <input value={query} onChange={e => setQuery(e.target.value)} />
      <SlowList items={filtered} />
    </>
  )
}`

const codeTransition = `// ✅ With useTransition — input is always responsive
function SearchPage() {
  const [query, setQuery] = useState('')        // urgent: drives the input
  const [listQuery, setListQuery] = useState('') // deferred: drives the list
  const [isPending, startTransition] = useTransition()

  function handleChange(e) {
    setQuery(e.target.value)           // ← paint immediately (urgent)
    startTransition(() => {
      setListQuery(e.target.value)     // ← defer & make interruptible
    })
  }

  const filtered = filterItems(listQuery)

  return (
    <>
      <input value={query} onChange={handleChange} />
      {isPending && <Spinner />}
      <SlowList items={filtered} />
    </>
  )
}`

const codeAsync = `// ✅ React 19 — async actions inside startTransition
function CommentForm() {
  const [isPending, startTransition] = useTransition()

  function handleSubmit() {
    startTransition(async () => {           // async action
      const result = await postComment()   // awaited inside transition

      // State updates after await must also be wrapped
      startTransition(() => {
        setStatus(result.status)
      })
    })
  }

  return (
    <button disabled={isPending} onClick={handleSubmit}>
      {isPending ? 'Posting…' : 'Post comment'}
    </button>
  )
}`

// ─── comparison rows ──────────────────────────────────────────────────────────

const comparisons = [
  {
    concern: 'Input responsiveness',
    before: 'Blocked while expensive re-render runs',
    after: 'Updates immediately — always urgent',
    highlight: true,
  },
  {
    concern: 'Render interruptibility',
    before: 'Every render must finish before next paint',
    after: 'Pending renders can be abandoned mid-flight',
    highlight: true,
  },
  {
    concern: 'isPending indicator',
    before: '❌ Must manage loading state manually',
    after: '✅ Built-in from useTransition',
    highlight: true,
  },
  {
    concern: 'Async action tracking',
    before: 'Requires separate useState for pending',
    after: 'isPending covers the full async lifecycle',
    highlight: true,
  },
  {
    concern: 'Suspense integration',
    before: 'Shows full loading fallback on suspend',
    after: 'Keeps current UI visible, pending in trigger',
    highlight: false,
  },
  {
    concern: 'Controlled text inputs',
    before: '✅ Works fine for input value state',
    after: '⚠️ Cannot use for controlled input value',
    highlight: false,
  },
  {
    concern: 'Call site',
    before: 'Any event handler',
    after: 'Only inside components or custom Hooks',
    highlight: false,
  },
]

// ─── key takeaways ────────────────────────────────────────────────────────────

const takeaways = [
  'Split urgent state (input value) from deferred state (list results) to keep typing smooth.',
  'startTransition does not delay computation — it makes the resulting render interruptible.',
  'isPending is true from the first call to startTransition until every action in the transition completes.',
  'In React 19, async functions are valid Actions — await inside startTransition and isPending covers the full lifecycle.',
  'State updates after await must be wrapped in another startTransition (known limitation until AsyncContext lands).',
  'Cannot be used for controlled input state — use a separate urgent state variable for that.',
  'For standalone use outside components, import startTransition from react directly.',
]

// ─── page ────────────────────────────────────────────────────────────────────

export default function UseTransitionHookPage() {
  return (
    <main className="page-wrap px-4 pb-16 pt-10">
      {/* ── Hero ── */}
      <section className="island-shell rise-in relative overflow-hidden rounded-4xl px-6 py-10 sm:px-10 sm:py-14">
        <div className="pointer-events-none absolute -left-20 -top-24 h-56 w-56 rounded-full bg-[radial-gradient(circle,rgba(79,184,178,0.28),transparent_66%)]" />
        <div className="pointer-events-none absolute -bottom-16 -right-16 h-56 w-56 rounded-full bg-[radial-gradient(circle,rgba(47,106,74,0.16),transparent_66%)]" />
        <p className="island-kicker mb-3">React 18 / 19 · Hook</p>
        <h1 className="display-title mb-4 text-4xl font-bold leading-tight tracking-tight text-(--sea-ink) sm:text-5xl">
          <code className="text-(--lagoon-deep)">useTransition</code>
        </h1>
        <p className="mb-0 max-w-2xl text-base text-(--sea-ink-soft) sm:text-lg">
          A hook that lets you mark state updates as{' '}
          <strong className="text-(--sea-ink)">non-blocking transitions</strong>{' '}
          — keeping the UI responsive while expensive renders happen in the
          background. In React 19 it also tracks the full pending state of{' '}
          <strong className="text-(--sea-ink)">async actions</strong>.
        </p>
      </section>

      {/* ── 3-card intro ── */}
      <section className="mt-8 grid gap-4 sm:grid-cols-3">
        {[
          {
            kicker: 'The Problem',
            title: 'Expensive renders block user input',
            body: 'When a state update triggers a slow re-render — like filtering a huge list — React processes it synchronously. The browser cannot repaint. Every keystroke feels delayed until the render finishes.',
          },
          {
            kicker: 'The Solution',
            title: 'Wrap slow updates in startTransition',
            body: 'Calling startTransition tells React "this update is non-urgent". Urgent updates (like typing) are processed first. The transition render is interruptible — if new input arrives, React abandons the old render and starts fresh.',
          },
          {
            kicker: 'React 19 Bonus',
            title: 'Async actions with isPending',
            body: 'In React 19, you can pass an async function to startTransition. isPending stays true for the entire async lifecycle — including awaited server calls — giving you a single flag for all your loading UI.',
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
          Code comparison — sync state update
      ═══════════════════════════════════════════════════════════════════════ */}
      <section className="mt-14">
        <p className="island-kicker mb-2">Syntax</p>
        <h2 className="display-title mb-1 text-2xl font-bold text-(--sea-ink) sm:text-3xl">
          Before vs After
        </h2>
        <p className="mb-6 text-sm text-(--sea-ink-soft)">
          Split the input value (urgent) from the derived list query (deferred).
          React renders them in two separate passes — input first, list later.
        </p>

        <div className="grid gap-4 lg:grid-cols-2">
          {/* Before */}
          <div className="island-shell flex flex-col overflow-hidden rounded-2xl">
            <div className="flex items-center gap-2 border-b border-(--line) px-5 py-3">
              <span className="h-2.5 w-2.5 rounded-full bg-orange-400" />
              <span className="text-xs font-semibold uppercase tracking-widest text-(--sea-ink-soft)">
                Without useTransition — blocking
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
              <code>{codeBlocking}</code>
            </pre>
          </div>

          {/* After */}
          <div className="island-shell flex flex-col overflow-hidden rounded-2xl">
            <div className="flex items-center gap-2 border-b border-(--line) px-5 py-3">
              <span className="h-2.5 w-2.5 rounded-full bg-(--lagoon)" />
              <span className="text-xs font-semibold uppercase tracking-widest text-(--sea-ink-soft)">
                With useTransition — responsive
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
              <code>{codeTransition}</code>
            </pre>
          </div>
        </div>
      </section>

      {/* ── Async action code panel ── */}
      <section className="mt-8">
        <div className="island-shell flex flex-col overflow-hidden rounded-2xl">
          <div className="flex items-center gap-2 border-b border-(--line) px-5 py-3">
            <span className="h-2.5 w-2.5 rounded-full bg-(--lagoon)" />
            <span className="text-xs font-semibold uppercase tracking-widest text-(--sea-ink-soft)">
              React 19 — async actions inside startTransition
            </span>
          </div>
          <pre
            className="m-0 overflow-x-auto p-5 text-xs leading-relaxed"
            style={{ background: '#1d2e45', color: '#e8efff', borderRadius: 0 }}
          >
            <code>{codeAsync}</code>
          </pre>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════════
          Comparison table
      ═══════════════════════════════════════════════════════════════════════ */}
      <section className="mt-14">
        <p className="island-kicker mb-2">Comparison</p>
        <h2 className="display-title mb-6 text-2xl font-bold text-(--sea-ink) sm:text-3xl">
          With vs without at a glance
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
                    Without useTransition
                  </th>
                  <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-widest text-(--lagoon-deep)">
                    With useTransition
                  </th>
                </tr>
              </thead>
              <tbody>
                {comparisons.map(({ concern, before, after, highlight }) => (
                  <tr
                    key={concern}
                    className={`border-b border-(--line) last:border-0 ${highlight ? 'bg-(--surface-strong)/40' : ''}`}
                  >
                    <td className="px-5 py-3 font-medium text-(--sea-ink)">
                      {concern}
                    </td>
                    <td className="px-5 py-3 text-(--sea-ink-soft)">
                      {before}
                    </td>
                    <td className="px-5 py-3 text-(--sea-ink-soft)">{after}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════════
          Demo 1 — sync search filter
      ═══════════════════════════════════════════════════════════════════════ */}
      <section className="mt-14">
        <p className="island-kicker mb-2">Demo 1 of 2</p>
        <h2 className="display-title mb-1 text-2xl font-bold text-(--sea-ink) sm:text-3xl">
          Filtering a slow list
        </h2>
        <p className="mb-6 text-sm text-(--sea-ink-soft)">
          Both panels render 250 items that each burn ~1 ms on purpose. Type
          fast and feel the difference — the left input lags while the right one
          stays instant thanks to <code>useTransition</code>.
        </p>

        <div className="grid gap-5 lg:grid-cols-2">
          {/* Blocking */}
          <div className="island-shell overflow-hidden rounded-2xl">
            <div className="flex items-center gap-2 border-b border-(--line) bg-orange-50/40 px-5 py-3 dark:bg-orange-950/10">
              <span className="h-2.5 w-2.5 rounded-full bg-orange-400" />
              <span className="text-xs font-semibold uppercase tracking-widest text-orange-600 dark:text-orange-400">
                No transition — input blocks
              </span>
            </div>
            <div className="p-5">
              <BlockingSearchDemo />
            </div>
          </div>

          {/* With transition */}
          <div className="island-shell overflow-hidden rounded-2xl">
            <div className="flex items-center gap-2 border-b border-(--line) bg-teal-50/40 px-5 py-3 dark:bg-teal-950/10">
              <span className="h-2.5 w-2.5 rounded-full bg-(--lagoon)" />
              <span className="text-xs font-semibold uppercase tracking-widest text-(--lagoon-deep)">
                useTransition — input stays smooth
              </span>
            </div>
            <div className="p-5">
              <TransitionSearchDemo />
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════════
          Demo 2 — async action
      ═══════════════════════════════════════════════════════════════════════ */}
      <section className="mt-14">
        <p className="island-kicker mb-2">Demo 2 of 2</p>
        <h2 className="display-title mb-1 text-2xl font-bold text-(--sea-ink) sm:text-3xl">
          Async action with isPending
        </h2>
        <p className="mb-6 text-sm text-(--sea-ink-soft)">
          In React 19 you can pass an <code>async</code> function directly to{' '}
          <code>startTransition</code>. The <code>isPending</code> flag stays{' '}
          <code>true</code> until the entire async operation finishes — no
          separate loading state needed.
        </p>

        <div className="island-shell overflow-hidden rounded-2xl">
          <div className="flex items-center gap-2 border-b border-(--line) bg-teal-50/40 px-5 py-3 dark:bg-teal-950/10">
            <span className="h-2.5 w-2.5 rounded-full bg-(--lagoon)" />
            <span className="text-xs font-semibold uppercase tracking-widest text-(--lagoon-deep)">
              startTransition(async () =&gt; …) — single isPending for async
            </span>
          </div>
          <div className="p-5">
            <AsyncActionDemo />
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

      <PrevNextNav currentHref="/use-transition-hook" />
    </main>
  )
}
