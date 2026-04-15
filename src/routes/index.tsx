import LinkPill from '@/components/common/LinkPill'
import { TOPICS } from '@/lib/topics'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/')({ component: App })

function App() {
  return (
    <main className="page-wrap px-4 pb-8 pt-14">
      <section className="island-shell rise-in relative overflow-hidden rounded-4xl px-6 py-10 sm:px-10 sm:py-14">
        <div className="pointer-events-none absolute -left-20 -top-24 h-56 w-56 rounded-full bg-[radial-gradient(circle,rgba(79,184,178,0.32),transparent_66%)]" />
        <div className="pointer-events-none absolute -bottom-20 -right-20 h-56 w-56 rounded-full bg-[radial-gradient(circle,rgba(47,106,74,0.18),transparent_66%)]" />
        <p className="island-kicker mb-3">React 19+</p>
        <h1 className="display-title mb-5 max-w-3xl text-4xl leading-[1.02] font-bold tracking-tight text-(--sea-ink) sm:text-6xl">
          The End of Boilerplate
        </h1>
        <p className="mb-8 max-w-2xl text-base text-(--sea-ink-soft) sm:text-lg">
          To demonstrate how React 19 (and subsequent 19.2 refinements)
          simplifies everyday React development, replaces complex hooks with
          native features, and improves overall developer experience.
        </p>
        <div className="flex flex-wrap gap-3">
          {TOPICS.map((topic) => (
            <LinkPill key={topic.href} href={topic.href}>
              {topic.pill}
            </LinkPill>
          ))}
        </div>
      </section>

      <section className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {TOPICS.map((topic, index) => (
          <article
            key={topic.href}
            className="island-shell feature-card rise-in rounded-2xl p-5"
            style={{ animationDelay: `${index * 90 + 80}ms` }}
          >
            <h2 className="mb-2 text-base font-semibold text-(--sea-ink)">
              {topic.label}
            </h2>
            <p className="m-0 text-sm text-(--sea-ink-soft)">
              {topic.description}
            </p>
          </article>
        ))}
      </section>
    </main>
  )
}
