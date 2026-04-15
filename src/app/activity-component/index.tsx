import ActivityPreRenderDemo from '@/components/activity-component/ActivityPreRenderDemo'
import ActivityStateDemo from '@/components/activity-component/ActivityStateDemo'
import ClassicConditionalDemo from '@/components/activity-component/ClassicConditionalDemo'

// ─── code snippets ────────────────────────────────────────────────────────────

const codeConditional = `// ❌ Classic conditional rendering
// React UNMOUNTS the component when it's hidden.
// All internal state (inputs, scroll position, counters) is DESTROYED.

function App() {
  const [tab, setTab] = useState('inbox')

  return (
    <>
      <Tabs />
      {tab === 'inbox'  && <InboxTab  />}  {/* unmounted when not active */}
      {tab === 'drafts' && <DraftsTab />}  {/* state reset every time */}
      {tab === 'sent'   && <SentTab   />}
    </>
  )
}`

const codeActivity = `// ✅ Activity component
// React HIDES the component with display:none.
// Internal state is PRESERVED. Effects are cleaned up while hidden.

import { Activity } from 'react'

function App() {
  const [tab, setTab] = useState('inbox')

  return (
    <>
      <Tabs />
      <Activity mode={tab === 'inbox'  ? 'visible' : 'hidden'}>
        <InboxTab />
      </Activity>
      <Activity mode={tab === 'drafts' ? 'visible' : 'hidden'}>
        <DraftsTab />
      </Activity>
      <Activity mode={tab === 'sent'   ? 'visible' : 'hidden'}>
        <SentTab />
      </Activity>
    </>
  )
}`

const codePrerender = `// Pre-rendering with hidden Activity
// Even on first render, hidden children still render at lower priority.
// This lets them fetch data or initialise before the user even asks.

import { Activity, Suspense } from 'react'

function App() {
  const [tab, setTab] = useState('home')

  return (
    <>
      <Tabs />

      <Activity mode={tab === 'home'  ? 'visible' : 'hidden'}>
        <Home />
      </Activity>

      {/* Posts renders in the background from the start */}
      <Activity mode={tab === 'posts' ? 'visible' : 'hidden'}>
        <Suspense fallback={<Skeleton />}>
          <Posts />   {/* data fetches silently while Home is active */}
        </Suspense>
      </Activity>
    </>
  )
}`

const codeSideEffect = `// ⚠️ Gotcha: DOM elements like <video> still exist when hidden.
// Their side effects (audio playback) persist under Activity.
// Fix: use useLayoutEffect to clean up when the component is hidden.

import { useRef, useLayoutEffect } from 'react'

function VideoTab() {
  const ref = useRef(null)

  // useLayoutEffect cleanup runs when Activity hides the component
  useLayoutEffect(() => {
    const video = ref.current
    return () => {
      video.pause()  // stop playback when hidden
    }
  }, [])

  return <video ref={ref} controls src="..." />
}`

// ─── comparison rows ──────────────────────────────────────────────────────────

const comparisons = [
  {
    concern: 'Component lifecycle',
    conditional: 'Unmounted / remounted',
    activity: 'Stays mounted, hidden with display:none',
    highlight: true,
  },
  {
    concern: 'Internal state (useState)',
    conditional: 'Destroyed on hide',
    activity: 'Preserved while hidden',
    highlight: true,
  },
  {
    concern: 'DOM state (textarea, scroll)',
    conditional: 'Lost on hide',
    activity: 'Preserved via DOM node retention',
    highlight: true,
  },
  {
    concern: 'Effects (useEffect)',
    conditional: 'Cleaned up on unmount',
    activity: 'Cleaned up on hide, re-run on show',
    highlight: false,
  },
  {
    concern: 'Background pre-rendering',
    conditional: '❌ Not possible',
    activity: '✅ Renders at lower priority while hidden',
    highlight: true,
  },
  {
    concern: 'Selective hydration (SSR)',
    conditional: 'Hydrates all at once',
    activity: 'Participates in selective hydration',
    highlight: false,
  },
  {
    concern: 'DOM side-effects (video, audio)',
    conditional: 'Stop automatically on unmount',
    activity: 'Persist — must clean up manually in useLayoutEffect',
    highlight: false,
  },
]

// ─── when to use ─────────────────────────────────────────────────────────────

const useCases = [
  {
    icon: '✅',
    title: 'Use Activity when…',
    items: [
      'A tab or panel will be revisited and its draft / scroll state should survive',
      'A hidden tab contains slow data — pre-render it in the background',
      'You want selective hydration SSR benefits without wrapping in <Suspense>',
      "You're building a wizard, stepper, or drawer that users toggle frequently",
    ],
    positive: true,
  },
  {
    icon: '❌',
    title: 'Skip Activity when…',
    items: [
      'The hidden content is never coming back (navigation away, deleted item)',
      'You intentionally want state to reset on re-show',
      '`<video>` / `<audio>` / `<iframe>` — DOM side-effects need manual cleanup',
    ],
    positive: false,
  },
]

// ─── page ─────────────────────────────────────────────────────────────────────

export default function ActivityComponentPage() {
  return (
    <main className="page-wrap px-4 pb-16 pt-10">
      {/* ── Hero ── */}
      <section className="island-shell rise-in relative overflow-hidden rounded-4xl px-6 py-10 sm:px-10 sm:py-14">
        <div className="pointer-events-none absolute -left-20 -top-24 h-56 w-56 rounded-full bg-[radial-gradient(circle,rgba(79,184,178,0.32),transparent_66%)]" />
        <div className="pointer-events-none absolute -bottom-20 -right-20 h-56 w-56 rounded-full bg-[radial-gradient(circle,rgba(47,106,74,0.18),transparent_66%)]" />
        <p className="island-kicker mb-3">React 19 · New Component</p>
        <h1 className="display-title mb-4 text-4xl font-bold leading-tight tracking-tight text-(--sea-ink) sm:text-5xl">
          <code className="text-(--lagoon-deep)">{'<Activity>'}</code>
        </h1>
        <p className="mb-0 max-w-2xl text-base text-(--sea-ink-soft) sm:text-lg">
          A new React component that hides and restores UI{' '}
          <strong className="text-(--sea-ink)">without destroying state</strong>
          . Unlike conditional rendering which unmounts children,{' '}
          <code>{'<Activity mode="hidden">'}</code> keeps them alive in the
          background — state, DOM, and all.
        </p>
      </section>

      {/* ── 3-card intro ── */}
      <section className="mt-8 grid gap-4 sm:grid-cols-3">
        {[
          {
            kicker: 'The Problem',
            title: 'Conditional rendering destroys state',
            body: 'When you write {show && <MyTab />}, React unmounts the component the moment show becomes false. Every counter, every filled-in textarea, every scroll position vanishes. The user comes back and finds a blank slate.',
          },
          {
            kicker: 'The Solution',
            title: 'Activity hides, not destroys',
            body: 'Wrapping children in <Activity mode="hidden"> applies display:none instead of unmounting. The component tree and its state are preserved in memory. When the mode switches back to "visible", everything is exactly as the user left it.',
          },
          {
            kicker: 'The Bonus',
            title: 'Background pre-rendering',
            body: 'Hidden Activity boundaries still render their children — at a lower priority than visible content. This means a "Posts" tab can silently fetch its data while the user is on the "Home" tab, making the first open feel instant.',
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
          DEMO 1 — State preservation
      ═══════════════════════════════════════════════════════════════════════ */}
      <section className="mt-14">
        <p className="island-kicker mb-2">Demo 1 of 3</p>
        <h2 className="display-title mb-1 text-2xl font-bold text-(--sea-ink) sm:text-3xl">
          Preserving state across tab switches
        </h2>
        <p className="mb-6 text-sm text-(--sea-ink-soft)">
          Type a note and increment the counter in any tab, then switch away and
          come back. The left panel uses classic <code>&&</code> — state resets.
          The right panel uses <code>{'<Activity>'}</code> — state survives.
        </p>

        {/* Code side-by-side */}
        <div className="grid gap-4 lg:grid-cols-2">
          <div className="island-shell flex flex-col overflow-hidden rounded-2xl">
            <div className="flex items-center gap-2 border-b border-(--line) px-5 py-3">
              <span className="h-2.5 w-2.5 rounded-full bg-orange-400" />
              <span className="text-xs font-semibold uppercase tracking-widest text-(--sea-ink-soft)">
                Conditional rendering — state lost
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
              <code>{codeConditional}</code>
            </pre>
          </div>
          <div className="island-shell flex flex-col overflow-hidden rounded-2xl">
            <div className="flex items-center gap-2 border-b border-(--line) px-5 py-3">
              <span className="h-2.5 w-2.5 rounded-full bg-(--lagoon)" />
              <span className="text-xs font-semibold uppercase tracking-widest text-(--sea-ink-soft)">
                {'<Activity>'} — state preserved
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
              <code>{codeActivity}</code>
            </pre>
          </div>
        </div>

        {/* Live demo */}
        <div className="mt-5 grid gap-5 lg:grid-cols-2">
          <div className="island-shell overflow-hidden rounded-2xl">
            <div className="flex items-center gap-2 border-b border-(--line) bg-orange-50/40 px-5 py-3 dark:bg-orange-950/10">
              <span className="h-2.5 w-2.5 rounded-full bg-orange-400" />
              <span className="text-xs font-semibold uppercase tracking-widest text-orange-600 dark:text-orange-400">
                {'{tab === x && <Tab />}'} — switch away, lose state
              </span>
            </div>
            <div className="p-5">
              <ClassicConditionalDemo />
            </div>
          </div>
          <div className="island-shell overflow-hidden rounded-2xl">
            <div className="flex items-center gap-2 border-b border-(--line) bg-teal-50/40 px-5 py-3 dark:bg-teal-950/10">
              <span className="h-2.5 w-2.5 rounded-full bg-(--lagoon)" />
              <span className="text-xs font-semibold uppercase tracking-widest text-(--lagoon-deep)">
                {'<Activity mode={…}>'} — switch away, keep state
              </span>
            </div>
            <div className="p-5">
              <ActivityStateDemo />
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════════
          DEMO 2 — Pre-rendering
      ═══════════════════════════════════════════════════════════════════════ */}
      <section className="mt-14">
        <p className="island-kicker mb-2">Demo 2 of 3</p>
        <h2 className="display-title mb-1 text-2xl font-bold text-(--sea-ink) sm:text-3xl">
          Background pre-rendering
        </h2>
        <p className="mb-6 text-sm text-(--sea-ink-soft)">
          Hidden <code>{'<Activity>'}</code> boundaries still render their
          children at lower priority. The Posts tab fetches its data silently
          while the Home tab is shown — so clicking Posts feels instant instead
          of showing a spinner.
        </p>

        <div className="island-shell mb-5 flex flex-col overflow-hidden rounded-2xl">
          <div className="flex items-center gap-2 border-b border-(--line) px-5 py-3">
            <span className="h-2.5 w-2.5 rounded-full bg-(--lagoon)" />
            <span className="text-xs font-semibold uppercase tracking-widest text-(--sea-ink-soft)">
              Hidden Activity pre-renders Suspense data
            </span>
          </div>
          <pre
            className="m-0 overflow-x-auto p-5 text-xs leading-relaxed"
            style={{ background: '#1d2e45', color: '#e8efff', borderRadius: 0 }}
          >
            <code>{codePrerender}</code>
          </pre>
        </div>

        <div className="island-shell overflow-hidden rounded-2xl">
          <div className="flex items-center gap-2 border-b border-(--line) bg-teal-50/40 px-5 py-3 dark:bg-teal-950/10">
            <span className="h-2.5 w-2.5 rounded-full bg-(--lagoon)" />
            <span className="text-xs font-semibold uppercase tracking-widest text-(--lagoon-deep)">
              Live — Posts pre-renders while Home is active
            </span>
          </div>
          <div className="p-5">
            <ActivityPreRenderDemo />
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════════
          DEMO 3 — Side-effect gotcha
      ═══════════════════════════════════════════════════════════════════════ */}
      <section className="mt-14">
        <p className="island-kicker mb-2">Demo 3 of 3 · Gotcha</p>
        <h2 className="display-title mb-1 text-2xl font-bold text-(--sea-ink) sm:text-3xl">
          DOM side-effects still run when hidden
        </h2>
        <p className="mb-5 text-sm text-(--sea-ink-soft)">
          Because <code>{'<Activity>'}</code> keeps the DOM alive, tags like{' '}
          <code>{'<video>'}</code>, <code>{'<audio>'}</code>, and{' '}
          <code>{'<iframe>'}</code> continue their behaviour after being hidden.
          A playing video won't pause just because you switched tabs. Fix it
          with a <code>useLayoutEffect</code> cleanup.
        </p>

        <div className="island-shell flex flex-col overflow-hidden rounded-2xl">
          <div className="flex items-center gap-2 border-b border-(--line) px-5 py-3">
            <span className="h-2.5 w-2.5 rounded-full bg-orange-400" />
            <span className="text-xs font-semibold uppercase tracking-widest text-(--sea-ink-soft)">
              How to handle DOM side-effects in hidden Activity
            </span>
          </div>
          <pre
            className="m-0 overflow-x-auto p-5 text-xs leading-relaxed"
            style={{ background: '#1d2e45', color: '#e8efff', borderRadius: 0 }}
          >
            <code>{codeSideEffect}</code>
          </pre>
        </div>

        <div className="mt-4 rounded-xl border border-orange-200 bg-orange-50/60 px-5 py-4 dark:border-orange-800/40 dark:bg-orange-950/20">
          <p className="m-0 text-sm text-orange-700 dark:text-orange-300">
            <strong>
              Why <code>useLayoutEffect</code> and not <code>useEffect</code>?
            </strong>{' '}
            The cleanup is visually tied to the hide transition — using{' '}
            <code>useLayoutEffect</code> ensures the pause fires synchronously
            as the component becomes hidden, before any re-suspending Suspense
            boundaries or View Transitions can delay it.
          </p>
        </div>
      </section>

      {/* ── Comparison table ── */}
      <section className="mt-12">
        <p className="island-kicker mb-2">At a glance</p>
        <h2 className="display-title mb-6 text-2xl font-bold text-(--sea-ink) sm:text-3xl">
          Conditional rendering vs Activity
        </h2>

        <div className="island-shell overflow-hidden rounded-2xl">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-(--line)">
                <th className="px-5 py-3.5 text-left font-semibold text-(--sea-ink-soft)">
                  Behaviour
                </th>
                <th className="px-5 py-3.5 text-left font-semibold text-orange-500">
                  {'{show && <Comp />}'}
                </th>
                <th className="px-5 py-3.5 text-left font-semibold text-(--lagoon-deep)">
                  {'<Activity mode={…}>'}
                </th>
              </tr>
            </thead>
            <tbody>
              {comparisons.map(
                ({ concern, conditional, activity, highlight }) => (
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
                        {conditional}
                      </code>
                    </td>
                    <td className="px-5 py-3.5 font-medium text-(--lagoon-deep)">
                      {activity}
                    </td>
                  </tr>
                ),
              )}
            </tbody>
          </table>
        </div>
      </section>

      {/* ── When to use / not use ── */}
      <section className="mt-10 grid gap-4 sm:grid-cols-2">
        {useCases.map(({ icon, title, items, positive }) => (
          <div
            key={title}
            className={[
              'rounded-2xl border px-6 py-5',
              positive
                ? 'border-teal-200 bg-teal-50/60 dark:border-teal-800/40 dark:bg-teal-950/20'
                : 'border-orange-200 bg-orange-50/60 dark:border-orange-800/40 dark:bg-orange-950/20',
            ].join(' ')}
          >
            <p
              className={[
                'mb-3 text-sm font-bold',
                positive
                  ? 'text-teal-700 dark:text-teal-300'
                  : 'text-orange-700 dark:text-orange-300',
              ].join(' ')}
            >
              {icon} {title}
            </p>
            <ul className="m-0 list-disc space-y-1.5 pl-5">
              {items.map((item) => (
                <li
                  key={item}
                  className={[
                    'text-sm',
                    positive
                      ? 'text-teal-700 dark:text-teal-300'
                      : 'text-orange-700 dark:text-orange-300',
                  ].join(' ')}
                >
                  {item}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </section>

      {/* ── Key takeaways ── */}
      <section className="island-shell mt-10 rounded-2xl px-6 py-8">
        <p className="island-kicker mb-3">Key takeaways</p>
        <ul className="m-0 list-disc space-y-2.5 pl-5 text-sm text-(--sea-ink-soft)">
          <li>
            <code>{'<Activity mode="hidden">'}</code> hides children with{' '}
            <code>display: none</code> — the component is{' '}
            <strong className="text-(--sea-ink)">not unmounted</strong>, so all
            state and DOM are preserved.
          </li>
          <li>
            <strong className="text-(--sea-ink)">
              Effects are still cleaned up
            </strong>{' '}
            when a boundary hides — preventing phantom subscriptions from hidden
            UI.
          </li>
          <li>
            Hidden boundaries{' '}
            <strong className="text-(--sea-ink)">
              pre-render at lower priority
            </strong>
            , allowing Suspense data to fetch in the background before the user
            ever navigates to that section.
          </li>
          <li>
            Activity boundaries participate in{' '}
            <strong className="text-(--sea-ink)">Selective Hydration</strong> —
            React can make tab buttons interactive before mounting the heavy tab
            content.
          </li>
          <li>
            Watch out for{' '}
            <strong className="text-(--sea-ink)">
              DOM side-effects (video, audio, iframe)
            </strong>{' '}
            — they persist when hidden. Clean them up with{' '}
            <code>useLayoutEffect</code>.
          </li>
          <li>
            Activity is{' '}
            <strong className="text-(--sea-ink)">
              not a replacement for all conditional rendering
            </strong>{' '}
            — if the content truly won't come back, or you want a fresh state,
            keep using <code>&&</code>.
          </li>
        </ul>
      </section>
    </main>
  )
}
