import type { CVData, CVSection, CVSectionData } from '@/lib';

// ─── Types ───────────────────────────────────────────────

export type CVDeltaOp = 'add' | 'update' | 'remove' | 'reorder';

export type CVDeltaTarget =
  | 'header'
  | 'summary'
  | 'settings'
  | 'experience'
  | 'education'
  | 'skills'
  | 'projects'
  | 'certifications'
  | 'languages'
  | 'publications'
  | 'awards'
  | 'volunteer'
  | 'references';

export interface CVDeltaPatch {
  op: CVDeltaOp;
  target: CVDeltaTarget;
  itemId?: string;
  data?: Record<string, unknown>;
  position?: number;
}

export interface CVPatchResult {
  cv: CVData;
  applied: CVDeltaPatch[];
  rejected: Array<{ patch: CVDeltaPatch; reason: string }>;
  descriptions: string[];
}

// ─── Safety Config ───────────────────────────────────────

const SAFETY = {
  maxPatchesPerRequest: 15,
  forbidBulkRemove: true,
  requireItemIdForUpdate: true,
  requireItemIdForRemove: true,
} as const;

// ─── Target → Section mapping ────────────────────────────

const TARGET_TO_SECTION_TYPE: Record<CVDeltaTarget, string> = {
  header: 'header',
  summary: 'summary',
  settings: '__settings__',
  experience: 'experience',
  education: 'education',
  skills: 'skills',
  projects: 'projects',
  certifications: 'certifications',
  languages: 'languages',
  publications: 'publications',
  awards: 'awards',
  volunteer: 'volunteer',
  references: 'references',
};

const TARGET_TO_ITEMS_KEY: Record<string, keyof CVSectionData> = {
  experience: 'items',
  education: 'education_items',
  skills: 'skill_categories',
  projects: 'project_items',
  certifications: 'cert_items',
  languages: 'language_items',
  publications: 'publication_items',
  awards: 'award_items',
  volunteer: 'volunteer_items',
  references: 'reference_items',
};

// ─── Helpers ─────────────────────────────────────────────

function findSection(cv: CVData, sectionType: string): CVSection | undefined {
  return cv.sections.find((s) => s.type === sectionType);
}

function ensureSection(cv: CVData, sectionType: string): CVSection {
  let section = findSection(cv, sectionType);
  if (!section) {
    section = {
      id: sectionType,
      type: sectionType as CVSection['type'],
      title: sectionType.charAt(0).toUpperCase() + sectionType.slice(1),
      enabled: true,
      order: cv.sections.length,
      data: {},
    };
    cv.sections.push(section);
  }
  return section;
}

function getItems(section: CVSection, itemsKey: string): Array<Record<string, unknown>> {
  const items = (section.data as Record<string, unknown>)[itemsKey];
  if (Array.isArray(items)) return items as Array<Record<string, unknown>>;
  return [];
}

function setItems(section: CVSection, itemsKey: string, items: Array<Record<string, unknown>>): void {
  (section.data as Record<string, unknown>)[itemsKey] = items;
}

// ─── Patch Validators ────────────────────────────────────

function validatePatch(
  patch: CVDeltaPatch,
  cv: CVData,
  existingRemoves: Map<string, number>,
): string | null {
  if (!patch.op || !patch.target) {
    return 'Missing required fields: op, target';
  }

  if (!TARGET_TO_SECTION_TYPE[patch.target]) {
    return `Unknown target: ${patch.target}`;
  }

  if (patch.op === 'update' && SAFETY.requireItemIdForUpdate) {
    // header, summary, settings don't require itemId
    const isScalar = ['header', 'summary', 'settings'].includes(patch.target);
    if (!isScalar && !patch.itemId) {
      return `"update" on "${patch.target}" requires itemId`;
    }
  }

  if (patch.op === 'remove') {
    if (SAFETY.requireItemIdForRemove && !patch.itemId) {
      return `"remove" requires itemId to prevent bulk deletion`;
    }

    // Track removes per target to prevent bulk deletion
    const count = (existingRemoves.get(patch.target) ?? 0) + 1;
    existingRemoves.set(patch.target, count);

    if (SAFETY.forbidBulkRemove) {
      const section = findSection(cv, TARGET_TO_SECTION_TYPE[patch.target]);
      const itemsKey = TARGET_TO_ITEMS_KEY[patch.target];
      if (section && itemsKey) {
        const total = getItems(section, itemsKey).length;
        if (total > 0 && count >= total) {
          return `Bulk removal blocked: cannot remove all ${patch.target} items`;
        }
      }
    }
  }

  if ((patch.op === 'add' || patch.op === 'update') && !patch.data) {
    return `"${patch.op}" requires data`;
  }

  return null;
}

// ─── Patch Executors ─────────────────────────────────────

function applyHeaderPatch(cv: CVData, patch: CVDeltaPatch): string {
  const section = ensureSection(cv, 'header');
  if (patch.op === 'update' && patch.data) {
    section.data = { ...section.data, ...patch.data } as CVSectionData;
    const fields = Object.keys(patch.data).join(', ');
    return `Updated header: ${fields}`;
  }
  return 'Header patch skipped';
}

function applySummaryPatch(cv: CVData, patch: CVDeltaPatch): string {
  const section = ensureSection(cv, 'summary');
  if (patch.op === 'update' && patch.data) {
    section.data = { ...section.data, ...patch.data } as CVSectionData;
    return 'Updated professional summary';
  }
  return 'Summary patch skipped';
}

function applySettingsPatch(cv: CVData, patch: CVDeltaPatch): string {
  if (patch.op === 'update' && patch.data) {
    cv.settings = { ...cv.settings, ...patch.data } as CVData['settings'];
    if (patch.data.template) {
      cv.template = patch.data.template as CVData['template'];
    }
    const fields = Object.keys(patch.data).join(', ');
    return `Updated settings: ${fields}`;
  }
  return 'Settings patch skipped';
}

function applyListPatch(cv: CVData, patch: CVDeltaPatch): string {
  const sectionType = TARGET_TO_SECTION_TYPE[patch.target];
  const itemsKey = TARGET_TO_ITEMS_KEY[patch.target];
  if (!sectionType || !itemsKey) return `Unknown list target: ${patch.target}`;

  const section = ensureSection(cv, sectionType);
  const items = getItems(section, itemsKey);

  if (patch.op === 'add' && patch.data) {
    const newItem = {
      id: crypto.randomUUID(),
      ...patch.data,
    };
    if (patch.position !== undefined && patch.position >= 0 && patch.position <= items.length) {
      items.splice(patch.position, 0, newItem);
    } else {
      items.push(newItem);
    }
    setItems(section, itemsKey, items);

    const label = (patch.data as Record<string, string>).role
      ?? (patch.data as Record<string, string>).name
      ?? (patch.data as Record<string, string>).degree
      ?? (patch.data as Record<string, string>).language
      ?? patch.target;
    return `Added ${patch.target}: ${label}`;
  }

  if (patch.op === 'update' && patch.itemId && patch.data) {
    const idx = items.findIndex((item) => item.id === patch.itemId);
    if (idx === -1) return `Item ${patch.itemId} not found in ${patch.target}`;

    items[idx] = { ...items[idx], ...patch.data };
    setItems(section, itemsKey, items);

    const label = (items[idx] as Record<string, string>).role
      ?? (items[idx] as Record<string, string>).name
      ?? patch.itemId;
    return `Updated ${patch.target}: ${label}`;
  }

  if (patch.op === 'remove' && patch.itemId) {
    const idx = items.findIndex((item) => item.id === patch.itemId);
    if (idx === -1) return `Item ${patch.itemId} not found in ${patch.target}`;

    const removed = items[idx];
    const label = (removed as Record<string, string>).role
      ?? (removed as Record<string, string>).name
      ?? patch.itemId;
    items.splice(idx, 1);
    setItems(section, itemsKey, items);
    return `Removed ${patch.target}: ${label}`;
  }

  if (patch.op === 'reorder' && patch.itemId && patch.position !== undefined) {
    const idx = items.findIndex((item) => item.id === patch.itemId);
    if (idx === -1) return `Item ${patch.itemId} not found for reorder`;

    const [item] = items.splice(idx, 1);
    const targetPos = Math.min(Math.max(0, patch.position), items.length);
    items.splice(targetPos, 0, item);
    setItems(section, itemsKey, items);
    return `Reordered ${patch.target} item to position ${targetPos}`;
  }

  return `No action taken for ${patch.target}`;
}

// ─── Main Entry Point ────────────────────────────────────

/**
 * Apply an array of delta patches to a CV, returning the new CV
 * along with a report of which patches were applied/rejected.
 */
export function applyDeltaPatches(cv: CVData, patches: CVDeltaPatch[]): CVPatchResult {
  const cloned = structuredClone(cv);

  if (patches.length > SAFETY.maxPatchesPerRequest) {
    return {
      cv: cloned,
      applied: [],
      rejected: patches.map((p) => ({
        patch: p,
        reason: `Too many patches (${patches.length}). Max: ${SAFETY.maxPatchesPerRequest}`,
      })),
      descriptions: [],
    };
  }

  const applied: CVDeltaPatch[] = [];
  const rejected: Array<{ patch: CVDeltaPatch; reason: string }> = [];
  const descriptions: string[] = [];
  const removeTracker = new Map<string, number>();

  for (const patch of patches) {
    const error = validatePatch(patch, cloned, removeTracker);
    if (error) {
      rejected.push({ patch, reason: error });
      continue;
    }

    let desc: string;

    switch (patch.target) {
      case 'header':
        desc = applyHeaderPatch(cloned, patch);
        break;
      case 'summary':
        desc = applySummaryPatch(cloned, patch);
        break;
      case 'settings':
        desc = applySettingsPatch(cloned, patch);
        break;
      default:
        desc = applyListPatch(cloned, patch);
        break;
    }

    applied.push(patch);
    descriptions.push(desc);
  }

  return { cv: cloned, applied, rejected, descriptions };
}

/**
 * Build a concise context summary of the CV for the AI prompt.
 * Avoids sending the full JSON — only sends IDs, labels, and counts.
 */
export function buildSmartContext(cv: CVData, language: 'en' | 'ar'): string {
  const isAr = language === 'ar';
  const lines: string[] = [];

  // Header
  const header = findSection(cv, 'header')?.data;
  if (header) {
    lines.push(`[Header] Name: ${header.name ?? '(empty)'} | Title: ${isAr ? header.title_ar : header.title_en} | Email: ${header.email ?? ''} | Location: ${header.location ?? ''}`);
  }

  // Summary
  const summary = findSection(cv, 'summary')?.data;
  if (summary) {
    const text = isAr ? summary.summary_ar : summary.summary_en;
    lines.push(`[Summary] ${text ? text.slice(0, 120) + '...' : '(empty)'}`);
  }

  // Experience
  const expSection = findSection(cv, 'experience');
  const expItems = expSection ? getItems(expSection, 'items') : [];
  if (expItems.length) {
    lines.push(`[Experience] ${expItems.length} entries:`);
    for (const e of expItems) {
      const exp = e as Record<string, unknown>;
      lines.push(`  - id="${exp.id}" | ${exp.role} @ ${exp.company} | ${exp.start_date} — ${exp.current ? 'Present' : exp.end_date}`);
    }
  }

  // Education
  const eduSection = findSection(cv, 'education');
  const eduItems = eduSection ? getItems(eduSection, 'education_items') : [];
  if (eduItems.length) {
    lines.push(`[Education] ${eduItems.length} entries:`);
    for (const e of eduItems) {
      const edu = e as Record<string, unknown>;
      lines.push(`  - id="${edu.id}" | ${edu.degree} in ${edu.field} @ ${edu.institution}`);
    }
  }

  // Skills
  const skillSection = findSection(cv, 'skills');
  const skillCats = skillSection ? getItems(skillSection, 'skill_categories') : [];
  if (skillCats.length) {
    lines.push(`[Skills] ${skillCats.length} categories:`);
    for (const c of skillCats) {
      const cat = c as Record<string, unknown>;
      const skills = Array.isArray(cat.skills) ? (cat.skills as string[]).join(', ') : '';
      lines.push(`  - id="${cat.id}" | ${cat.name}: ${skills}`);
    }
  }

  // Projects
  const projSection = findSection(cv, 'projects');
  const projItems = projSection ? getItems(projSection, 'project_items') : [];
  if (projItems.length) {
    lines.push(`[Projects] ${projItems.length} entries:`);
    for (const p of projItems) {
      const proj = p as Record<string, unknown>;
      lines.push(`  - id="${proj.id}" | ${proj.name}`);
    }
  }

  // Certifications
  const certSection = findSection(cv, 'certifications');
  const certItems = certSection ? getItems(certSection, 'cert_items') : [];
  if (certItems.length) {
    lines.push(`[Certifications] ${certItems.length} entries:`);
    for (const c of certItems) {
      const cert = c as Record<string, unknown>;
      lines.push(`  - id="${cert.id}" | ${cert.name} by ${cert.issuer}`);
    }
  }

  // Languages
  const langSection = findSection(cv, 'languages');
  const langItems = langSection ? getItems(langSection, 'language_items') : [];
  if (langItems.length) {
    lines.push(`[Languages] ${langItems.map((l) => `${(l as Record<string, unknown>).language} (${(l as Record<string, unknown>).proficiency})`).join(', ')}`);
  }

  // Settings
  lines.push(`[Settings] Template: ${cv.template} | Color: ${cv.settings.theme_color} | Font: ${cv.settings.font_family} | Spacing: ${cv.settings.spacing}`);

  return lines.join('\n');
}
