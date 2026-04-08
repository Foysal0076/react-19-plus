import UseEffectHookPage from '@/app/use-effect-hook'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/use-effect-hook')({
  component: UseEffectHookPage,
})
