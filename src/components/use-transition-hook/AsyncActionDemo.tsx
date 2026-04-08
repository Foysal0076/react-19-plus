import { useState, useTransition } from 'react'

// ── fake server ───────────────────────────────────────────────────────────────

function fakePostComment(text: string): Promise<string> {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (text.toLowerCase().includes('fail')) {
        reject(new Error('Server rejected the comment'))
      } else {
        resolve('Comment posted successfully!')
      }
    }, 1500)
  })
}

// ── demo ─────────────────────────────────────────────────────────────────────

export default function AsyncActionDemo() {
  const [comment, setComment] = useState('')
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [statusMsg, setStatusMsg] = useState('')
  const [isPending, startTransition] = useTransition()

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setStatus('idle')
    startTransition(async () => {
      try {
        const msg = await fakePostComment(comment)
        startTransition(() => {
          setStatus('success')
          setStatusMsg(msg)
          setComment('')
        })
      } catch (err) {
        startTransition(() => {
          setStatus('error')
          setStatusMsg(err instanceof Error ? err.message : 'Unknown error')
        })
      }
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div>
        <label className="mb-1.5 block text-xs font-medium text-(--sea-ink-soft)">
          Add a comment{' '}
          <span className="text-(--sea-ink-soft)/60">
            (type "fail" to trigger an error)
          </span>
        </label>
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          disabled={isPending}
          rows={3}
          placeholder="Write something…"
          className="w-full resize-none rounded-lg border border-(--line) bg-(--surface) px-3 py-2 text-sm text-(--sea-ink) outline-none focus:border-(--lagoon) focus:ring-1 focus:ring-(--lagoon) disabled:opacity-50"
        />
      </div>

      {status === 'success' && (
        <p className="rounded-lg bg-teal-50 px-3 py-2 text-xs font-medium text-teal-700 dark:bg-teal-950/30 dark:text-teal-300">
          ✅ {statusMsg}
        </p>
      )}
      {status === 'error' && (
        <p className="rounded-lg bg-rose-50 px-3 py-2 text-xs font-medium text-rose-700 dark:bg-rose-950/30 dark:text-rose-300">
          ❌ {statusMsg}
        </p>
      )}

      <div className="flex items-center gap-3">
        <button
          type="submit"
          disabled={isPending || !comment.trim()}
          className="inline-flex items-center gap-2 rounded-lg bg-(--lagoon) px-4 py-2 text-sm font-semibold text-white transition-opacity disabled:opacity-50"
        >
          {isPending && (
            <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white border-t-transparent" />
          )}
          {isPending ? 'Posting…' : 'Post comment'}
        </button>
        <p className="text-xs text-(--sea-ink-soft)">
          <code className="rounded bg-(--chip-bg) px-1 py-0.5 text-[11px]">
            isPending
          </code>{' '}
          ={' '}
          <code
            className={`rounded px-1 py-0.5 text-[11px] font-semibold ${isPending ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300' : 'bg-teal-100 text-teal-700 dark:bg-teal-900/30 dark:text-teal-300'}`}
          >
            {String(isPending)}
          </code>
        </p>
      </div>

      <p className="text-xs text-(--sea-ink-soft)">
        While the action is pending, try scrolling or clicking elsewhere — the
        page remains fully interactive.
      </p>
    </form>
  )
}
