import { Pencil, Trash2, GripVertical } from 'lucide-react'
import { useLanguage } from '@/hooks/useLanguage'

interface Column<T> {
  key: string
  header: string
  render: (item: T) => React.ReactNode
  className?: string
}

interface DataTableProps<T> {
  columns: Column<T>[]
  data: T[]
  onEdit?: (item: T) => void
  onDelete?: (item: T) => void
  onReorder?: boolean
  isLoading?: boolean
  emptyMessage?: string
  emptyAction?: { label: string; onClick: () => void }
}

export default function DataTable<T>({
  columns, data, onEdit, onDelete, isLoading,
  emptyMessage, emptyAction,
}: DataTableProps<T>) {
  const { language } = useLanguage()

  if (isLoading) {
    return (
      <div className="text-center py-12 text-sm text-muted-foreground font-mono">
        {language === 'ar' ? 'جاري التحميل...' : 'Loading...'}
      </div>
    )
  }

  if (data.length === 0) {
    return (
      <div className="text-center py-16">
        <p className="text-sm text-muted-foreground font-mono mb-4">
          {emptyMessage ?? (language === 'ar' ? 'لا توجد بيانات' : 'No data')}
        </p>
        {emptyAction && (
          <button onClick={emptyAction.onClick} className="btn-emerald text-sm py-2 px-4">
            {emptyAction.label}
          </button>
        )}
      </div>
    )
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border">
            {onEdit || onDelete ? (
              <th className="text-left py-3 pr-2 w-10">
                <GripVertical className="w-3.5 h-3.5 text-muted-foreground/40" />
              </th>
            ) : null}
            {columns.map(col => (
              <th key={col.key} className={`text-left py-3 font-mono text-xs font-semibold text-muted-foreground uppercase tracking-wider ${col.className ?? ''}`}>
                {col.header}
              </th>
            ))}
            {(onEdit || onDelete) ? (
              <th className="text-right py-3 w-24" />
            ) : null}
          </tr>
        </thead>
        <tbody>
          {data.map((item, i) => (
            <tr key={i} className="border-b border-border/40 hover:bg-muted/30 transition-colors">
              {onEdit || onDelete ? (
                <td className="py-3 pr-2">
                  <GripVertical className="w-3.5 h-3.5 text-muted-foreground/20 cursor-grab" />
                </td>
              ) : null}
              {columns.map(col => (
                <td key={col.key} className={`py-3 ${col.className ?? ''}`}>
                  {col.render(item)}
                </td>
              ))}
              {(onEdit || onDelete) ? (
                <td className="py-3 text-right">
                  <div className="flex items-center gap-1 justify-end">
                    {onEdit && (
                      <button onClick={() => onEdit(item)} className="p-1.5 hover:bg-muted rounded-sm transition-colors" title="Edit">
                        <Pencil className="w-3.5 h-3.5 text-muted-foreground/60 hover:text-emerald-brand" />
                      </button>
                    )}
                    {onDelete && (
                      <button onClick={() => onDelete(item)} className="p-1.5 hover:bg-red-50 rounded-sm transition-colors" title="Delete">
                        <Trash2 className="w-3.5 h-3.5 text-muted-foreground/60 hover:text-red-500" />
                      </button>
                    )}
                  </div>
                </td>
              ) : null}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
