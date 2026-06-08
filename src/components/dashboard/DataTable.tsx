import { useState, useMemo } from 'react'
import { Pencil, Trash2, GripVertical, Search, X, Download, Trash } from 'lucide-react'
import { DndContext, closestCenter, PointerSensor, useSensor, useSensors } from '@dnd-kit/core'
import type { DragEndEvent } from '@dnd-kit/core'
import { SortableContext, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
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
  onBulkDelete?: (items: T[]) => void
  onReorder?: (sortedIds: string[]) => void
  onExport?: (data: T[]) => void
  isLoading?: boolean
  emptyMessage?: string
  emptyAction?: { label: string; onClick: () => void }
  searchPlaceholder?: string
  getId?: (item: T) => string
  exportFileName?: string
}

function getTextContent(node: React.ReactNode): string {
  if (node == null || typeof node === 'boolean') return ''
  if (typeof node === 'string' || typeof node === 'number') return String(node)
  if (Array.isArray(node)) return node.map(getTextContent).join(' ')
  if (typeof node === 'object' && 'props' in node) return getTextContent((node as React.ReactElement).props.children)
  return ''
}

function defaultExport<T>(data: T[], filename: string) {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `${filename}-${new Date().toISOString().slice(0, 10)}.json`
  a.click()
  URL.revokeObjectURL(url)
}

export default function DataTable<T>({
  columns, data, onEdit, onDelete, onBulkDelete, onReorder, onExport, isLoading,
  emptyMessage, emptyAction, searchPlaceholder, getId, exportFileName = 'export',
}: DataTableProps<T>) {
  const { language } = useLanguage()
  const [search, setSearch] = useState('')
  const [selected, setSelected] = useState<Set<string>>(new Set())

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 8 } }))

  const filtered = useMemo(() => {
    if (!search.trim()) return data
    const q = search.toLowerCase()
    return data.filter(item =>
      columns.some(col => getTextContent(col.render(item)).toLowerCase().includes(q))
    )
  }, [data, search, columns])

  const items = useMemo(() => filtered.map(item => getId ? getId(item) : String(data.indexOf(item))), [filtered, getId, data])

  const handleDragEnd = (event: DragEndEvent) => {
    if (!onReorder || !getId) return
    const { active, over } = event
    if (!over || active.id === over.id) return
    const oldIndex = data.findIndex(item => getId(item) === String(active.id))
    const newIndex = data.findIndex(item => getId(item) === String(over.id))
    if (oldIndex === -1 || newIndex === -1) return
    const reordered = [...data]
    const [moved] = reordered.splice(oldIndex, 1)
    reordered.splice(newIndex, 0, moved)
    onReorder(reordered.map(item => getId(item)))
  }

  const toggleSelect = (id: string) => {
    setSelected(prev => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const toggleSelectAll = () => {
    if (selected.size === filtered.length) {
      setSelected(new Set())
    } else {
      setSelected(new Set(filtered.map(item => getId ? getId(item) : String(data.indexOf(item)))))
    }
  }

  const handleBulkDelete = () => {
    if (!onBulkDelete) return
    const selectedItems = data.filter(item => {
      const id = getId ? getId(item) : String(data.indexOf(item))
      return selected.has(id)
    })
    onBulkDelete(selectedItems)
    setSelected(new Set())
  }

  const handleExport = () => {
    if (onExport) {
      onExport(data)
    } else {
      defaultExport(data, exportFileName)
    }
  }

  const hasSelection = selected.size > 0

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

  const tableContent = (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border">
            {onEdit || onDelete ? (
              <th className="text-left py-3 pr-2 w-10">
                {onBulkDelete ? (
                  <input
                    type="checkbox"
                    checked={selected.size === filtered.length && filtered.length > 0}
                    onChange={toggleSelectAll}
                    className="w-3.5 h-3.5 accent-emerald-600 cursor-pointer"
                  />
                ) : (
                  <GripVertical className="w-3.5 h-3.5 text-muted-foreground/40" />
                )}
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
          {filtered.length === 0 ? (
            <tr>
              <td colSpan={columns.length + 2} className="text-center py-8 text-sm text-muted-foreground font-mono">
                {language === 'ar' ? 'لا توجد نتائج' : 'No results'}
              </td>
            </tr>
          ) : (
            filtered.map((item, i) => {
              const itemId = getId ? getId(item) : String(i)
              return (
                <tr key={itemId} className={`border-b border-border/40 hover:bg-muted/30 transition-colors ${selected.has(itemId) ? 'bg-emerald-50/50' : ''}`}>
                  {onEdit || onDelete ? (
                    <td className="py-3 pr-2">
                      {onBulkDelete ? (
                        <input
                          type="checkbox"
                          checked={selected.has(itemId)}
                          onChange={() => toggleSelect(itemId)}
                          className="w-3.5 h-3.5 accent-emerald-600 cursor-pointer"
                        />
                      ) : (
                        <GripVertical className="w-3.5 h-3.5 text-muted-foreground/20 cursor-grab" />
                      )}
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
                          <button onClick={() => onEdit(item)} className="p-2 hover:bg-muted rounded-sm transition-colors" title="Edit">
                            <Pencil className="w-4 h-4 text-muted-foreground/60 hover:text-emerald-brand" />
                          </button>
                        )}
                        {onDelete && (
                          <button onClick={() => onDelete(item)} className="p-2 hover:bg-red-50 rounded-sm transition-colors" title="Delete">
                            <Trash2 className="w-4 h-4 text-muted-foreground/60 hover:text-red-500" />
                          </button>
                        )}
                      </div>
                    </td>
                  ) : null}
                </tr>
              )
            })
          )}
        </tbody>
      </table>
    </div>
  )

  return (
    <div>
      <div className="flex items-center gap-2 mb-4">
        {data.length > 3 && (
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/50" />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder={searchPlaceholder ?? (language === 'ar' ? 'بحث...' : 'Search...')}
              className="w-full h-9 pl-9 pr-8 border border-border rounded-sm text-sm focus:border-emerald-brand focus:outline-none bg-white"
            />
            {search && (
              <button onClick={() => setSearch('')} className="absolute right-2 top-1/2 -translate-y-1/2 p-0.5 hover:bg-muted rounded-sm">
                <X className="w-3.5 h-3.5 text-muted-foreground" />
              </button>
            )}
          </div>
        )}
        <div className="flex items-center gap-2 ml-auto shrink-0">
          {hasSelection && onBulkDelete && (
            <button onClick={handleBulkDelete} className="inline-flex items-center gap-1.5 h-9 px-3 text-xs font-medium text-red-600 bg-red-50 hover:bg-red-100 rounded-sm transition-colors">
              <Trash className="w-3.5 h-3.5" />
              {language === 'ar' ? `حذف (${selected.size})` : `Delete (${selected.size})`}
            </button>
          )}
          <button onClick={handleExport} className="inline-flex items-center gap-1.5 h-9 px-3 text-xs font-medium text-muted-foreground border border-border hover:bg-muted rounded-sm transition-colors">
            <Download className="w-3.5 h-3.5" />
            {language === 'ar' ? 'تصدير' : 'Export'}
          </button>
        </div>
      </div>

      {onReorder && getId ? (
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={items} strategy={verticalListSortingStrategy}>
            {tableContent}
          </SortableContext>
        </DndContext>
      ) : tableContent}

      {search && filtered.length > 0 && (
        <p className="text-xs text-muted-foreground font-mono mt-3 text-right">
          {filtered.length} / {data.length}
        </p>
      )}
    </div>
  )
}
