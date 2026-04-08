import { Link } from '@tanstack/react-router'

export default function NotFound() {
  return (
    <main className="page-wrap flex flex-1 items-center px-4 py-20">
      <div className="island-shell rise-in relative w-full overflow-hidden rounded-4xl px-6 py-16 text-center sm:px-10 sm:py-24">
        {/* Ambient blobs */}
        <div className="pointer-events-none absolute -left-24 -top-24 h-64 w-64 rounded-full bg-[radial-gradient(circle,rgba(79,184,178,0.28),transparent_64%)]" />
        <div className="pointer-events-none absolute -bottom-24 -right-24 h-64 w-64 rounded-full bg-[radial-gradient(circle,rgba(47,106,74,0.18),transparent_64%)]" />

        <p className="island-kicker mb-4">404 — Page not found</p>

        <h1 className="display-title mb-6 text-[clamp(5rem,20vw,11rem)] leading-none font-bold tracking-tight text-(--sea-ink) opacity-10 select-none">
          404
        </h1>

        <h2 className="display-title -mt-4 mb-4 text-3xl font-bold tracking-tight text-(--sea-ink) sm:text-5xl">
          Lost at Sea
        </h2>

        <p className="mx-auto mb-10 max-w-md text-base text-(--sea-ink-soft) sm:text-lg">
          The page you're looking for has drifted off. It may have been moved,
          deleted, or never existed.
        </p>

        <Link
          to="/"
          className="inline-flex items-center gap-2 rounded-full border border-[rgba(50,143,151,0.3)] bg-[rgba(79,184,178,0.14)] px-6 py-3 text-sm font-semibold text-(--lagoon-deep) no-underline transition hover:-translate-y-0.5 hover:bg-[rgba(79,184,178,0.24)]"
        >
          <span className="h-2 w-2 rounded-full bg-[linear-gradient(90deg,#56c6be,#7ed3bf)]" />
          Back to Home
        </Link>
      </div>
    </main>
  )
}
