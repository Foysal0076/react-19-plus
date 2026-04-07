import DeathOfForwardRef from '@/app/death-of-forward-ref'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/death-of-forward-ref')({
  component: DeathOfForwardRef,
})