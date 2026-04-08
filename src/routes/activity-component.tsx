import ActivityComponentPage from '@/app/activity-component'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/activity-component')({
  component: ActivityComponentPage,
})
