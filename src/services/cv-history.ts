import type { CVData } from '@/lib';

// ─── Types ───────────────────────────────────────────────

export interface CVHistoryEntry {
  snapshot: CVData;
  label: string;
  source: 'user' | 'ai';
  timestamp: number;
}

// ─── CVHistory Engine ────────────────────────────────────

const MAX_HISTORY = 50;

export class CVHistory {
  private _past: CVHistoryEntry[] = [];
  private _future: CVHistoryEntry[] = [];
  private _current: CVData;

  constructor(initial: CVData) {
    this._current = structuredClone(initial);
  }

  /** Push a new state. Clears the redo stack. */
  push(newState: CVData, label: string, source: 'user' | 'ai' = 'user'): void {
    this._past.push({
      snapshot: structuredClone(this._current),
      label,
      source,
      timestamp: Date.now(),
    });

    if (this._past.length > MAX_HISTORY) {
      this._past.shift();
    }

    this._future = [];
    this._current = structuredClone(newState);
  }

  /** Undo the last change. Returns the restored state or null if nothing to undo. */
  undo(): CVData | null {
    const entry = this._past.pop();
    if (!entry) return null;

    this._future.push({
      snapshot: structuredClone(this._current),
      label: entry.label,
      source: entry.source,
      timestamp: Date.now(),
    });

    this._current = structuredClone(entry.snapshot);
    return this._current;
  }

  /** Redo the last undone change. Returns the restored state or null if nothing to redo. */
  redo(): CVData | null {
    const entry = this._future.pop();
    if (!entry) return null;

    this._past.push({
      snapshot: structuredClone(this._current),
      label: entry.label,
      source: entry.source,
      timestamp: Date.now(),
    });

    this._current = structuredClone(entry.snapshot);
    return this._current;
  }

  /** Restore to a specific point in history by index. */
  restoreTo(index: number): CVData | null {
    if (index < 0 || index >= this._past.length) return null;

    // Save current state to future
    this._future.push({
      snapshot: structuredClone(this._current),
      label: 'Before restore',
      source: 'user',
      timestamp: Date.now(),
    });

    // Collect entries after the target index and push to future
    const removed = this._past.splice(index + 1);
    for (const r of removed) {
      this._future.push(r);
    }

    // Pop the target entry and make it current
    const target = this._past.pop();
    if (!target) return null;

    this._current = structuredClone(target.snapshot);
    return this._current;
  }

  get current(): CVData {
    return this._current;
  }

  get canUndo(): boolean {
    return this._past.length > 0;
  }

  get canRedo(): boolean {
    return this._future.length > 0;
  }

  get pastEntries(): ReadonlyArray<CVHistoryEntry> {
    return this._past;
  }

  get undoLabel(): string | null {
    return this._past.length > 0
      ? this._past[this._past.length - 1].label
      : null;
  }

  get redoLabel(): string | null {
    return this._future.length > 0
      ? this._future[this._future.length - 1].label
      : null;
  }

  /** Reset history, keeping only the current state. */
  reset(state: CVData): void {
    this._past = [];
    this._future = [];
    this._current = structuredClone(state);
  }
}
