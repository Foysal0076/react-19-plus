import UseHookPage from '@/app/use-hook'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/use-hook')({
  component: UseHookPage,
})
