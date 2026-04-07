import HorizontalCard from '@/components/common/HorizontalCard'
import { expensiveProcessing } from '@/lib/helpers'
import { useMemo, useCallback, memo } from 'react'

type Props = {
  data: number
  onClick: (id: number) => void
}

const ExpensiveComponent = memo(function ExpensiveComponent({
  data,
  onClick,
}: Props) {
  const processedData = useMemo(() => {
    return expensiveProcessing(data)
  }, [data])

  const handleClick = useCallback(
    (item: { id: number; title: string }) => {
      onClick(item.id)
    },
    [onClick],
  )

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
})

export default ExpensiveComponent
