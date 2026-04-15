import MiscellaneousPage from '@/app/miscellaneous'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/miscellaneous')({
  component: MiscellaneousPage,
})
