import { Link } from '@tanstack/react-router'

type Props = {
  href: string
  children: React.ReactNode
}
export default function LinkPill({ href, children }: Props) {
  return (
    <Link
      to={href}
      className="rounded-full border border-[rgba(50,143,151,0.3)] bg-[rgba(79,184,178,0.14)] px-5 py-2.5 text-sm font-semibold text-(--lagoon-deep) no-underline transition hover:-translate-y-0.5 hover:bg-[rgba(79,184,178,0.24)]"
    >
      {children}
    </Link>
  )
}
