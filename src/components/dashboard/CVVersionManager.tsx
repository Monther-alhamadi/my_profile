import React, { useState } from 'react';
import {
  Layers, Plus, Copy, Trash2, Star, Check, Loader2, Sparkles, ChevronDown
} from 'lucide-react';
import type { CVVersionFull } from '@/services/cv-version-store';
import type { Language } from '@/lib/index';
import { toast } from 'sonner';

interface CVVersionManagerProps {
  versions: CVVersionFull[];
  activeVersionId: string | null;
  language: Language;
  onSelectVersion: (version: CVVersionFull) => void;
  onCreateNewVersion: (name: string) => Promise<void>;
  onDuplicateVersion: (sourceId: string, newName: string) => Promise<void>;
  onDeleteVersion: (versionId: string) => Promise<void>;
  onSetPrimaryVersion: (versionId: string) => Promise<void>;
  onOpenImportModal: () => void;
  loading?: boolean;
}

export function CVVersionManager({
  versions,
  activeVersionId,
  language,
  onSelectVersion,
  onCreateNewVersion,
  onDuplicateVersion,
  onDeleteVersion,
  onSetPrimaryVersion,
  onOpenImportModal,
  loading = false,
}: CVVersionManagerProps) {
  const isAr = language === 'ar';
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  const activeVersion = versions.find((v) => v.id === activeVersionId) || versions[0];

  const handleCreate = async () => {
    const defaultName = isAr ? `نسخة سيرة ${versions.length + 1}` : `CV Version ${versions.length + 1}`;
    const name = window.prompt(isAr ? 'أدخل اسم النسخة الجديدة:' : 'Enter name for new CV version:', defaultName);
    if (!name || !name.trim()) return;

    setActionLoading(true);
    try {
      await onCreateNewVersion(name.trim());
      toast.success(isAr ? 'تم إنشاء النسخة الجديدة بنجاح' : 'New version created successfully');
    } catch (err: any) {
      toast.error(isAr ? 'فشل إنشاء النسخة' : 'Failed to create version');
    } finally {
      setActionLoading(false);
    }
  };

  const handleDuplicate = async () => {
    if (!activeVersion) return;
    const defaultName = `${activeVersion.versionName} (${isAr ? 'نسخة' : 'Copy'})`;
    const name = window.prompt(isAr ? 'أدخل اسم النسخة المنسوخة:' : 'Enter name for duplicate version:', defaultName);
    if (!name || !name.trim()) return;

    setActionLoading(true);
    try {
      await onDuplicateVersion(activeVersion.id, name.trim());
      toast.success(isAr ? 'تم نسخ النسخة بنجاح' : 'Version duplicated successfully');
    } catch (err: any) {
      toast.error(isAr ? 'فشل تكرار النسخة' : 'Failed to duplicate version');
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!activeVersion) return;
    if (versions.length <= 1) {
      toast.error(isAr ? 'لا يمكن حذف النسخة الوحيدة' : 'Cannot delete the only version');
      return;
    }
    if (!window.confirm(isAr ? `هل أنت تأكد من حذف النسخة "${activeVersion.versionName}"؟` : `Are you sure you want to delete "${activeVersion.versionName}"?`)) {
      return;
    }

    setActionLoading(true);
    try {
      await onDeleteVersion(activeVersion.id);
      toast.success(isAr ? 'تم حذف النسخة بنجاح' : 'Version deleted successfully');
    } catch (err: any) {
      toast.error(isAr ? 'فشل حذف النسخة' : 'Failed to delete version');
    } finally {
      setActionLoading(false);
    }
  };

  const handleSetPrimary = async () => {
    if (!activeVersion || activeVersion.isPrimary) return;

    setActionLoading(true);
    try {
      await onSetPrimaryVersion(activeVersion.id);
      toast.success(isAr ? 'تم تعيين النسخة كـ افتراضية للزوار ⭐' : 'Set as primary default version for visitors ⭐');
    } catch (err: any) {
      toast.error(isAr ? 'فشل تعيين النسخة الافتراضية' : 'Failed to set primary version');
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="bg-obsidian/90 text-white rounded-lg p-3 mb-4 shadow-md border border-gray-800 flex flex-wrap items-center justify-between gap-3" dir={isAr ? 'rtl' : 'ltr'}>
      {/* Active Version Selector */}
      <div className="flex items-center gap-2">
        <div className="p-1.5 rounded bg-emerald-brand/20 text-emerald-brand">
          <Layers className="w-4 h-4" />
        </div>
        <div className="relative">
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            disabled={actionLoading || loading}
            className="flex items-center gap-2 text-xs font-bold bg-slate-800/80 hover:bg-slate-700/80 px-3 py-1.5 rounded border border-gray-700 transition-colors"
          >
            <span>{activeVersion?.versionName || (isAr ? 'اختر النسخة' : 'Select Version')}</span>
            {activeVersion?.isPrimary && (
              <span className="bg-amber-500/20 text-amber-400 text-[10px] px-1.5 py-0.5 rounded font-mono flex items-center gap-0.5">
                <Star className="w-3 h-3 fill-amber-400" />
                {isAr ? 'افتراضية' : 'Primary'}
              </span>
            )}
            <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
          </button>

          {/* Dropdown Menu */}
          {dropdownOpen && (
            <div className="absolute top-full right-0 mt-1 w-64 bg-slate-900 border border-gray-700 rounded-lg shadow-xl z-50 overflow-hidden text-xs">
              <div className="px-3 py-2 bg-slate-800/50 text-[10px] font-mono text-gray-400 border-b border-gray-800">
                {isAr ? 'نسخ السيرة الذاتية المحفوظة:' : 'Saved CV Versions:'}
              </div>
              <div className="max-h-48 overflow-y-auto">
                {versions.map((ver) => (
                  <button
                    key={ver.id}
                    onClick={() => {
                      onSelectVersion(ver);
                      setDropdownOpen(false);
                    }}
                    className={`w-full text-left px-3 py-2 flex items-center justify-between hover:bg-slate-800 transition-colors ${
                      ver.id === activeVersion?.id ? 'bg-emerald-brand/10 text-emerald-brand font-bold' : 'text-gray-300'
                    }`}
                  >
                    <span className="truncate">{ver.versionName}</span>
                    <div className="flex items-center gap-1">
                      {ver.isPrimary && <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />}
                      {ver.id === activeVersion?.id && <Check className="w-3.5 h-3.5 text-emerald-brand" />}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Action Toolbar Buttons */}
      <div className="flex items-center gap-1.5 flex-wrap text-xs">
        {/* Set Primary */}
        <button
          onClick={handleSetPrimary}
          disabled={actionLoading || !activeVersion || activeVersion.isPrimary}
          title={isAr ? 'تعيين هذه النسخة كالسيرة الافتراضية المعتمدة للزوار' : 'Set this version as default primary for site visitors'}
          className={`px-2.5 py-1.5 rounded flex items-center gap-1 font-semibold transition-colors disabled:opacity-40 ${
            activeVersion?.isPrimary
              ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
              : 'bg-slate-800 hover:bg-slate-700 text-gray-300 border border-gray-700'
          }`}
        >
          <Star className={`w-3.5 h-3.5 ${activeVersion?.isPrimary ? 'fill-amber-400 text-amber-400' : ''}`} />
          <span>{activeVersion?.isPrimary ? (isAr ? 'النسخة الافتراضية' : 'Primary') : (isAr ? 'تعيين كافتراضية' : 'Make Primary')}</span>
        </button>

        {/* Duplicate Version */}
        <button
          onClick={handleDuplicate}
          disabled={actionLoading || !activeVersion}
          title={isAr ? 'تكرار النسخة الحالية لتخصيصها لشركة محددة' : 'Duplicate current version to tailor for a specific role'}
          className="px-2.5 py-1.5 rounded bg-slate-800 hover:bg-slate-700 text-gray-300 border border-gray-700 flex items-center gap-1 font-semibold transition-colors disabled:opacity-50"
        >
          <Copy className="w-3.5 h-3.5 text-blue-400" />
          <span>{isAr ? 'تكرار النسخة' : 'Duplicate'}</span>
        </button>

        {/* Create New Version */}
        <button
          onClick={handleCreate}
          disabled={actionLoading}
          className="px-2.5 py-1.5 rounded bg-emerald-brand hover:bg-emerald-600 text-white font-semibold flex items-center gap-1 transition-colors disabled:opacity-50"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>{isAr ? 'نسخة جديدة' : 'New Version'}</span>
        </button>

        {/* Smart Import Button */}
        <button
          onClick={onOpenImportModal}
          disabled={actionLoading}
          className="px-2.5 py-1.5 rounded bg-purple-600 hover:bg-purple-500 text-white font-semibold flex items-center gap-1 transition-colors"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>{isAr ? 'استيراد ذكي' : 'AI Import'}</span>
        </button>

        {/* Delete Version */}
        {versions.length > 1 && (
          <button
            onClick={handleDelete}
            disabled={actionLoading || !activeVersion}
            title={isAr ? 'حذف النسخة الحالية' : 'Delete current version'}
            className="p-1.5 rounded bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 transition-colors disabled:opacity-50"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        )}

        {actionLoading && <Loader2 className="w-4 h-4 text-emerald-brand animate-spin" />}
      </div>
    </div>
  );
}
