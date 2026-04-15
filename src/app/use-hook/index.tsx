import UseHookContextDemo from '@/components/use-hook/UseHookContextDemo'
import UseHookPromiseDemo from '@/components/use-hook/UseHookPromiseDemo'

// --------------- code snippets ---------------

const codeUseContextOld = `import { useContext } from 'react'

function ThemePanel({ show }) {
  // ❌ Hooks must be called at the top level — BEFORE any return.
  // Moving this below the if() would violate the Rules of Hooks.
  const theme = useContext(ThemeContext)

  if (!show) return null  // ← can only return here, after the hook

  return <div className={\`panel-\${theme}\`}>...</div>
}`

const codeUseContextNew = `import { use } from 'react'

function ThemePanel({ show }) {
  // ✅ use() can be called AFTER a conditional return.
  // The hook order rule does NOT apply to use().
  if (!show) return null

  const theme = use(ThemeContext)  // ← called inside a branch

  return <div className={\`panel-\${theme}\`}>...</div>
}

// Also valid inside a loop:
function TagList({ tags }) {
  return tags.map(tag => {
    if (!tag.visible) return null
    const theme = use(ThemeContext)  // ← called inside map/if
    return <Tag key={tag.id} theme={theme} label={tag.label} />
  })
}`

const codePromiseBasic = `import { use, Suspense } from 'react'

// ① A component that reads a Promise via use()
//   — it suspends until the Promise resolves.
function PostList({ postsPromise }) {
  const posts = use(postsPromise)  // suspends here while pending
  return posts.map(p => <Post key={p.id} {...p} />)
}

// ② Wrap with Suspense to handle the suspended state
function App() {
  const postsPromise = fetchPosts()  // returns a Promise

  return (
    <Suspense fallback={<Skeleton />}>
      <PostList postsPromise={postsPromise} />
    </Suspense>
  )
}`

const codePromiseErrorBoundary = `import { use, Suspense } from 'react'
import { ErrorBoundary } from 'react-error-boundary'

function PostList({ postsPromise }) {
  const posts = use(postsPromise)
  return posts.map(p => <Post key={p.id} {...p} />)
}

function App() {
  const postsPromise = fetchPosts()  // returns a Promise

  return (
    // ③ ErrorBoundary catches rejected Promises automatically.
    //    No try-catch inside the component needed.
    <ErrorBoundary fallback={<p>Something went wrong</p>}>
      <Suspense fallback={<Skeleton />}>
        <PostList postsPromise={postsPromise} />
      </Suspense>
    </ErrorBoundary>
  )
}`

const codeStablePromise = `// ⚠️ WRONG — Promise recreated on every render
function App() {
  // fetchPosts() runs on every render → use() gets a new
  // Promise each time → infinite refresh loop
  return <PostList postsPromise={fetchPosts()} />
}

// ✅ CORRECT — promise is stable across renders
function App() {
  // Store the Promise in state or pass it from a server component
  const [promise] = useState(() => fetchPosts())
  return <PostList postsPromise={promise} />
}

// ✅ BEST in React 19+ — create in a Server Component
// Server Component (async)
export default async function Page() {
  const postsPromise = fetchPosts()  // stable — only runs once
  return <PostList postsPromise={postsPromise} />
}`

// --------------- comparison rows (context section) ---------------

const contextComparisons = [
  {
    concern: 'Call position',
    before: 'Must be before any return / if',
    after: 'Can be after conditional returns',
    highlight: true,
  },
  {
    concern: 'Inside if() block',
    before: '❌ violates Rules of Hooks',
    after: '✅ fully supported',
    highlight: true,
  },
  {
    concern: 'Inside a loop',
    before: '❌ violates Rules of Hooks',
    after: '✅ fully supported',
    highlight: false,
  },
  {
    concern: 'Import',
    before: "import { useContext } from 'react'",
    after: "import { use } from 'react'",
    highlight: false,
  },
  {
    concern: 'Works in custom hooks',
    before: '✅',
    after: '✅',
    highlight: false,
  },
  {
    concern: 'Can also read Promises',
    before: '❌ context only',
    after: '✅ both context and Promises',
    highlight: true,
  },
]

// --------------- rules rows ---------------

const rules = [
  { rule: 'Call inside a Component or Hook', allowed: true },
  { rule: 'Call after a conditional return', allowed: true },
  { rule: 'Call inside an if() block', allowed: true },
  { rule: 'Call inside a for/map loop', allowed: true },
  { rule: 'Call in a try-catch block', allowed: false },
  { rule: 'Call in a regular function (not Component/Hook)', allowed: false },
  { rule: 'Call at the top level of a module', allowed: false },
]

// --------------- page ---------------

export default function UseHookPage() {
  return (
    <main className="page-wrap px-4 pb-16 pt-10">
      <title>React 19 · use() Hook</title>
      <meta
        name="description"
        content="Learn about the new use() hook in React 19"
      />
      {/* ── Hero ── */}
      <section className="island-shell rise-in relative overflow-hidden rounded-4xl px-6 py-10 sm:px-10 sm:py-14">
        <div className="pointer-events-none absolute -left-20 -top-24 h-56 w-56 rounded-full bg-[radial-gradient(circle,rgba(79,184,178,0.32),transparent_66%)]" />
        <div className="pointer-events-none absolute -bottom-20 -right-20 h-56 w-56 rounded-full bg-[radial-gradient(circle,rgba(47,106,74,0.18),transparent_66%)]" />
        <p className="island-kicker mb-3">React 19 · New API</p>
        <h1 className="display-title mb-4 text-4xl font-bold leading-tight tracking-tight text-(--sea-ink) sm:text-5xl">
          The <code className="text-(--lagoon-deep)">use()</code> Hook
        </h1>
        <p className="mb-0 max-w-2xl text-base text-(--sea-ink-soft) sm:text-lg">
          A brand-new React API that reads resources — either a{' '}
          <strong className="text-(--sea-ink)">Promise</strong> or a{' '}
          <strong className="text-(--sea-ink)">Context</strong> — and uniquely
          can be called inside <code>if</code> statements and loops. The regular
          Rules of Hooks do not apply.
        </p>
      </section>

      {/* ── 3-card intro ── */}
      <section className="mt-8 grid gap-4 sm:grid-cols-3">
        {[
          {
            kicker: 'What it reads',
            title: 'Promises and Context',
            body: 'use() accepts either a Promise (for async data) or a Context object. For Context, it works exactly like useContext but with fewer restrictions. For Promises, it integrates with Suspense out of the box.',
          },
          {
            kicker: 'What makes it special',
            title: 'Callable anywhere in a component',
            body: "Unlike every other hook, use() can appear after conditional returns, inside if blocks, inside loops, and inside nested expressions — because it's not technically a hook. It's an API.",
          },
          {
            kicker: 'Suspense integration',
            title: 'Async rendering without useEffect',
            body: 'When use(promise) is pending, the component suspends. React shows the nearest Suspense fallback until the data arrives. If the promise rejects, the nearest Error Boundary handles it.',
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

      {/* ═══════════════════════════════════════════════════════
          PART 1: use() with Context
      ═══════════════════════════════════════════════════════ */}

      <section className="mt-14">
        <p className="island-kicker mb-2">Part 1 of 2</p>
        <h2 className="display-title mb-1 text-2xl font-bold text-(--sea-ink) sm:text-3xl">
          Reading Context — conditionally
        </h2>
        <p className="mb-6 text-sm text-(--sea-ink-soft)">
          The most practical win over <code>useContext</code>: you can now skip
          reading a context entirely when a component decides early it has
          nothing to render. No dummy state, no restructuring needed.
        </p>

        {/* Code comparison */}
        <div className="grid gap-4 lg:grid-cols-2">
          <div className="island-shell flex flex-col overflow-hidden rounded-2xl">
            <div className="flex items-center gap-2 border-b border-(--line) px-5 py-3">
              <span className="h-2.5 w-2.5 rounded-full bg-orange-400" />
              <span className="text-xs font-semibold uppercase tracking-widest text-(--sea-ink-soft)">
                useContext — must be at the top
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
              <code>{codeUseContextOld}</code>
            </pre>
          </div>

          <div className="island-shell flex flex-col overflow-hidden rounded-2xl">
            <div className="flex items-center gap-2 border-b border-(--line) px-5 py-3">
              <span className="h-2.5 w-2.5 rounded-full bg-(--lagoon)" />
              <span className="text-xs font-semibold uppercase tracking-widest text-(--sea-ink-soft)">
                use() — after conditionals ✅
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
              <code>{codeUseContextNew}</code>
            </pre>
          </div>
        </div>

        {/* Context comparison table */}
        <div className="island-shell mt-6 overflow-hidden rounded-2xl">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-(--line)">
                <th className="px-5 py-3.5 text-left font-semibold text-(--sea-ink-soft)">
                  Concern
                </th>
                <th className="px-5 py-3.5 text-left font-semibold text-orange-500">
                  useContext
                </th>
                <th className="px-5 py-3.5 text-left font-semibold text-(--lagoon-deep)">
                  use()
                </th>
              </tr>
            </thead>
            <tbody>
              {contextComparisons.map(
                ({ concern, before, after, highlight }) => (
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
                ),
              )}
            </tbody>
          </table>
        </div>

        {/* Context live demo */}
        <div className="mt-6">
          <p className="island-kicker mb-2">Live demo</p>
          <h3 className="display-title mb-1 text-xl font-bold text-(--sea-ink)">
            Notification panels with conditional context reading
          </h3>
          <p className="mb-4 text-sm text-(--sea-ink-soft)">
            Each panel calls <code>use(PanelThemeContext)</code> only{' '}
            <strong className="text-(--sea-ink)">after</strong> checking whether
            it should render. Hidden panels return early and never touch the
            context. Toggle visibility and theme to see it live.
          </p>

          <div className="island-shell overflow-hidden rounded-2xl">
            <div className="flex items-center gap-2 border-b border-(--line) px-5 py-3">
              <span className="h-2.5 w-2.5 rounded-full bg-(--lagoon)" />
              <span className="text-xs font-semibold uppercase tracking-widest text-(--sea-ink-soft)">
                use(PanelThemeContext) called conditionally
              </span>
            </div>
            <div className="p-5">
              <UseHookContextDemo />
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════
          PART 2: use() with Promises
      ═══════════════════════════════════════════════════════ */}

      <section className="mt-14">
        <p className="island-kicker mb-2">Part 2 of 2</p>
        <h2 className="display-title mb-1 text-2xl font-bold text-(--sea-ink) sm:text-3xl">
          Reading Promises — async without{' '}
          <code className="text-2xl">useEffect</code>
        </h2>
        <p className="mb-6 text-sm text-(--sea-ink-soft)">
          Pass a Promise as a prop, call <code>use(promise)</code> inside the
          component, wrap with <code>{'<Suspense>'}</code>, and React handles
          the entire loading lifecycle. No <code>isLoading</code> state, no{' '}
          <code>useEffect</code>, no manual cleanup.
        </p>

        {/* Promise code snippets */}
        <div className="grid gap-4 lg:grid-cols-2">
          <div className="island-shell flex flex-col overflow-hidden rounded-2xl">
            <div className="flex items-center gap-2 border-b border-(--line) px-5 py-3">
              <span className="h-2.5 w-2.5 rounded-full bg-(--lagoon)" />
              <span className="text-xs font-semibold uppercase tracking-widest text-(--sea-ink-soft)">
                Basic Pattern — use() + Suspense
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
              <code>{codePromiseBasic}</code>
            </pre>
          </div>

          <div className="island-shell flex flex-col overflow-hidden rounded-2xl">
            <div className="flex items-center gap-2 border-b border-(--line) px-5 py-3">
              <span className="h-2.5 w-2.5 rounded-full bg-(--palm)" />
              <span className="text-xs font-semibold uppercase tracking-widest text-(--sea-ink-soft)">
                With Error Boundary — rejected Promises
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
              <code>{codePromiseErrorBoundary}</code>
            </pre>
          </div>
        </div>

        {/* Stable promise gotcha */}
        <div className="island-shell mt-4 flex flex-col overflow-hidden rounded-2xl">
          <div className="flex items-center gap-2 border-b border-(--line) px-5 py-3">
            <span className="h-2.5 w-2.5 rounded-full bg-orange-400" />
            <span className="text-xs font-semibold uppercase tracking-widest text-(--sea-ink-soft)">
              ⚠️ Common gotcha — stable promise references
            </span>
          </div>
          <pre
            className="m-0 overflow-x-auto p-5 text-xs leading-relaxed"
            style={{ background: '#1d2e45', color: '#e8efff', borderRadius: 0 }}
          >
            <code>{codeStablePromise}</code>
          </pre>
        </div>

        {/* Promise live demo */}
        <div className="mt-6">
          <p className="island-kicker mb-2">Live demo</p>
          <h3 className="display-title mb-1 text-xl font-bold text-(--sea-ink)">
            Promise-based data with Suspense + Error Boundary
          </h3>
          <p className="mb-4 text-sm text-(--sea-ink-soft)">
            Clicking <strong>Fetch posts (success)</strong> creates a Promise
            and passes it to <code>PostList</code>. <code>use(promise)</code>{' '}
            suspends the component — the skeleton shows for 1.5 s, then data
            arrives. Click <strong>Fetch posts (fail)</strong> to see the Error
            Boundary catch the rejection declaratively.
          </p>

          <div className="island-shell overflow-hidden rounded-2xl">
            <div className="flex items-center gap-2 border-b border-(--line) px-5 py-3">
              <span className="h-2.5 w-2.5 rounded-full bg-(--lagoon)" />
              <span className="text-xs font-semibold uppercase tracking-widest text-(--sea-ink-soft)">
                Suspense + use(postsPromise) + ErrorBoundary
              </span>
            </div>
            <div className="p-5">
              <UseHookPromiseDemo />
            </div>
          </div>
        </div>
      </section>

      {/* ── Rules table ── */}
      <section className="mt-14">
        <p className="island-kicker mb-2">Rules of use()</p>
        <h2 className="display-title mb-6 text-2xl font-bold text-(--sea-ink) sm:text-3xl">
          Where you can and can't call it
        </h2>

        <div className="island-shell overflow-hidden rounded-2xl">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-(--line)">
                <th className="px-5 py-3.5 text-left font-semibold text-(--sea-ink-soft)">
                  Call location
                </th>
                <th className="px-5 py-3.5 text-left font-semibold text-(--sea-ink-soft)">
                  Allowed?
                </th>
              </tr>
            </thead>
            <tbody>
              {rules.map(({ rule, allowed }) => (
                <tr
                  key={rule}
                  className="border-b border-(--line) last:border-0"
                >
                  <td className="px-5 py-3.5 font-medium text-(--sea-ink)">
                    {rule}
                  </td>
                  <td className="px-5 py-3.5">
                    {allowed ? (
                      <span className="font-semibold text-(--lagoon-deep)">
                        ✅ Yes
                      </span>
                    ) : (
                      <span className="font-semibold text-red-500">❌ No</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-4 rounded-xl border border-orange-200 bg-orange-50/60 px-5 py-4 dark:border-orange-800/40 dark:bg-orange-950/20">
          <p className="m-0 text-sm text-orange-700 dark:text-orange-300">
            <strong>Note:</strong> Even though <code>use()</code> is more
            flexible than hooks, it still follows two hard rules: it must be
            called inside a Component or Hook, and it{' '}
            <strong>cannot be called inside a try-catch block</strong>. For
            rejected Promises, use an Error Boundary or{' '}
            <code>promise.catch()</code> instead.
          </p>
        </div>
      </section>

      {/* ── Key takeaways ── */}
      <section className="island-shell mt-10 rounded-2xl px-6 py-8">
        <p className="island-kicker mb-3">Key takeaways</p>
        <ul className="m-0 list-disc space-y-2.5 pl-5 text-sm text-(--sea-ink-soft)">
          <li>
            <code>use()</code> is{' '}
            <strong className="text-(--sea-ink)">not technically a hook</strong>{' '}
            — it's a React API. The Rules of Hooks (top-level call requirement)
            do not apply to it.
          </li>
          <li>
            For <strong className="text-(--sea-ink)">Context</strong>,{' '}
            <code>use(MyContext)</code> is a drop-in replacement for{' '}
            <code>useContext(MyContext)</code> with the added ability to call it
            conditionally.
          </li>
          <li>
            For <strong className="text-(--sea-ink)">Promises</strong>,{' '}
            <code>use(promise)</code> suspends the component while pending. Wrap
            with <code>{'<Suspense>'}</code> for the loading state and an Error
            Boundary for rejections.
          </li>
          <li>
            <strong className="text-(--sea-ink)">Keep Promises stable</strong> —
            don't create them inline in the render function. Store them in{' '}
            <code>useState</code>, <code>useRef</code>, or — best of all — pass
            them from a Server Component.
          </li>
          <li>
            <strong className="text-(--sea-ink)">Never use a try-catch</strong>{' '}
            around <code>use()</code>. Wrap with an Error Boundary or chain{' '}
            <code>.catch()</code> on the Promise before passing it in.
          </li>
          <li>
            In Server Components, prefer <code>async/await</code> for data
            fetching. <code>use()</code> is the client-side bridge that receives
            Promises created on the server.
          </li>
        </ul>
      </section>
    </main>
  )
}
