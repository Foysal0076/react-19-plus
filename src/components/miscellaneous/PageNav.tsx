import { useEffect, useRef, useState } from 'react'

// ─── section definitions ──────────────────────────────────────────────────────

export const MISC_SECTIONS = [
  { id: 'document-metadata', label: 'Document Metadata' },
  { id: 'meta-component', label: '<meta>' },
  { id: 'title-component', label: '<title>' },
  { id: 'link-component', label: '<link>' },
  { id: 'live-demo', label: 'Live Demo' },
] as const

export type SectionId = (typeof MISC_SECTIONS)[number]['id']

// ─── hook ─────────────────────────────────────────────────────────────────────

function useActiveSection(ids: readonly string[]) {
  const [activeId, setActiveId] = useState<string>(ids[0])

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        // pick the topmost intersecting entry
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)
        if (visible.length > 0) setActiveId(visible[0].target.id)
      },
      { rootMargin: '-10% 0px -60% 0px', threshold: 0 },
    )

    ids.forEach((id) => {
      const el = document.getElementById(id)
      if (el) observer.observe(el)
    })

    return () => observer.disconnect()
  }, [ids])

  return activeId
}

// ─── component ───────────────────────────────────────────────────────────────

export default function PageNav() {
  const ids = MISC_SECTIONS.map((s) => s.id)
  const activeId = useActiveSection(ids)
  const navRef = useRef<HTMLDivElement>(null)

  function scrollTo(id: string) {
    const el = document.getElementById(id)
    if (!el) return
    // offset for sticky header (~57px) + sticky nav (~49px)
    const top = el.getBoundingClientRect().top + window.scrollY - 120
    window.scrollTo({ top, behavior: 'smooth' })
  }

  return (
    <div
      ref={navRef}
      className="sticky top-17.75 z-40 border-b border-(--line) bg-(--header-bg)/90 backdrop-blur-md"
    >
      <div className="page-wrap px-4">
        <nav className="flex items-center gap-1 overflow-x-auto py-2 sm:gap-2">
          {MISC_SECTIONS.map(({ id, label }) => {
            const isActive = activeId === id
            return (
              <button
                key={id}
                onClick={() => scrollTo(id)}
                className={`inline-flex shrink-0 items-center gap-0.5 rounded-full px-3 py-1.5 text-xs font-semibold transition-all duration-200 ${
                  isActive
                    ? 'bg-(--lagoon) text-white shadow-md shadow-(--lagoon)/30'
                    : 'text-(--sea-ink-soft) hover:bg-(--surface-strong) hover:text-(--sea-ink)'
                }`}
              >
                {label.startsWith('<') ? (
                  <code
                    className={`text-[11px] ${isActive ? 'text-white' : 'text-(--lagoon-deep)'}`}
                  >
                    {label}
                  </code>
                ) : (
                  label
                )}
              </button>
            )
          })}
        </nav>
      </div>
    </div>
  )
}
