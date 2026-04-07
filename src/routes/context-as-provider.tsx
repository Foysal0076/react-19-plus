import ContextAsProvider from '@/app/context-as-provider'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/context-as-provider')({
  component: ContextAsProvider,
})
