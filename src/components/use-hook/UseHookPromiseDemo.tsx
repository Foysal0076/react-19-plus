import { use, useState, Suspense, Component } from 'react'
import type { ReactNode } from 'react'

// ── Types ─────────────────────────────────────────────────────────────────────

type Post = {
  id: number
  title: string
  body: string
  tag: string
}

// ── Fake API ──────────────────────────────────────────────────────────────────

const MOCK_POSTS: Post[] = [
  {
    id: 1,
    title: 'React 19 use() changes data fetching',
    body: 'Pass a Promise as a prop and unwrap it with use(). The component suspends while pending — no useEffect, no loading state variables.',
    tag: 'api',
  },
  {
    id: 2,
    title: 'Server components stream Promises to clients',
    body: 'Create Promises in server components and pass them to client components. use() reads the resolved value, integrating seamlessly with Suspense.',
    tag: 'pattern',
  },
  {
    id: 3,
    title: 'Error Boundaries catch rejected Promises',
    body: 'If the Promise rejects, the nearest Error Boundary catches it. No try-catch inside your component — the boundary handles it declaratively.',
    tag: 'error handling',
  },
]

function fakeFetch(shouldFail: boolean): Promise<Post[]> {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (shouldFail) {
        reject(new Error('Network error: server returned 500.'))
      } else {
        resolve(MOCK_POSTS)
      }
    }, 1500)
  })
}

// ── Minimal Error Boundary ────────────────────────────────────────────────────

type EBProps = { children: ReactNode; fallback: ReactNode }
type EBState = { error: Error | null }

class ErrorBoundary extends Component<EBProps, EBState> {
  state: EBState = { error: null }

  static getDerivedStateFromError(error: Error): EBState {
    return { error }
  }

  render() {
    if (this.state.error) return this.props.fallback
    return this.props.children
  }
}

// ── Loading skeleton ──────────────────────────────────────────────────────────

function PostSkeleton() {
  return (
    <div className="animate-pulse space-y-2">
      {[1, 2, 3].map((i) => (
        <div
          key={i}
          className="space-y-2 rounded-xl border border-(--line) p-4"
        >
          <div className="h-4 w-2/3 rounded bg-(--line)" />
          <div className="h-3 w-full rounded bg-(--line) opacity-60" />
          <div className="h-3 w-4/5 rounded bg-(--line) opacity-40" />
        </div>
      ))}
    </div>
  )
}

// ── Consumer — suspends with use(promise) ─────────────────────────────────────

function PostList({ postsPromise }: { postsPromise: Promise<Post[]> }) {
  // use() unwraps the promise — component suspends until it resolves
  const posts = use(postsPromise)

  return (
    <div className="space-y-2">
      {posts.map((post) => (
        <div key={post.id} className="island-shell rounded-xl p-4">
          <div className="mb-1.5 flex items-start justify-between gap-2">
            <span className="text-sm font-semibold text-(--sea-ink)">
              {post.title}
            </span>
            <span className="shrink-0 rounded-full bg-[rgba(79,184,178,0.14)] px-2 py-0.5 text-xs font-medium text-(--lagoon-deep)">
              {post.tag}
            </span>
          </div>
          <p className="m-0 text-xs leading-relaxed text-(--sea-ink-soft)">
            {post.body}
          </p>
        </div>
      ))}
    </div>
  )
}

// ── Main demo component ───────────────────────────────────────────────────────

export default function UseHookPromiseDemo() {
  const [state, setState] = useState<{
    promise: Promise<Post[]>
    key: number
    mode: 'idle' | 'success' | 'fail'
  } | null>(null)

  function trigger(shouldFail: boolean) {
    setState((s) => ({
      promise: fakeFetch(shouldFail),
      key: (s?.key ?? 0) + 1,
      mode: shouldFail ? 'fail' : 'success',
    }))
  }

  return (
    <div className="space-y-4">
      {/* Trigger buttons */}
      <div className="flex flex-wrap gap-3">
        <button
          onClick={() => trigger(false)}
          className="rounded-lg border border-(--line) bg-(--surface) px-4 py-2 text-sm font-semibold text-(--sea-ink) transition hover:border-(--lagoon-deep) hover:text-(--lagoon-deep)"
        >
          Fetch posts (success)
        </button>
        <button
          onClick={() => trigger(true)}
          className="rounded-lg border border-red-200 bg-red-50/60 px-4 py-2 text-sm font-semibold text-red-600 transition hover:border-red-400 dark:border-red-800/40 dark:bg-red-950/20 dark:text-red-400"
        >
          Fetch posts (fail)
        </button>
      </div>

      {/* Initial prompt */}
      {!state && (
        <p className="text-sm text-(--sea-ink-soft)">
          Click a button. A <code>Promise</code> is created and passed to{' '}
          <code>PostList</code> as a prop. <code>use(promise)</code> inside{' '}
          <code>PostList</code> suspends the component while it's pending —{' '}
          <code>{'<Suspense>'}</code> shows the skeleton. When it resolves (or
          rejects), React re-renders.
        </p>
      )}

      {/* Suspense + ErrorBoundary shell */}
      {state && (
        <ErrorBoundary
          key={state.key}
          fallback={
            <div className="rounded-xl border border-red-200 bg-red-50/80 px-5 py-4 dark:border-red-800/40 dark:bg-red-950/20">
              <p className="m-0 text-sm font-semibold text-red-700 dark:text-red-300">
                ErrorBoundary caught the rejected Promise
              </p>
              <p className="m-0 mt-1 text-xs text-red-500">
                Network error: server returned 500.
              </p>
              <p className="m-0 mt-2 text-xs text-(--sea-ink-soft)">
                React propagated the rejection to the nearest Error Boundary —
                no try-catch needed inside the component.
              </p>
            </div>
          }
        >
          <Suspense fallback={<PostSkeleton />}>
            <PostList postsPromise={state.promise} />
          </Suspense>
        </ErrorBoundary>
      )}
    </div>
  )
}
