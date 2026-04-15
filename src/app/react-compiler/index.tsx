import ExpensiveComponent from '@/components/react-compiler/ExpensiveComponent'
import ExpensiveComponentReactCompiler from '@/components/react-compiler/ExpensiveComponentReactCompiler'
import UnoptimizedComponent from '@/components/react-compiler/UnoptimizedComponent'
import PrevNextNav from '@/components/common/PrevNextNav'
import { useState, useCallback } from 'react'

// --------------- code snippets ---------------

const codeBefore = `import { useMemo, useCallback, memo } from 'react'

const ExpensiveComponent = memo(function ExpensiveComponent({
  data,
  onClick,
}) {
  const processedData = useMemo(() => {
    return expensiveProcessing(data)
  }, [data])

  const handleClick = useCallback(
    (item) => {
      onClick(item.id)
    },
    [onClick],
  )

  return (
    <div className="flex gap-2 flex-wrap">
      {processedData.map((item) => (
        <HorizontalCard key={item.id} title={item.title}
          onClick={() => handleClick(item)} />
      ))}
    </div>
  )
})

export default ExpensiveComponent`

const codeUnoptimized = `// ❌ No memo, no useMemo, no useCallback
// expensiveProcessing() runs on EVERY render —
// even when props haven't changed at all.

export default function UnoptimizedComponent({ data, onClick }) {
  'use no memo' // This for manual recreation of un-optimization, since we have react-compiler setup
  const processedData = expensiveProcessing(data) // runs every render!

  const handleClick = (item) => {
    onClick(item.id) // new function reference every render
  }

  return (
    <div className="flex gap-2 flex-wrap">
      {processedData.map((item) => (
        <HorizontalCard key={item.id} title={item.title}
          onClick={() => handleClick(item)} />
      ))}
    </div>
  )
}`

const codeAfter = `// Zero memoization imports needed!

export default function ExpensiveComponentReactCompiler({
  data,
  onClick,
}) {
  const processedData = expensiveProcessing(data)

  const handleClick = (item) => {
    onClick(item.id)
  }

  return (
    <div className="flex gap-2 flex-wrap">
      {processedData.map((item) => (
        <HorizontalCard key={item.id} title={item.title}
          onClick={() => handleClick(item)} />
      ))}
    </div>
  )
}`

// --------------- comparison rows ---------------

const comparisons = [
  {
    concern: 'Prevent unnecessary re-renders',
    before: 'Wrap with memo()',
    after: 'Automatic',
    highlight: true,
  },
  {
    concern: 'Memoize expensive computations',
    before: 'useMemo(() => …, [deps])',
    after: 'Automatic',
    highlight: false,
  },
  {
    concern: 'Stable callback references',
    before: 'useCallback(() => …, [deps])',
    after: 'Automatic',
    highlight: false,
  },
  {
    concern: 'Dependency arrays',
    before: 'Manual (error-prone)',
    after: 'None needed',
    highlight: true,
  },
  {
    concern: 'Stale closure risk',
    before: 'Present — easy to get wrong',
    after: 'Eliminated',
    highlight: false,
  },
  {
    concern: 'Mental overhead',
    before: 'High',
    after: 'Low',
    highlight: false,
  },
  {
    concern: 'Code verbosity',
    before: 'Noisy',
    after: 'Clean',
    highlight: false,
  },
]

// --------------- page ---------------

export default function ReactCompilerPage() {
  const [noobDemoActive, setNoobDemoActive] = useState(false)
  const [noobCount, setNoobCount] = useState(0)
  const [noobDataCount, setNoobDataCount] = useState(2)

  const [demoActive, setDemoActive] = useState(false)
  const [unrelatedCount, setUnrelatedCount] = useState(0)
  const [dataCount, setDataCount] = useState(3)
  const [clickedId, setClickedId] = useState<number | null>(null)

  const handleClick = useCallback((id: number) => {
    setClickedId(id)
  }, [])

  const noopClick = useCallback((id: number) => {
    void id
  }, [])

  return (
    <main className="page-wrap px-4 pb-16 pt-10">
      {/* ── Hero ── */}
      <section className="island-shell rise-in relative overflow-hidden rounded-4xl px-6 py-10 sm:px-10 sm:py-14">
        <div className="pointer-events-none absolute -left-20 -top-24 h-56 w-56 rounded-full bg-[radial-gradient(circle,rgba(79,184,178,0.32),transparent_66%)]" />
        <div className="pointer-events-none absolute -bottom-20 -right-20 h-56 w-56 rounded-full bg-[radial-gradient(circle,rgba(47,106,74,0.18),transparent_66%)]" />
        <p className="island-kicker mb-3">React 19 · New Feature</p>
        <h1 className="display-title mb-4 text-4xl font-bold leading-tight tracking-tight text-(--sea-ink) sm:text-5xl">
          React Compiler
        </h1>
        <p className="mb-0 max-w-2xl text-base text-(--sea-ink-soft) sm:text-lg">
          An ahead-of-time compiler that automatically memoizes your components
          and hooks — so you can stop writing <code>memo</code>,{' '}
          <code>useMemo</code>, and <code>useCallback</code> by hand.
        </p>
      </section>

      {/* ── What is it? ── */}
      <section className="mt-8 grid gap-4 sm:grid-cols-3">
        {[
          {
            kicker: 'The Problem',
            title: 'Memoization is hard',
            body: 'React re-renders a component every time its parent re-renders or its state changes. Avoiding unnecessary re-renders historically required wrapping values in useMemo, callbacks in useCallback, and components in memo — all of which must have manually managed dependency arrays.',
          },
          {
            kicker: 'The Solution',
            title: 'Let the compiler do it',
            body: "React Compiler analyses your code's data-flow at build time and automatically inserts the right memoization for you. It understands React's rules of components and hooks, so it can safely optimise places a human might miss or get wrong.",
          },
          {
            kicker: 'The Result',
            title: 'Write plain React',
            body: 'Your components look exactly like you wrote them on day one — no wrappers, no dependency arrays, no footguns. The compiler guarantees the same runtime behaviour that carefully hand-written memoization would give you.',
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

      {/* ── Code Comparison ── */}
      <section className="mt-10">
        <p className="island-kicker mb-2">Side-by-side</p>
        <h2 className="display-title mb-1 text-2xl font-bold text-(--sea-ink) sm:text-3xl">
          The same component — two ways
        </h2>
        <p className="mb-6 text-sm text-(--sea-ink-soft)">
          Both files render identically. The compiler version is what you would
          write in React 19 with the compiler enabled.
        </p>

        <div className="grid gap-4 lg:grid-cols-2">
          {/* Before */}
          <div className="island-shell flex flex-col rounded-2xl overflow-hidden">
            <div className="flex items-center gap-2 border-b border-(--line) px-5 py-3">
              <span className="h-2.5 w-2.5 rounded-full bg-orange-400" />
              <span className="text-xs font-semibold uppercase tracking-widest text-(--sea-ink-soft)">
                Before — Manual memoization
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
              <code>{codeBefore}</code>
            </pre>
          </div>

          {/* After */}
          <div className="island-shell flex flex-col rounded-2xl overflow-hidden">
            <div className="flex items-center gap-2 border-b border-(--line) px-5 py-3">
              <span className="h-2.5 w-2.5 rounded-full bg-(--lagoon)" />
              <span className="text-xs font-semibold uppercase tracking-widest text-(--sea-ink-soft)">
                After — React Compiler
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
              <code>{codeAfter}</code>
            </pre>
          </div>
        </div>
      </section>

      {/* ── Comparison Table ── */}
      <section className="mt-10">
        <p className="island-kicker mb-2">At a glance</p>
        <h2 className="display-title mb-6 text-2xl font-bold text-(--sea-ink) sm:text-3xl">
          What the compiler handles for you
        </h2>

        <div className="island-shell overflow-hidden rounded-2xl">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-(--line)">
                <th className="px-5 py-3.5 text-left font-semibold text-(--sea-ink-soft)">
                  Concern
                </th>
                <th className="px-5 py-3.5 text-left font-semibold text-orange-500">
                  Without Compiler
                </th>
                <th className="px-5 py-3.5 text-left font-semibold text-(--lagoon-deep)">
                  With React Compiler
                </th>
              </tr>
            </thead>
            <tbody>
              {comparisons.map(({ concern, before, after, highlight }) => (
                <tr
                  key={concern}
                  className={[
                    'border-b border-(--line) last:border-0',
                    highlight ? 'bg-[rgba(79,184,178,0.05)]' : '',
                  ].join(' ')}
                >
                  <td className="px-5 py-3.5 font-medium text-(--sea-ink)">
                    {concern}
                  </td>
                  <td className="px-5 py-3.5 text-(--sea-ink-soft)">
                    <code className="text-orange-600 dark:text-orange-400">
                      {before}
                    </code>
                  </td>
                  <td className="px-5 py-3.5 font-medium text-(--lagoon-deep)">
                    {after}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* ── How it works ── */}
      <section className="mt-10">
        <p className="island-kicker mb-2">Under the hood</p>
        <h2 className="display-title mb-6 text-2xl font-bold text-(--sea-ink) sm:text-3xl">
          How the compiler works
        </h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            {
              step: '01',
              title: 'Parse your code',
              body: 'The compiler reads your JSX/TSX source files at build time as part of your Babel or SWC pipeline.',
            },
            {
              step: '02',
              title: 'Analyse data flow',
              body: "It traces exactly which values each expression depends on — the same analysis you'd do mentally when writing useMemo deps.",
            },
            {
              step: '03',
              title: 'Insert memoization',
              body: 'It wraps components, computations, and callbacks with the optimal memoization — only where it actually helps.',
            },
            {
              step: '04',
              title: 'Emit plain JS',
              body: 'The output is standard React calls. No runtime overhead, no new APIs, no changes to how your components behave.',
            },
          ].map(({ step, title, body }, i) => (
            <article
              key={step}
              className="island-shell feature-card rise-in rounded-2xl p-5"
              style={{ animationDelay: `${i * 70 + 50}ms` }}
            >
              <span className="mb-3 inline-block text-2xl font-bold text-(--lagoon)">
                {step}
              </span>
              <h3 className="mb-1.5 text-sm font-semibold text-(--sea-ink)">
                {title}
              </h3>
              <p className="m-0 text-sm text-(--sea-ink-soft)">{body}</p>
            </article>
          ))}
        </div>
      </section>

      {/* ── Noob Demo: unoptimized re-render ── */}
      <section className="mt-10">
        <p className="island-kicker mb-2">Start here</p>
        <h2 className="display-title mb-1 text-2xl font-bold text-(--sea-ink) sm:text-3xl">
          What happens without any optimisation?
        </h2>
        <p className="mb-4 text-sm text-(--sea-ink-soft)">
          React re-renders a component every time its{' '}
          <strong className="text-(--sea-ink)">parent re-renders</strong>, even
          if the component's own props haven't changed at all. Without{' '}
          <code>memo</code>, <code>useMemo</code>, or the compiler, an expensive
          computation runs on <em>every</em> render — including ones triggered
          by completely unrelated state updates.
        </p>

        <div className="island-shell mb-6 flex flex-col overflow-hidden rounded-2xl">
          <div className="flex items-center gap-2 border-b border-(--line) px-5 py-3">
            <span className="h-2.5 w-2.5 rounded-full bg-red-400" />
            <span className="text-xs font-semibold uppercase tracking-widest text-(--sea-ink-soft)">
              Unoptimized — no memo, no useMemo, no useCallback
            </span>
          </div>
          <pre
            className="m-0 overflow-x-auto p-5 text-xs leading-relaxed"
            style={{ background: '#1d2e45', color: '#e8efff', borderRadius: 0 }}
          >
            <code>{codeUnoptimized}</code>
          </pre>
        </div>

        {!noobDemoActive ? (
          <div className="island-shell flex flex-col items-center gap-4 rounded-2xl py-14 text-center">
            <p className="max-w-sm text-sm text-(--sea-ink-soft)">
              Warning: the component will block for ~2 s on first render — and
              again on <em>every</em> parent re-render!
            </p>
            <button
              onClick={() => setNoobDemoActive(true)}
              className="rounded-full bg-red-500 px-6 py-2.5 text-sm font-semibold text-white shadow transition hover:-translate-y-0.5 hover:opacity-90"
            >
              Run unoptimized demo
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="island-shell flex flex-wrap items-center gap-4 rounded-2xl px-5 py-4">
              <span className="text-sm font-medium text-(--sea-ink)">
                Unrelated parent state:
              </span>
              <button
                onClick={() => setNoobCount((c) => c + 1)}
                className="rounded-lg border border-(--line) bg-(--surface) px-3 py-1.5 text-sm font-semibold text-(--sea-ink) transition hover:border-red-400"
              >
                +1 (trigger parent re-render)
              </button>
              <code className="tabular-nums">{noobCount}</code>
              <span className="flex items-center gap-1.5 text-xs font-medium text-red-500">
                <span className="inline-block h-2 w-2 rounded-full bg-red-400" />
                Watch the freeze — it re-processes every time!
              </span>

              <div className="ml-auto flex items-center gap-3">
                <span className="text-sm font-medium text-(--sea-ink)">
                  Items:
                </span>
                {[2, 3].map((n) => (
                  <button
                    key={n}
                    onClick={() => setNoobDataCount(n)}
                    className={[
                      'rounded-lg border px-3 py-1.5 text-sm font-semibold transition',
                      noobDataCount === n
                        ? 'border-red-400 bg-red-50 text-red-600 dark:bg-red-950/40 dark:text-red-400'
                        : 'border-(--line) bg-(--surface) text-(--sea-ink) hover:border-red-400',
                    ].join(' ')}
                  >
                    {n}
                  </button>
                ))}
              </div>
            </div>

            <div className="island-shell overflow-hidden rounded-2xl border-2 border-red-300/40 dark:border-red-700/30">
              <div className="flex items-center gap-2 border-b border-(--line) bg-red-50/60 px-5 py-3 dark:bg-red-950/20">
                <span className="h-2.5 w-2.5 rounded-full bg-red-400" />
                <span className="text-xs font-semibold uppercase tracking-widest text-red-600 dark:text-red-400">
                  UnoptimizedComponent
                </span>
                <span className="ml-auto text-xs text-red-500">
                  re-runs expensiveProcessing() on every parent re-render
                </span>
              </div>
              <div className="p-5">
                <UnoptimizedComponent
                  data={noobDataCount}
                  onClick={noopClick}
                />
              </div>
            </div>

            <div className="rounded-xl border border-red-200 bg-red-50/80 px-5 py-4 dark:border-red-800/40 dark:bg-red-950/20">
              <p className="m-0 text-sm text-red-700 dark:text-red-300">
                <strong>What just happened?</strong> Hitting +1 changes parent
                state that <em>this component doesn't even use</em>. Yet React
                re-rendered <code>UnoptimizedComponent</code> anyway and ran the
                2-second <code>expensiveProcessing()</code> all over again. This
                is exactly the problem <code>memo</code>, <code>useMemo</code>,
                and the React Compiler all exist to solve.
              </p>
            </div>
          </div>
        )}
      </section>

      {/* ── Live Demo ── */}
      <section className="mt-10">
        <p className="island-kicker mb-2">Interactive demo</p>
        <h2 className="display-title mb-1 text-2xl font-bold text-(--sea-ink) sm:text-3xl">
          See it in action
        </h2>
        <p className="mb-6 text-sm text-(--sea-ink-soft)">
          Each component runs a 2-second blocking task on first render.
          Increment the <strong>unrelated counter</strong> to trigger a parent
          re-render — neither component should re-process because their props
          haven't changed.
        </p>

        {!demoActive ? (
          <div className="island-shell flex flex-col items-center gap-4 rounded-2xl py-14 text-center">
            <p className="text-sm text-(--sea-ink-soft)">
              Warning: each component will block for ~2 s on first render.
            </p>
            <button
              onClick={() => setDemoActive(true)}
              className="rounded-full bg-(--lagoon-deep) px-6 py-2.5 text-sm font-semibold text-white shadow transition hover:-translate-y-0.5 hover:opacity-90"
            >
              Start Demo
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Controls */}
            <div className="island-shell flex flex-wrap items-center gap-4 rounded-2xl px-5 py-4">
              <div className="flex items-center gap-3">
                <span className="text-sm font-medium text-(--sea-ink)">
                  Unrelated counter:
                </span>
                <button
                  onClick={() => setUnrelatedCount((c) => c + 1)}
                  className="rounded-lg border border-(--line) bg-(--surface) px-3 py-1.5 text-sm font-semibold text-(--sea-ink) transition hover:border-(--lagoon-deep)"
                >
                  +1
                </button>
                <code className="tabular-nums">{unrelatedCount}</code>
                <span className="text-xs text-(--sea-ink-soft)">
                  (should NOT re-render children)
                </span>
              </div>

              <div className="flex items-center gap-3">
                <span className="text-sm font-medium text-(--sea-ink)">
                  Item count:
                </span>
                {[2, 3, 4].map((n) => (
                  <button
                    key={n}
                    onClick={() => setDataCount(n)}
                    className={[
                      'rounded-lg border px-3 py-1.5 text-sm font-semibold transition',
                      dataCount === n
                        ? 'border-(--lagoon-deep) bg-[rgba(79,184,178,0.18)] text-(--lagoon-deep)'
                        : 'border-(--line) bg-(--surface) text-(--sea-ink) hover:border-(--lagoon-deep)',
                    ].join(' ')}
                  >
                    {n}
                  </button>
                ))}
                <span className="text-xs text-(--sea-ink-soft)">
                  (WILL re-render children)
                </span>
              </div>

              {clickedId !== null && (
                <span className="ml-auto text-sm text-(--lagoon-deep)">
                  Last clicked: <code>id={clickedId}</code>
                </span>
              )}
            </div>

            <div className="grid gap-4 lg:grid-cols-2">
              {/* Manual */}
              <div className="island-shell overflow-hidden rounded-2xl">
                <div className="flex items-center gap-2 border-b border-(--line) px-5 py-3">
                  <span className="h-2.5 w-2.5 rounded-full bg-orange-400" />
                  <span className="text-xs font-semibold uppercase tracking-widest text-(--sea-ink-soft)">
                    Manual — memo + useMemo + useCallback
                  </span>
                </div>
                <div className="p-5">
                  <ExpensiveComponent data={dataCount} onClick={handleClick} />
                </div>
              </div>

              {/* Compiler */}
              <div className="island-shell overflow-hidden rounded-2xl">
                <div className="flex items-center gap-2 border-b border-(--line) px-5 py-3">
                  <span className="h-2.5 w-2.5 rounded-full bg-(--lagoon)" />
                  <span className="text-xs font-semibold uppercase tracking-widest text-(--sea-ink-soft)">
                    React Compiler — no manual optimisation
                  </span>
                </div>
                <div className="p-5">
                  <ExpensiveComponentReactCompiler
                    data={dataCount}
                    onClick={handleClick}
                  />
                </div>
              </div>
            </div>
          </div>
        )}
      </section>

      {/* ── Key Takeaways ── */}
      <section className="island-shell mt-10 rounded-2xl px-6 py-8">
        <p className="island-kicker mb-3">Key takeaways</p>
        <ul className="m-0 space-y-2.5 pl-5 text-sm text-(--sea-ink-soft) list-disc">
          <li>
            The React Compiler is an{' '}
            <strong className="text-(--sea-ink)">opt-in build step</strong> — it
            doesn't change your React version or runtime behaviour.
          </li>
          <li>
            It enforces the{' '}
            <strong className="text-(--sea-ink)">Rules of React</strong> (pure
            renders, no mutation of props/state) — components that already break
            those rules will be skipped.
          </li>
          <li>
            You can adopt it{' '}
            <strong className="text-(--sea-ink)">incrementally</strong> using
            the <code>compilationMode: "annotation"</code> option with{' '}
            <code>{'// @compilable'}</code> comments.
          </li>
          <li>
            Existing hand-written <code>memo</code> / <code>useMemo</code> /{' '}
            <code>useCallback</code> still work — the compiler won't
            double-memoize them.
          </li>
          <li>
            Use <strong className="text-(--sea-ink)">React DevTools</strong>{' '}
            (v5+) to see a "Memo ✓" badge on compiler-optimised components.
          </li>
        </ul>
      </section>

      <PrevNextNav currentHref="/react-compiler" />
    </main>
  )
}
