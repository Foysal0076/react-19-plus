import ContextAsProviderNewWay from '@/components/context-as-provider/ContextAsProviderNewWay'
import ContextAsProviderOldWay from '@/components/context-as-provider/ContextAsProviderOldWay'

// --------------- code snippets ---------------

const codeOld = `import { createContext } from 'react'

const ThemeContext = createContext('')

// ⚠️ You must access the .Provider property
// React throws if you try to render the context
// object itself as a component.

function App() {
  return (
    <ThemeContext.Provider value="dark">
      <Page />
    </ThemeContext.Provider>
  )
}`

const codeNew = `import { createContext } from 'react'

const ThemeContext = createContext('')

// ✅ Render the context object directly.
// No .Provider suffix. That's it.

function App() {
  return (
    <ThemeContext value="dark">
      <Page />
    </ThemeContext>
  )
}`

const codeGlobalTheme = `// src/context/ThemeContext.ts
export const ThemeContext = createContext<'light' | 'dark'>('light')

// src/components/ThemeProvider.tsx — React 19 style
export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<'light' | 'dark'>('light')

  return (
    <ThemeContext value={theme}>   {/* <-- no .Provider */}
      {children}
    </ThemeContext>
  )
}

// Any descendant
function Page() {
  const theme = useContext(ThemeContext)
  return <div data-theme={theme}>…</div>
}`

// --------------- comparison rows ---------------

const comparisons = [
  {
    concern: 'Providing a value',
    before: '<MyCtx.Provider value={…}>',
    after: '<MyCtx value={…}>',
    highlight: true,
  },
  {
    concern: 'Import required',
    before: 'createContext (+ remember .Provider)',
    after: 'createContext only',
    highlight: false,
  },
  {
    concern: 'Typo risk',
    before: 'Forgetting .Provider silently breaks',
    after: 'Nothing extra to remember',
    highlight: true,
  },
  {
    concern: 'Closing tag',
    before: '</MyCtx.Provider>',
    after: '</MyCtx>',
    highlight: false,
  },
  {
    concern: 'Consuming (useContext)',
    before: 'Unchanged',
    after: 'Unchanged',
    highlight: false,
  },
  {
    concern: 'DevTools display',
    before: 'Shows as MyCtx.Provider',
    after: 'Shows as MyCtx',
    highlight: false,
  },
  {
    concern: '.Provider still works?',
    before: '—',
    after: 'Yes, deprecated but not removed',
    highlight: true,
  },
]

// --------------- page ---------------

export default function ContextAsProvider() {
  return (
    <main className="page-wrap px-4 pb-16 pt-10">
      {/* ── Hero ── */}
      <section className="island-shell rise-in relative overflow-hidden rounded-4xl px-6 py-10 sm:px-10 sm:py-14">
        <div className="pointer-events-none absolute -left-20 -top-24 h-56 w-56 rounded-full bg-[radial-gradient(circle,rgba(79,184,178,0.32),transparent_66%)]" />
        <div className="pointer-events-none absolute -bottom-20 -right-20 h-56 w-56 rounded-full bg-[radial-gradient(circle,rgba(47,106,74,0.18),transparent_66%)]" />
        <p className="island-kicker mb-3">React 19 · Breaking It Down</p>
        <h1 className="display-title mb-4 text-4xl font-bold leading-tight tracking-tight text-(--sea-ink) sm:text-5xl">
          Context as a Provider
        </h1>
        <p className="mb-0 max-w-2xl text-base text-(--sea-ink-soft) sm:text-lg">
          You no longer need to append{' '}
          <code className="text-(--lagoon-deep)">.Provider</code> to your
          context objects. In React 19+, you can render the context directly —{' '}
          <code className="text-(--lagoon-deep)">
            {'<ThemeContext value="dark">'}
          </code>{' '}
          instead of <code>{'<ThemeContext.Provider value="dark">'}</code>.
        </p>
      </section>

      {/* ── 3 cards ── */}
      <section className="mt-8 grid gap-4 sm:grid-cols-3">
        {[
          {
            kicker: 'The Old Way',
            title: '.Provider was mandatory',
            body: 'createContext() returns an object with a .Provider property. To wrap children you had to use that property explicitly — rendering the context object itself as a JSX element would throw an error.',
          },
          {
            kicker: 'The Change',
            title: 'Context IS the provider now',
            body: 'React 19 makes the context object itself a valid JSX element. You can render <ThemeContext value={…}> directly. The .Provider form still works but is deprecated — the new form is shorter and less surprising.',
          },
          {
            kicker: 'The Benefit',
            title: 'Less ceremony, same power',
            body: 'One fewer concept to teach, one less property to remember, and cleaner JSX trees. useContext() usage is completely unchanged — only the provider JSX syntax is different.',
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

      {/* ── Code comparison ── */}
      <section className="mt-10">
        <p className="island-kicker mb-2">Side-by-side</p>
        <h2 className="display-title mb-1 text-2xl font-bold text-(--sea-ink) sm:text-3xl">
          Provider syntax — then vs now
        </h2>
        <p className="mb-6 text-sm text-(--sea-ink-soft)">
          The only change is at the provider call site.{' '}
          <code>useContext(ThemeContext)</code> in consumers is completely
          untouched.
        </p>

        <div className="grid gap-4 lg:grid-cols-2">
          {/* Old */}
          <div className="island-shell flex flex-col overflow-hidden rounded-2xl">
            <div className="flex items-center gap-2 border-b border-(--line) px-5 py-3">
              <span className="h-2.5 w-2.5 rounded-full bg-orange-400" />
              <span className="text-xs font-semibold uppercase tracking-widest text-(--sea-ink-soft)">
                React 18 — ThemeContext.Provider
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
                React 19 — ThemeContext directly
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

        {/* Real-world pattern */}
        <div className="island-shell mt-4 flex flex-col overflow-hidden rounded-2xl">
          <div className="flex items-center gap-2 border-b border-(--line) px-5 py-3">
            <span className="h-2.5 w-2.5 rounded-full bg-(--palm)" />
            <span className="text-xs font-semibold uppercase tracking-widest text-(--sea-ink-soft)">
              Real-world pattern — ThemeProvider wrapper
            </span>
          </div>
          <pre
            className="m-0 overflow-x-auto p-5 text-xs leading-relaxed"
            style={{ background: '#1d2e45', color: '#e8efff', borderRadius: 0 }}
          >
            <code>{codeGlobalTheme}</code>
          </pre>
        </div>
      </section>

      {/* ── Comparison table ── */}
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

      {/* ── Live demo ── */}
      <section className="mt-10">
        <p className="island-kicker mb-2">Interactive demo</p>
        <h2 className="display-title mb-1 text-2xl font-bold text-(--sea-ink) sm:text-3xl">
          Local theme context in action
        </h2>
        <p className="mb-6 text-sm text-(--sea-ink-soft)">
          Each demo below manages its own <strong>isolated</strong> theme state
          via context — separate from the global site theme. A child component
          reads the value with <code>useContext</code> and renders accordingly.
          Toggle each independently to see that the only difference is the
          provider syntax.
        </p>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Old way */}
          <div className="island-shell overflow-hidden rounded-2xl">
            <div className="flex items-center gap-2 border-b border-(--line) px-5 py-3">
              <span className="h-2.5 w-2.5 rounded-full bg-orange-400" />
              <span className="text-xs font-semibold uppercase tracking-widest text-(--sea-ink-soft)">
                React 18 — {'<ThemeContext.Provider value={…}>'}
              </span>
            </div>
            <div className="p-5">
              <ContextAsProviderOldWay />
            </div>
          </div>

          {/* New way */}
          <div className="island-shell overflow-hidden rounded-2xl">
            <div className="flex items-center gap-2 border-b border-(--line) px-5 py-3">
              <span className="h-2.5 w-2.5 rounded-full bg-(--lagoon)" />
              <span className="text-xs font-semibold uppercase tracking-widest text-(--sea-ink-soft)">
                React 19 — {'<ThemeContext value={…}>'}
              </span>
            </div>
            <div className="p-5">
              <ContextAsProviderNewWay />
            </div>
          </div>
        </div>
      </section>

      {/* ── Key takeaways ── */}
      <section className="island-shell mt-10 rounded-2xl px-6 py-8">
        <p className="island-kicker mb-3">Key takeaways</p>
        <ul className="m-0 list-disc space-y-2.5 pl-5 text-sm text-(--sea-ink-soft)">
          <li>
            <strong className="text-(--sea-ink)">
              {'<MyContext.Provider>'}
            </strong>{' '}
            is deprecated in React 19 — it still works but will log a warning.
            Migrate when convenient.
          </li>
          <li>
            <strong className="text-(--sea-ink)">
              Consumers are untouched
            </strong>{' '}
            — <code>useContext(MyContext)</code> works exactly the same as
            before.
          </li>
          <li>
            The codemod <code>npx react-codemod@latest upgrade</code> can
            automate the migration across your whole codebase.
          </li>
          <li>
            Context nesting works identically — closer providers still override
            outer ones for all descendants.
          </li>
          <li>
            This pairs well with the{' '}
            <strong className="text-(--sea-ink)">React Compiler</strong> —
            context values wrapped in objects or arrays will be automatically
            memoized, preventing needless re-renders in consumers.
          </li>
        </ul>
      </section>
    </main>
  )
}
