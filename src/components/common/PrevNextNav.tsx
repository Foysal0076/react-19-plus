import { Link } from '@tanstack/react-router'
import { TOPICS } from '@/lib/topics'

type Props = {
  currentHref: string
}

export default function PrevNextNav({ currentHref }: Props) {
  const idx = TOPICS.findIndex((t) => t.href === currentHref)
  const prev = idx > 0 ? TOPICS[idx - 1] : null
  const next = idx < TOPICS.length - 1 ? TOPICS[idx + 1] : null

  if (!prev && !next) return null

  return (
    <nav className="mt-16 border-t border-(--line) pt-8">
      <div className="flex items-stretch justify-between gap-4">
        {/* Previous */}
        {prev ? (
          <Link
            to={prev.href}
            className="group flex min-w-0 flex-1 items-center gap-3 rounded-2xl border border-(--line) bg-(--surface) px-5 py-4 text-left no-underline transition hover:border-(--lagoon)/50 hover:bg-(--surface-strong)"
          >
            {/* Arrow */}
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-(--line) bg-(--chip-bg) text-(--sea-ink-soft) transition group-hover:border-(--lagoon) group-hover:bg-(--lagoon) group-hover:text-white">
              <svg
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                aria-hidden="true"
              >
                <path
                  d="M10 3L5 8L10 13"
                  stroke="currentColor"
                  strokeWidth="1.75"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </span>
            <span className="min-w-0">
              <span className="block text-xs font-medium text-(--sea-ink-soft) transition group-hover:text-(--lagoon-deep)">
                Previous
              </span>
              <span className="block truncate text-sm font-semibold text-(--sea-ink)">
                {prev.label}
              </span>
            </span>
          </Link>
        ) : (
          <div className="flex-1" />
        )}

        {/* Next */}
        {next ? (
          <Link
            to={next.href}
            className="group flex min-w-0 flex-1 items-center justify-end gap-3 rounded-2xl border border-(--line) bg-(--surface) px-5 py-4 text-right no-underline transition hover:border-(--lagoon)/50 hover:bg-(--surface-strong)"
          >
            <span className="min-w-0">
              <span className="block text-xs font-medium text-(--sea-ink-soft) transition group-hover:text-(--lagoon-deep)">
                Next
              </span>
              <span className="block truncate text-sm font-semibold text-(--sea-ink)">
                {next.label}
              </span>
            </span>
            {/* Arrow */}
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-(--line) bg-(--chip-bg) text-(--sea-ink-soft) transition group-hover:border-(--lagoon) group-hover:bg-(--lagoon) group-hover:text-white">
              <svg
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                aria-hidden="true"
              >
                <path
                  d="M6 3L11 8L6 13"
                  stroke="currentColor"
                  strokeWidth="1.75"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </span>
          </Link>
        ) : (
          <div className="flex-1" />
        )}
      </div>
    </nav>
  )
}
