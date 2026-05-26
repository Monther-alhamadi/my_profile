import { Inbox } from 'lucide-react'

interface EmptyStateProps {
  message?: string
  action?: { label: string; onClick: () => void }
}

export default function EmptyState({ message, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <Inbox className="w-10 h-10 text-muted-foreground/20 mb-4" />
      <p className="text-sm text-muted-foreground font-mono">
        {message ?? 'No data'}
      </p>
      {action && (
        <button onClick={action.onClick} className="btn-emerald text-sm py-2 px-4 mt-4">
          {action.label}
        </button>
      )}
    </div>
  )
}
