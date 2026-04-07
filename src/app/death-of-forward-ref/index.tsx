import ForwardRefNewWay from '@/components/forward-ref/ForwardRefNewWay'
import ForwardRefOldWay from '@/components/forward-ref/ForwardRefOldWay'
import { useRef, useState } from 'react'

// --------------- code snippets ---------------

const codeOld = `import { forwardRef } from 'react'

// ⚠️ Must wrap the entire component in forwardRef()
// The ref is passed as a second argument — completely
// separate from props. Easy to forget, hard to type.

const MyInput = forwardRef<HTMLInputElement, Props>(
  function MyInput({ label, ...props }, ref) {
    return (
      <div>
        {label && <label>{label}</label>}
        <input ref={ref} {...props} />
      </div>
    )
  }
)

export default MyInput`

const codeNew = `// ✅ ref is just a normal prop — no wrapper needed.
// Destructure it like anything else.

export default function MyInput({ label, ref, ...props }: Props) {
  return (
    <div>
      {label && <label>{label}</label>}
      <input ref={ref} {...props} />
    </div>
  )
}`

const codeUsage = `// Usage is identical in both cases
const inputRef = useRef<HTMLInputElement>(null)

function focusInput() {
  inputRef.current?.focus()
  inputRef.current?.select()
}

return (
  <>
    <MyInput ref={inputRef} label="Email" placeholder="you@example.com" />
    <button onClick={focusInput}>Focus</button>
  </>
)`

// --------------- comparison rows ---------------

const comparisons = [
  {
    concern: 'Passing a ref to a child',
    before: 'Must wrap with forwardRef()',
    after: 'ref is just a prop',
    highlight: true,
  },
  {
    concern: 'Component definition',
    before: 'forwardRef((props, ref) => …)',
    after: 'function Comp({ ref, ...props })',
    highlight: false,
  },
  {
    concern: 'Import required',
    before: "import { forwardRef } from 'react'",
    after: 'None',
    highlight: true,
  },
  {
    concern: 'TypeScript ref typing',
    before: 'forwardRef<El, Props>((p, ref) => …)',
    after: 'ref?: React.Ref<El> in Props type',
    highlight: false,
  },
  {
    concern: 'displayName in DevTools',
    before: 'Auto if function is named inside forwardRef',
    after: 'Always the function name',
    highlight: false,
  },
  {
    concern: 'Nesting / HOC composition',
    before: 'Each layer needs its own forwardRef()',
    after: 'Just pass ref like any other prop',
    highlight: true,
  },
  {
    concern: 'Mental model',
    before: 'Refs are special — different code path',
    after: 'Refs are plain props',
    highlight: false,
  },
]

// --------------- page ---------------

export default function DeathOfForwardRef() {
  const oldRef = useRef<HTMLInputElement>(null)
  const newRef = useRef<HTMLInputElement>(null)
  const [oldLog, setOldLog] = useState<string[]>([])
  const [newLog, setNewLog] = useState<string[]>([])

  function focusOld() {
    oldRef.current?.focus()
    oldRef.current?.select()
    setOldLog((l) => [...l, `focused · value="${oldRef.current?.value ?? ''}"`])
  }

  function focusNew() {
    newRef.current?.focus()
    newRef.current?.select()
    setNewLog((l) => [...l, `focused · value="${newRef.current?.value ?? ''}"`])
  }

  return (
    <main className="page-wrap px-4 pb-16 pt-10">
      {/* ── Hero ── */}
      <section className="island-shell rise-in relative overflow-hidden rounded-4xl px-6 py-10 sm:px-10 sm:py-14">
        <div className="pointer-events-none absolute -left-20 -top-24 h-56 w-56 rounded-full bg-[radial-gradient(circle,rgba(79,184,178,0.32),transparent_66%)]" />
        <div className="pointer-events-none absolute -bottom-20 -right-20 h-56 w-56 rounded-full bg-[radial-gradient(circle,rgba(47,106,74,0.18),transparent_66%)]" />
        <p className="island-kicker mb-3">React 19 · Breaking It Down</p>
        <h1 className="display-title mb-4 text-4xl font-bold leading-tight tracking-tight text-(--sea-ink) sm:text-5xl">
          The Death of <code className="text-(--lagoon-deep)">forwardRef</code>
        </h1>
        <p className="mb-0 max-w-2xl text-base text-(--sea-ink-soft) sm:text-lg">
          Passing a <code>ref</code> to a custom component used to require
          wrapping it in <code>forwardRef()</code>. In React 19+,{' '}
          <code>ref</code> is just a standard prop — no wrapper, no second
          argument, no extra import.
        </p>
      </section>

      {/* ── What was the problem? ── */}
      <section className="mt-8 grid gap-4 sm:grid-cols-3">
        {[
          {
            kicker: 'The Problem',
            title: 'Refs were special-cased',
            body: "React never passed ref through the normal props object. If you needed a parent to hold a ref to a child's DOM node, you had to explicitly opt in with forwardRef() — a wrapper that hoisted ref out of props into a dedicated second argument.",
          },
          {
            kicker: 'The Pain',
            title: 'Boilerplate everywhere',
            body: 'Every reusable input, button, modal trigger, or scroll target needed the wrapper. TypeScript users also had to repeat the element type in a generic. HOC authors had to forward refs yet again at every layer.',
          },
          {
            kicker: 'The Fix',
            title: 'ref is just a prop now',
            body: 'React 19 lifts this restriction. ref flows through props like any other value. Destructure it, spread it, ignore it — same as className or onClick. No import, no wrapper, no ceremony.',
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
          The same component — two eras
        </h2>
        <p className="mb-6 text-sm text-(--sea-ink-soft)">
          Both accept a <code>ref</code> from the parent and forward it to the
          underlying <code>{'<input>'}</code>. The React 19 version removes all
          the ceremony.
        </p>

        <div className="grid gap-4 lg:grid-cols-2">
          {/* Old */}
          <div className="island-shell flex flex-col overflow-hidden rounded-2xl">
            <div className="flex items-center gap-2 border-b border-(--line) px-5 py-3">
              <span className="h-2.5 w-2.5 rounded-full bg-orange-400" />
              <span className="text-xs font-semibold uppercase tracking-widest text-(--sea-ink-soft)">
                React 18 — forwardRef() wrapper
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
              <code>{codeOld}</code>
            </pre>
          </div>

          {/* New */}
          <div className="island-shell flex flex-col overflow-hidden rounded-2xl">
            <div className="flex items-center gap-2 border-b border-(--line) px-5 py-3">
              <span className="h-2.5 w-2.5 rounded-full bg-(--lagoon)" />
              <span className="text-xs font-semibold uppercase tracking-widest text-(--sea-ink-soft)">
                React 19 — ref as a plain prop
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
              <code>{codeNew}</code>
            </pre>
          </div>
        </div>

        {/* Usage snippet */}
        <div className="island-shell mt-4 flex flex-col overflow-hidden rounded-2xl">
          <div className="flex items-center gap-2 border-b border-(--line) px-5 py-3">
            <span className="h-2.5 w-2.5 rounded-full bg-(--palm)" />
            <span className="text-xs font-semibold uppercase tracking-widest text-(--sea-ink-soft)">
              Usage — identical in both cases
            </span>
          </div>
          <pre
            className="m-0 overflow-x-auto p-5 text-xs leading-relaxed"
            style={{ background: '#1d2e45', color: '#e8efff', borderRadius: 0 }}
          >
            <code>{codeUsage}</code>
          </pre>
        </div>
      </section>

      {/* ── Comparison Table ── */}
      <section className="mt-10">
        <p className="island-kicker mb-2">At a glance</p>
        <h2 className="display-title mb-6 text-2xl font-bold text-(--sea-ink) sm:text-3xl">
          What changed
        </h2>

        <div className="island-shell overflow-hidden rounded-2xl">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-(--line)">
                <th className="px-5 py-3.5 text-left font-semibold text-(--sea-ink-soft)">
                  Concern
                </th>
                <th className="px-5 py-3.5 text-left font-semibold text-orange-500">
                  React 18
                </th>
                <th className="px-5 py-3.5 text-left font-semibold text-(--lagoon-deep)">
                  React 19+
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

      {/* ── Live Demo ── */}
      <section className="mt-10">
        <p className="island-kicker mb-2">Interactive demo</p>
        <h2 className="display-title mb-1 text-2xl font-bold text-(--sea-ink) sm:text-3xl">
          Both work identically
        </h2>
        <p className="mb-6 text-sm text-(--sea-ink-soft)">
          The parent holds a <code>useRef</code> and passes it down. Clicking{' '}
          <strong>Focus &amp; read value</strong> imperatively focuses the input
          and reads its current value via the ref — proving the ref is wired
          correctly in both approaches.
        </p>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Old way demo */}
          <div className="island-shell overflow-hidden rounded-2xl">
            <div className="flex items-center gap-2 border-b border-(--line) px-5 py-3">
              <span className="h-2.5 w-2.5 rounded-full bg-orange-400" />
              <span className="text-xs font-semibold uppercase tracking-widest text-(--sea-ink-soft)">
                React 18 — ForwardRefOldWay
              </span>
            </div>
            <div className="space-y-4 p-5">
              <ForwardRefOldWay
                ref={oldRef}
                label="Type something, then click Focus"
                placeholder="Hello from React 18…"
              />
              <button
                onClick={focusOld}
                className="rounded-lg border border-(--line) bg-(--surface) px-4 py-2 text-sm font-semibold text-(--sea-ink) transition hover:border-orange-400 hover:text-orange-600"
              >
                Focus &amp; read value
              </button>
              {oldLog.length > 0 && (
                <div className="space-y-1">
                  {oldLog.map((entry, i) => (
                    <p
                      key={i}
                      className="m-0 font-mono text-xs text-(--sea-ink-soft)"
                    >
                      <span className="text-orange-500">ref →</span> {entry}
                    </p>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* New way demo */}
          <div className="island-shell overflow-hidden rounded-2xl">
            <div className="flex items-center gap-2 border-b border-(--line) px-5 py-3">
              <span className="h-2.5 w-2.5 rounded-full bg-(--lagoon)" />
              <span className="text-xs font-semibold uppercase tracking-widest text-(--sea-ink-soft)">
                React 19 — ForwardRefNewWay
              </span>
            </div>
            <div className="space-y-4 p-5">
              <ForwardRefNewWay
                ref={newRef}
                label="Type something, then click Focus"
                placeholder="Hello from React 19…"
              />
              <button
                onClick={focusNew}
                className="rounded-lg border border-(--line) bg-(--surface) px-4 py-2 text-sm font-semibold text-(--sea-ink) transition hover:border-(--lagoon-deep) hover:text-(--lagoon-deep)"
              >
                Focus &amp; read value
              </button>
              {newLog.length > 0 && (
                <div className="space-y-1">
                  {newLog.map((entry, i) => (
                    <p
                      key={i}
                      className="m-0 font-mono text-xs text-(--sea-ink-soft)"
                    >
                      <span className="text-(--lagoon-deep)">ref →</span>{' '}
                      {entry}
                    </p>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ── Key Takeaways ── */}
      <section className="island-shell mt-10 rounded-2xl px-6 py-8">
        <p className="island-kicker mb-3">Key takeaways</p>
        <ul className="m-0 list-disc space-y-2.5 pl-5 text-sm text-(--sea-ink-soft)">
          <li>
            <strong className="text-(--sea-ink)">
              forwardRef() is deprecated
            </strong>{' '}
            in React 19 — it still works but will log a warning. Migrate when
            you can.
          </li>
          <li>
            <code>ref</code> is now passed in the{' '}
            <strong className="text-(--sea-ink)">props object</strong> like any
            other prop. Just destructure it.
          </li>
          <li>
            For TypeScript, add{' '}
            <code>ref?: React.Ref&lt;HTMLInputElement&gt;</code> to your Props
            type — no extra generic on the component itself.
          </li>
          <li>
            HOCs and wrapper components no longer need to call{' '}
            <code>forwardRef()</code> at each layer — just pass <code>ref</code>{' '}
            through like any other prop.
          </li>
          <li>
            <strong className="text-(--sea-ink)">
              Existing forwardRef code keeps working
            </strong>{' '}
            — the codemod <code>npx react-codemod@latest upgrade</code> can
            automate the migration.
          </li>
        </ul>
      </section>
    </main>
  )
}
