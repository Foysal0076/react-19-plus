type Props = React.InputHTMLAttributes<HTMLInputElement> & {
  label?: string
  ref?: React.Ref<HTMLInputElement>
}

export default function ForwardRefNewWay({ label, ref, ...props }: Props) {
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label className="text-xs font-semibold text-(--sea-ink-soft) uppercase tracking-wide">
          {label}
        </label>
      )}
      <input
        ref={ref}
        {...props}
        className="rounded-xl border border-(--line) bg-(--surface) px-4 py-2.5 text-sm text-(--sea-ink) outline-none transition focus:border-(--lagoon-deep) focus:ring-2 focus:ring-[rgba(79,184,178,0.2)]"
      />
    </div>
  )
}
