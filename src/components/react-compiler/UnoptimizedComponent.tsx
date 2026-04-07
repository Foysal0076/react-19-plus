import HorizontalCard from '@/components/common/HorizontalCard'
import { expensiveProcessing } from '@/lib/helpers'

type Props = {
  data: number
  onClick: (id: number) => void
}

export default function UnoptimizedComponent({ data, onClick }: Props) {
  'use no memo'
  const processedData = expensiveProcessing(data)

  const handleClick = (item: { id: number; title: string }) => {
    onClick(item.id)
  }

  return (
    <div className="flex gap-2 items-center flex-wrap">
      {processedData.map((item) => (
        <HorizontalCard
          key={item.id}
          title={item.title}
          onClick={() => handleClick(item)}
        />
      ))}
    </div>
  )
}
