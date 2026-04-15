import { useEffect, useState } from 'react'

export default function HiddenUseEffect() {
  const [count, setCount] = useState(0)

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>

    const timeout = setTimeout(() => {
      interval = setInterval(() => {
        setCount((prev) => prev + 1)
      }, 1000)
    }, 1000)

    return () => {
      clearTimeout(timeout)
      clearInterval(interval)
    }
  }, [])

  return (
    <div className="overflow-hidden rounded-xl border border-[rgba(255,255,255,0.08)] bg-[#1d2e45] font-mono text-sm shadow-inner">
      {/* title bar */}
      <div className="flex items-center gap-2 border-b border-[rgba(255,255,255,0.07)] px-4 py-2.5">
        <span className="h-2.5 w-2.5 rounded-full bg-red-400/70" />
        <span className="h-2.5 w-2.5 rounded-full bg-yellow-400/70" />
        <span className="h-2.5 w-2.5 rounded-full bg-green-400/70" />
        <span className="ml-2 text-xs text-[#6b8caa]">useEffect counter</span>
      </div>
      {/* console body */}
      <div className="space-y-1 px-4 py-4">
        <p className="m-0 text-[#6b8caa]">
          <span className="text-[#4fb8b2]">$</span> watching interval...
        </p>
        <p className="m-0 text-[#e8efff]">
          <span className="text-[#8de5db]">count</span>
          <span className="text-[#6b8caa]">{' → '}</span>
          <span className="text-[#f4b860]">{count}</span>
        </p>
      </div>
    </div>
  )
}
