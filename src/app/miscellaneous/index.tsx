import { useState } from 'react'
import PageNav from '@/components/miscellaneous/PageNav'

// ─── code snippets ─────────────────────────────────────────────────────────────

const codeOldMeta = `// ❌ Before React 19 — manipulate the DOM manually or use a library
import { useEffect } from 'react'

function ProductPage({ product }) {
  useEffect(() => {
    document.title = product.name

    const meta = document.createElement('meta')
    meta.name = 'description'
    meta.content = product.description
    document.head.appendChild(meta)

    return () => {
      document.head.removeChild(meta)
    }
  }, [product])
  // ...
}

// OR: install react-helmet / next/head and wrap everything`

const codeNewMeta = `// ✅ React 19 — render metadata tags right inside your component
function ProductPage({ product }) {
  return (
    <>
      <title>{product.name}</title>
      <meta name="description" content={product.description} />
      <meta name="keywords" content={product.tags.join(', ')} />
      <link rel="canonical" href={\`https://example.com/p/\${product.slug}\`} />

      <h1>{product.name}</h1>
      {/* rest of the page */}
    </>
  )
}
// React automatically hoists <title>, <meta>, <link> to <head>`

const codeTitle = `// <title> — set the document title from any component
function BlogPost({ post }) {
  return (
    <>
      <title>{post.title} · My Blog</title>
      <h1>{post.title}</h1>
    </>
  )
}

// ⚠️ Pitfall: only render ONE <title> at a time.
// Multiple <title> nodes in <head> = undefined browser behavior.`

const codeMeta = `// <meta> — document-level metadata
function SeoTags({ page }) {
  return (
    <>
      <meta name="description"  content={page.description} />
      <meta name="author"       content="Jane Smith" />
      <meta name="keywords"     content="React, JavaScript, UI" />
      <meta charset="utf-8" />
      <meta httpEquiv="X-UA-Compatible" content="IE=edge" />

      {/* itemProp stays in the DOM tree (no hoisting) */}
      <section itemScope>
        <meta itemProp="description" content="About this section" />
      </section>
    </>
  )
}`

const codeLink = `// <link> — related resources & stylesheets
function PageShell() {
  return (
    <>
      {/* favicon & canonical — hoisted to <head> */}
      <link rel="icon"      href="/favicon.ico" />
      <link rel="canonical" href="https://example.com/page" />

      {/* stylesheet with precedence — deduped & ordered by React */}
      <link
        rel="stylesheet"
        href="/themes/dark.css"
        precedence="theme"   {/* tells React the load order */}
      />

      {/* preload font */}
      <link rel="preload" href="/fonts/Inter.woff2" as="font" crossOrigin="anonymous" />
    </>
  )
}

// If two components render the same href, React deduplicates to one <link> node.`

// ─── live demo component ───────────────────────────────────────────────────────

function LiveMetaDemo() {
  const [enabled, setEnabled] = useState(false)
  const [keywords, setKeywords] = useState('React 19, metadata, demo')
  const [description, setDescription] = useState(
    'A live demo of React 19 document metadata support.',
  )

  return (
    <div className="space-y-5">
      {/* Conditionally render meta tags into <head> */}
      {enabled && (
        <>
          <meta name="keywords" content={keywords} />
          <meta name="description" content={description} />
          <title>Miscellaneous Updates</title>
        </>
      )}

      <div className="rounded-lg border border-(--line) bg-(--surface) p-4">
        <p className="mb-3 text-xs font-medium text-(--sea-ink-soft)">
          While these tags are active, inspect{' '}
          <code className="rounded bg-(--chip-bg) px-1 py-0.5 text-[11px]">
            &lt;head&gt;
          </code>{' '}
          in DevTools — you will see the{' '}
          <code className="rounded bg-(--chip-bg) px-1 py-0.5 text-[11px]">
            &lt;meta&gt;
          </code>{' '}
          nodes React injected.
        </p>
        <label className="flex cursor-pointer items-center gap-3">
          <div
            onClick={() => setEnabled((v) => !v)}
            className={`relative h-6 w-11 rounded-full transition-colors duration-200 ${enabled ? 'bg-(--lagoon)' : 'bg-(--line)'}`}
          >
            <span
              className={`absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform duration-200 ${enabled ? 'translate-x-5' : 'translate-x-0'}`}
            />
          </div>
          <span className="text-sm font-medium text-(--sea-ink)">
            {enabled ? 'Tags active — check DevTools' : 'Tags inactive'}
          </span>
          <span
            className={`rounded-full px-2 py-0.5 text-xs font-semibold ${enabled ? 'bg-teal-100 text-teal-700 dark:bg-teal-900/30 dark:text-teal-300' : 'bg-(--chip-bg) text-(--sea-ink-soft)'}`}
          >
            {enabled ? 'rendered in <head>' : 'not rendered'}
          </span>
        </label>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <label className="mb-1.5 block text-xs font-medium text-(--sea-ink-soft)">
            keywords content
          </label>
          <input
            value={keywords}
            onChange={(e) => setKeywords(e.target.value)}
            className="w-full rounded-lg border border-(--line) bg-(--surface) px-3 py-2 text-sm text-(--sea-ink) outline-none focus:border-(--lagoon) focus:ring-1 focus:ring-(--lagoon)"
          />
        </div>
        <div>
          <label className="mb-1.5 block text-xs font-medium text-(--sea-ink-soft)">
            description content
          </label>
          <input
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full rounded-lg border border-(--line) bg-(--surface) px-3 py-2 text-sm text-(--sea-ink) outline-none focus:border-(--lagoon) focus:ring-1 focus:ring-(--lagoon)"
          />
        </div>
      </div>

      {/* Show what would be rendered */}
      <div className="island-shell overflow-hidden rounded-xl">
        <div className="flex items-center gap-2 border-b border-(--line) px-4 py-2.5">
          <span
            className={`h-2 w-2 rounded-full ${enabled ? 'bg-(--lagoon)' : 'bg-(--line)'}`}
          />
          <span className="text-xs font-semibold uppercase tracking-widest text-(--sea-ink-soft)">
            Resulting HTML in &lt;head&gt;
          </span>
        </div>
        <pre
          className="m-0 overflow-x-auto p-4 text-xs leading-relaxed"
          style={{ background: '#1d2e45', color: '#e8efff', borderRadius: 0 }}
        >
          <code>
            {enabled
              ? `<meta name="keywords" content="${keywords}" />\n<meta name="description" content="${description}" />`
              : `{/* tags are not rendered — toggle to inject them */}`}
          </code>
        </pre>
      </div>
    </div>
  )
}

// ─── page ─────────────────────────────────────────────────────────────────────

export default function MiscellaneousPage() {
  return (
    <>
      <PageNav />

      <main className="page-wrap px-4 pb-16 pt-10">
        {/* ════════════════════════════════════════════════════════════════════
            § 1 — Overview / Hero
        ════════════════════════════════════════════════════════════════════ */}
        <section
          id="document-metadata"
          className="island-shell rise-in relative overflow-hidden rounded-4xl px-6 py-10 sm:px-10 sm:py-14"
        >
          <div className="pointer-events-none absolute -left-20 -top-24 h-56 w-56 rounded-full bg-[radial-gradient(circle,rgba(79,184,178,0.28),transparent_66%)]" />
          <div className="pointer-events-none absolute -bottom-16 -right-16 h-56 w-56 rounded-full bg-[radial-gradient(circle,rgba(47,106,74,0.16),transparent_66%)]" />
          <p className="island-kicker mb-3">React 19 · Miscellaneous</p>
          <h1 className="display-title mb-4 text-4xl font-bold leading-tight tracking-tight text-(--sea-ink) sm:text-5xl">
            Document Metadata
          </h1>
          <p className="mb-0 max-w-2xl text-base text-(--sea-ink-soft) sm:text-lg">
            React 19 lets you render{' '}
            <code className="text-(--lagoon-deep)">&lt;title&gt;</code>,{' '}
            <code className="text-(--lagoon-deep)">&lt;meta&gt;</code>, and{' '}
            <code className="text-(--lagoon-deep)">&lt;link&gt;</code> tags{' '}
            <strong className="text-(--sea-ink)">
              directly inside any component
            </strong>{' '}
            — React automatically hoists them to{' '}
            <code className="text-(--lagoon-deep)">&lt;head&gt;</code>. No more
            manual DOM manipulation, no more third-party helmet libraries.
          </p>
        </section>

        {/* 3-card intro */}
        <section className="mt-8 grid gap-4 sm:grid-cols-3">
          {[
            {
              kicker: 'The Problem',
              title: 'Metadata was a separate concern',
              body: 'Setting page titles and meta tags required useEffect + direct DOM manipulation, or a library like react-helmet / next/head. The logic was decoupled from the component that actually owned the data.',
            },
            {
              kicker: 'The Solution',
              title: 'Render metadata inside your component',
              body: 'React 19 treats <title>, <meta>, and <link> as first-class citizens. Render them anywhere in your tree — React hoists them to <head> automatically and cleans them up on unmount.',
            },
            {
              kicker: 'The Bonus',
              title: 'Deduplication and ordering built-in',
              body: 'Multiple components can render the same stylesheet link — React deduplicates it to a single DOM node. Stylesheet load order is controlled by the precedence prop, solving a classic cascade headache.',
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

        {/* Before / After code */}
        <section className="mt-14">
          <p className="island-kicker mb-2">Before vs After</p>
          <h2 className="display-title mb-1 text-2xl font-bold text-(--sea-ink) sm:text-3xl">
            No more boilerplate
          </h2>
          <p className="mb-6 text-sm text-(--sea-ink-soft)">
            Both snippets do the same thing. React 19 eliminates the ceremony.
          </p>
          <div className="grid gap-4 lg:grid-cols-2">
            <div className="island-shell flex flex-col overflow-hidden rounded-2xl">
              <div className="flex items-center gap-2 border-b border-(--line) px-5 py-3">
                <span className="h-2.5 w-2.5 rounded-full bg-orange-400" />
                <span className="text-xs font-semibold uppercase tracking-widest text-(--sea-ink-soft)">
                  Before React 19 — manual DOM / libraries
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
                <code>{codeOldMeta}</code>
              </pre>
            </div>
            <div className="island-shell flex flex-col overflow-hidden rounded-2xl">
              <div className="flex items-center gap-2 border-b border-(--line) px-5 py-3">
                <span className="h-2.5 w-2.5 rounded-full bg-(--lagoon)" />
                <span className="text-xs font-semibold uppercase tracking-widest text-(--sea-ink-soft)">
                  React 19 — render in JSX, React does the rest
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
                <code>{codeNewMeta}</code>
              </pre>
            </div>
          </div>
        </section>

        {/* ════════════════════════════════════════════════════════════════════
            § 2 — <meta>
        ════════════════════════════════════════════════════════════════════ */}
        <section id="meta-component" className="mt-20 scroll-mt-32">
          <p className="island-kicker mb-2">Component</p>
          <h2 className="display-title mb-1 text-2xl font-bold text-(--sea-ink) sm:text-3xl">
            <code className="text-(--lagoon-deep)">&lt;meta&gt;</code>
          </h2>
          <p className="mb-6 text-sm text-(--sea-ink-soft)">
            Attach keywords, descriptions, author info, charset, and
            http-equivalents. One exception: when <code>itemProp</code> is
            present, the tag stays in-place and is{' '}
            <strong className="text-(--sea-ink)">not</strong> hoisted.
          </p>

          <div className="island-shell flex flex-col overflow-hidden rounded-2xl">
            <div className="flex items-center gap-2 border-b border-(--line) px-5 py-3">
              <span className="h-2.5 w-2.5 rounded-full bg-(--lagoon)" />
              <span className="text-xs font-semibold uppercase tracking-widest text-(--sea-ink-soft)">
                Usage
              </span>
            </div>
            <pre
              className="m-0 overflow-x-auto p-5 text-xs leading-relaxed"
              style={{
                background: '#1d2e45',
                color: '#e8efff',
                borderRadius: 0,
              }}
            >
              <code>{codeMeta}</code>
            </pre>
          </div>

          {/* props table */}
          <div className="mt-4 island-shell overflow-hidden rounded-2xl">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-(--line)">
                    <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-widest text-(--sea-ink-soft)">
                      Prop
                    </th>
                    <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-widest text-(--sea-ink-soft)">
                      Type
                    </th>
                    <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-widest text-(--sea-ink-soft)">
                      Notes
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    [
                      'name',
                      'string',
                      'Kind of metadata (description, keywords, author…)',
                    ],
                    ['content', 'string', 'Value for name or httpEquiv'],
                    [
                      'charset',
                      'string',
                      'Must be "utf-8" — the only valid value',
                    ],
                    [
                      'httpEquiv',
                      'string',
                      'Processing directive (X-UA-Compatible, refresh…)',
                    ],
                    [
                      'itemProp',
                      'string',
                      'Schema.org annotation — NOT hoisted to <head>',
                    ],
                  ].map(([prop, type, notes]) => (
                    <tr
                      key={prop}
                      className="border-b border-(--line) last:border-0"
                    >
                      <td className="px-5 py-3 font-mono text-xs font-semibold text-(--lagoon-deep)">
                        {prop}
                      </td>
                      <td className="px-5 py-3 font-mono text-xs text-(--sea-ink-soft)">
                        {type}
                      </td>
                      <td className="px-5 py-3 text-xs text-(--sea-ink-soft)">
                        {notes}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* ════════════════════════════════════════════════════════════════════
            § 3 — <title>
        ════════════════════════════════════════════════════════════════════ */}
        <section id="title-component" className="mt-20 scroll-mt-32">
          <p className="island-kicker mb-2">Component</p>
          <h2 className="display-title mb-1 text-2xl font-bold text-(--sea-ink) sm:text-3xl">
            <code className="text-(--lagoon-deep)">&lt;title&gt;</code>
          </h2>
          <p className="mb-6 text-sm text-(--sea-ink-soft)">
            Set the browser tab title from any component in the tree. Accepts
            only text children — use template literals for dynamic values.
          </p>

          <div className="island-shell flex flex-col overflow-hidden rounded-2xl">
            <div className="flex items-center gap-2 border-b border-(--line) px-5 py-3">
              <span className="h-2.5 w-2.5 rounded-full bg-(--lagoon)" />
              <span className="text-xs font-semibold uppercase tracking-widest text-(--sea-ink-soft)">
                Usage
              </span>
            </div>
            <pre
              className="m-0 overflow-x-auto p-5 text-xs leading-relaxed"
              style={{
                background: '#1d2e45',
                color: '#e8efff',
                borderRadius: 0,
              }}
            >
              <code>{codeTitle}</code>
            </pre>
          </div>

          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {[
              {
                label: 'Children must be text',
                body: 'Only a single string (or number). Pass curly-brace expressions as a template literal — not as two separate children.',
                ok: true,
              },
              {
                label: 'One <title> at a time',
                body: 'Rendering more than one <title> simultaneously puts multiple nodes in <head>. Browser and search-engine behavior is undefined. Unmount the old one first.',
                ok: false,
              },
            ].map(({ label, body, ok }) => (
              <div
                key={label}
                className={`island-shell rounded-2xl p-5 ${ok ? '' : 'border-orange-300/30 dark:border-orange-700/30'}`}
              >
                <p
                  className={`island-kicker mb-2 ${ok ? '' : 'text-orange-500'}`}
                >
                  {ok ? '✅ Rule' : '⚠️ Pitfall'}
                </p>
                <p className="mb-1 text-sm font-semibold text-(--sea-ink)">
                  {label}
                </p>
                <p className="m-0 text-xs leading-relaxed text-(--sea-ink-soft)">
                  {body}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* ════════════════════════════════════════════════════════════════════
            § 4 — <link>
        ════════════════════════════════════════════════════════════════════ */}
        <section id="link-component" className="mt-20 scroll-mt-32">
          <p className="island-kicker mb-2">Component</p>
          <h2 className="display-title mb-1 text-2xl font-bold text-(--sea-ink) sm:text-3xl">
            <code className="text-(--lagoon-deep)">&lt;link&gt;</code>
          </h2>
          <p className="mb-6 text-sm text-(--sea-ink-soft)">
            Connect external resources — stylesheets, fonts, favicons, canonical
            URLs, preloads. Stylesheets get extra treatment: React{' '}
            <strong className="text-(--sea-ink)">deduplicates</strong> same-href
            links and lets you control load order via the{' '}
            <code>precedence</code> prop.
          </p>

          <div className="island-shell flex flex-col overflow-hidden rounded-2xl">
            <div className="flex items-center gap-2 border-b border-(--line) px-5 py-3">
              <span className="h-2.5 w-2.5 rounded-full bg-(--lagoon)" />
              <span className="text-xs font-semibold uppercase tracking-widest text-(--sea-ink-soft)">
                Usage
              </span>
            </div>
            <pre
              className="m-0 overflow-x-auto p-5 text-xs leading-relaxed"
              style={{
                background: '#1d2e45',
                color: '#e8efff',
                borderRadius: 0,
              }}
            >
              <code>{codeLink}</code>
            </pre>
          </div>

          {/* stylesheet behaviours */}
          <div className="mt-4 island-shell overflow-hidden rounded-2xl">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-(--line)">
                    <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-widest text-(--sea-ink-soft)">
                      Behaviour
                    </th>
                    <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-widest text-(--sea-ink-soft)">
                      When
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    [
                      'Hoisted to <head>',
                      'All <link> tags (except itemProp, onLoad, onError)',
                    ],
                    [
                      'Stylesheet deduplication',
                      'rel="stylesheet" with same href — only one DOM node',
                    ],
                    [
                      'Suspense integration',
                      'Component suspends while the stylesheet loads',
                    ],
                    [
                      'Precedence ordering',
                      'rel="stylesheet" + precedence prop controls load order',
                    ],
                    [
                      'Stays in-place',
                      'itemProp set, or onLoad / onError handlers present',
                    ],
                  ].map(([behaviour, when]) => (
                    <tr
                      key={behaviour}
                      className="border-b border-(--line) last:border-0"
                    >
                      <td className="px-5 py-3 text-xs font-semibold text-(--sea-ink)">
                        {behaviour}
                      </td>
                      <td className="px-5 py-3 text-xs text-(--sea-ink-soft)">
                        {when}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* ════════════════════════════════════════════════════════════════════
            § 5 — Live demo
        ════════════════════════════════════════════════════════════════════ */}
        <section id="live-demo" className="mt-20 scroll-mt-32">
          <p className="island-kicker mb-2">Live Demo</p>
          <h2 className="display-title mb-1 text-2xl font-bold text-(--sea-ink) sm:text-3xl">
            Watch tags land in{' '}
            <code className="text-(--lagoon-deep)">&lt;head&gt;</code>
          </h2>
          <p className="mb-6 text-sm text-(--sea-ink-soft)">
            Toggle the switch to inject real <code>&lt;meta&gt;</code> nodes
            into the document head. Edit the content values and verify in
            DevTools.
          </p>

          <div className="island-shell overflow-hidden rounded-2xl">
            <div className="flex items-center gap-2 border-b border-(--line) bg-teal-50/40 px-5 py-3 dark:bg-teal-950/10">
              <span className="h-2.5 w-2.5 rounded-full bg-(--lagoon)" />
              <span className="text-xs font-semibold uppercase tracking-widest text-(--lagoon-deep)">
                React 19 document metadata — live
              </span>
            </div>
            <div className="p-5">
              <LiveMetaDemo />
            </div>
          </div>
        </section>
      </main>
    </>
  )
}
