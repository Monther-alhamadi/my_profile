import { Languages } from 'lucide-react'

interface BilingualFieldsProps {
  sharedFields?: React.ReactNode
  enFields: React.ReactNode
  arFields: React.ReactNode
}

export default function BilingualFields({ sharedFields, enFields, arFields }: BilingualFieldsProps) {
  return (
    <div className="space-y-5">
      {sharedFields && (
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-xs font-mono font-semibold text-muted-foreground">
            <Languages className="w-3.5 h-3.5" />
            <span>Shared</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {sharedFields}
          </div>
        </div>
      )}

      <div className="border-t border-border" />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-xs font-mono font-semibold text-foreground">
            <span className="text-base">🇬🇧</span>
            <span>English</span>
          </div>
          <div className="space-y-3">
            {enFields}
          </div>
        </div>
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-xs font-mono font-semibold text-foreground">
            <span className="text-base">🇸🇦</span>
            <span>Arabic</span>
          </div>
          <div className="space-y-3">
            {arFields}
          </div>
        </div>
      </div>
    </div>
  )
}

// ── Reusable field components ──

export function Field({ label, children, required }: { label: string; children: React.ReactNode; required?: boolean }) {
  return (
    <div>
      <label className="text-xs font-mono font-semibold text-muted-foreground mb-1 block">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      {children}
    </div>
  )
}

const inputClass = 'w-full h-9 px-3 border border-border rounded-sm text-sm focus:border-emerald-brand focus:outline-none'
const textareaClass = 'w-full px-3 py-2 border border-border rounded-sm text-sm focus:border-emerald-brand focus:outline-none resize-none'
const selectClass = 'w-full h-9 px-3 border border-border rounded-sm text-sm focus:border-emerald-brand focus:outline-none bg-white'

export function TextInput({ value, onChange, placeholder }: { value: string; onChange: (v: string) => void; placeholder?: string }) {
  return <input value={value} onChange={e => onChange(e.target.value)} className={inputClass} placeholder={placeholder} />
}

export function TextArea({ value, onChange, rows = 3 }: { value: string; onChange: (v: string) => void; rows?: number }) {
  return <textarea value={value} onChange={e => onChange(e.target.value)} rows={rows} className={textareaClass} />
}

export function SelectInput({ value, onChange, options }: { value: string; onChange: (v: string) => void; options: string[] }) {
  return (
    <select value={value} onChange={e => onChange(e.target.value)} className={selectClass}>
      {options.map(o => <option key={o} value={o}>{o}</option>)}
    </select>
  )
}
