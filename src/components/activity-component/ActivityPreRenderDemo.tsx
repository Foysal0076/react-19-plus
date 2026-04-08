import { Activity, use, useState, Suspense } from 'react'

type SlowPost = { id: number; title: string; body: string }

function fakeFetchPosts(): Promise<SlowPost[]> {
  return new Promise((resolve) =>
    setTimeout(
      () =>
        resolve([
          {
            id: 1,
            title: 'React 19 ships Activity',
            body: 'The new Activity component lets you hide/show UI while preserving state and pre-rendering background content.',
          },
          {
            id: 2,
            title: 'Suspense + Activity = fast tabs',
            body: 'Combining Activity with Suspense pre-renders hidden tabs in the background, so the first open feels instant.',
          },
          {
            id: 3,
            title: 'Effects clean up when hidden',
            body: 'When an Activity becomes hidden, React destroys its Effects — preventing phantom subscriptions and side-effects.',
          },
        ]),
      1800,
    ),
  )
}

// Stable promise — created once at module level so it never re-fetches
const postsPromise = fakeFetchPosts()

function PostsList() {
  const posts = use(postsPromise)
  return (
    <div className="space-y-2">
      {posts.map((p) => (
        <div key={p.id} className="island-shell rounded-xl p-4">
          <p className="mb-1 text-sm font-semibold text-(--sea-ink)">
            {p.title}
          </p>
          <p className="m-0 text-xs leading-relaxed text-(--sea-ink-soft)">
            {p.body}
          </p>
        </div>
      ))}
    </div>
  )
}

function PostsSkeleton() {
  return (
    <div className="animate-pulse space-y-2">
      {[1, 2, 3].map((i) => (
        <div
          key={i}
          className="space-y-2 rounded-xl border border-(--line) p-4"
        >
          <div className="h-4 w-2/3 rounded bg-(--line)" />
          <div className="h-3 w-full rounded bg-(--line) opacity-60" />
        </div>
      ))}
    </div>
  )
}

const TABS = ['Home', 'Posts'] as const
type Tab = (typeof TABS)[number]

export default function ActivityPreRenderDemo() {
  const [active, setActive] = useState<Tab>('Home')

  return (
    <div className="space-y-3">
      <div className="flex gap-1">
        {TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => setActive(tab)}
            className={[
              'rounded-lg border px-4 py-1.5 text-sm font-semibold transition',
              active === tab
                ? 'border-(--lagoon-deep) bg-[rgba(79,184,178,0.18)] text-(--lagoon-deep)'
                : 'border-(--line) bg-(--surface) text-(--sea-ink-soft) hover:border-(--lagoon-deep)',
            ].join(' ')}
          >
            {tab}
          </button>
        ))}
      </div>

      <Activity mode={active === 'Home' ? 'visible' : 'hidden'}>
        <div className="rounded-xl border border-(--line) p-4">
          <p className="m-0 text-sm text-(--sea-ink)">
            Welcome to the Home tab. While you're here, the{' '}
            <strong>Posts tab is silently pre-rendering</strong> its data in the
            background at lower priority. Switch to it — it should appear
            instantly.
          </p>
        </div>
      </Activity>

      {/* Posts tab is hidden on first render, but still pre-renders its data */}
      <Activity mode={active === 'Posts' ? 'visible' : 'hidden'}>
        <Suspense fallback={<PostsSkeleton />}>
          <PostsList />
        </Suspense>
      </Activity>

      <p className="m-0 rounded-lg border border-teal-200 bg-teal-50/60 px-3 py-2 text-xs text-teal-700 dark:border-teal-800/40 dark:bg-teal-950/20 dark:text-teal-300">
        The Posts tab was pre-rendered in the background. Clicking it reveals
        data immediately rather than showing a loading skeleton.
      </p>
    </div>
  )
}
