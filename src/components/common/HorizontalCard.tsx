type Props = {
  onClick: () => void
  title: string
}

export default function HorizontalCard({ onClick, title }: Props) {
  return (
    <div
      onClick={onClick}
      className="island-shell feature-card rise-in rounded-2xl p-5 cursor-pointer"
    >
      {title}
    </div>
  )
}
