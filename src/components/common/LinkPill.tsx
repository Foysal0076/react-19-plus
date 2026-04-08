import { cn } from '@/lib/utils'
import { Link } from '@tanstack/react-router'

type Props = {
  className?: string
  href: string
  children: React.ReactNode
}
export default function LinkPill({ href, children, className }: Props) {
  return (
    <Link
      to={href}
      className={cn(
        'rounded-full border border-[rgba(50,143,151,0.3)] bg-[rgba(79,184,178,0.14)] px-5 py-2.5 text-sm font-semibold text-(--lagoon-deep) no-underline transition hover:-translate-y-0.5 hover:bg-[rgba(79,184,178,0.24)]',
        className,
      )}
    >
      {children}
    </Link>
  )
}
