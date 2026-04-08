import LinkPill from '@/components/common/LinkPill'
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
          <LinkPill href="/react-compiler">React Compiler</LinkPill>
          <LinkPill href="/death-of-forward-ref">
            The death of <code>forwardRef</code>
          </LinkPill>
          <LinkPill href="/context-as-provider">Context as a Provider</LinkPill>
          <LinkPill href="/use-hook">
            {' '}
            <code>use()</code>{' '}
          </LinkPill>
          <LinkPill href="/use">Native Asset Preloading</LinkPill>
          <LinkPill href="/use">
            <code>{'<Activity/>'}</code>
          </LinkPill>
          <LinkPill href="/use">
            <code>useTransition</code>
          </LinkPill>
          <LinkPill href="/use">
            The way of <code>useEffect</code>
          </LinkPill>
        </div>
      </section>

      <section className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          [
            'Type-Safe Routing',
            'Routes and links stay in sync across every page.',
          ],
          [
            'Server Functions',
            'Call server code from your UI without creating API boilerplate.',
          ],
          [
            'Streaming by Default',
            'Ship progressively rendered responses for faster experiences.',
          ],
          [
            'Tailwind Native',
            'Design quickly with utility-first styling and reusable tokens.',
          ],
        ].map(([title, desc], index) => (
          <article
            key={title}
            className="island-shell feature-card rise-in rounded-2xl p-5"
            style={{ animationDelay: `${index * 90 + 80}ms` }}
          >
            <h2 className="mb-2 text-base font-semibold text-[var(--sea-ink)]">
              {title}
            </h2>
            <p className="m-0 text-sm text-[var(--sea-ink-soft)]">{desc}</p>
          </article>
        ))}
      </section>

      {/* <section className="island-shell mt-8 rounded-2xl p-6">
        <p className="island-kicker mb-2">Quick Start</p>
        <ul className="m-0 list-disc space-y-2 pl-5 text-sm text-[var(--sea-ink-soft)]">
          <li>
            Edit <code>src/routes/index.tsx</code> to customize the home page.
          </li>
          <li>
            Update <code>src/components/Header.tsx</code> and{' '}
            <code>src/components/Footer.tsx</code> for brand links.
          </li>
          <li>
            Add routes in <code>src/routes</code> and tweak visual tokens in{' '}
            <code>src/styles.css</code>.
          </li>
        </ul>
      </section> */}
    </main>
  )
}
