import ReactCompilerPage from '@/app/react-compiler'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/react-compiler')({
  component: ReactCompilerPage,
})
