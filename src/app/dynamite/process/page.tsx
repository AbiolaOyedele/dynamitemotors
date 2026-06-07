'use client'

import { useState, useEffect, type FormEvent } from 'react'
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core'
import {
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
  arrayMove,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { useUnsavedChanges } from '@/components/admin/UnsavedChanges'

type ProcessStep = {
  number: string
  title: string
  description: string
}

type SortableStep = ProcessStep & { _id: string }

function renumber(steps: SortableStep[]): SortableStep[] {
  return steps.map((step, i) => ({
    ...step,
    number: String(i + 1).padStart(2, '0'),
  }))
}

function makeId() {
  return `step-${Math.random().toString(36).slice(2, 9)}`
}

function toSortable(steps: ProcessStep[]): SortableStep[] {
  return steps.map((s) => ({ ...s, _id: makeId() }))
}

// ── Drag handle icon ──────────────────────────────────────────────────────────

function GripIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
      <circle cx="5.5" cy="4" r="1.2" />
      <circle cx="10.5" cy="4" r="1.2" />
      <circle cx="5.5" cy="8" r="1.2" />
      <circle cx="10.5" cy="8" r="1.2" />
      <circle cx="5.5" cy="12" r="1.2" />
      <circle cx="10.5" cy="12" r="1.2" />
    </svg>
  )
}

// ── Sortable step card ────────────────────────────────────────────────────────

type StepCardProps = {
  step: SortableStep
  index: number
  canRemove: boolean
  onUpdate: (id: string, field: keyof ProcessStep, value: string) => void
  onRemove: (id: string) => void
}

function SortableStepCard({ step, index, canRemove, onUpdate, onRemove }: StepCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: step._id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
    zIndex: isDragging ? 10 : undefined,
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="bg-white rounded-xl border border-border"
    >
      {/* Card header with drag handle + step label + remove */}
      <div className="flex items-center gap-3 px-5 py-4 border-b border-border/60">
        {/* Drag handle */}
        <button
          type="button"
          {...attributes}
          {...listeners}
          className="text-muted/50 hover:text-muted cursor-grab active:cursor-grabbing touch-none shrink-0 p-1 -m-1 rounded"
          aria-label={`Drag to reorder step ${index + 1}`}
        >
          <GripIcon />
        </button>

        <span className="text-[13px] font-bold tracking-widest text-primary shrink-0">
          {step.number}
        </span>
        <p className="text-[13px] font-semibold text-muted flex-1">Step {index + 1}</p>

        {/* Remove */}
        <button
          type="button"
          onClick={() => onRemove(step._id)}
          disabled={!canRemove}
          title={canRemove ? 'Remove this step' : 'Must have at least one step'}
          className="flex items-center gap-1.5 text-[13px] text-muted hover:text-red-500 transition-colors disabled:opacity-30 disabled:cursor-not-allowed shrink-0"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <polyline points="3 6 5 6 21 6" />
            <path d="M19 6l-1 14H6L5 6" />
            <path d="M10 11v6M14 11v6" />
            <path d="M9 6V4h6v2" />
          </svg>
          Remove
        </button>
      </div>

      {/* Fields */}
      <div className="p-5 space-y-4">
        <div>
          <label className="block text-[13px] font-semibold text-body mb-2">Title</label>
          <input
            type="text"
            value={step.title}
            onChange={(e) => onUpdate(step._id, 'title', e.target.value)}
            placeholder="e.g. Book Online or Call"
            className="w-full h-[44px] rounded-lg border border-border px-3 text-[15px] text-body focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
          />
        </div>

        <div>
          <label className="block text-[13px] font-semibold text-body mb-2">Description</label>
          <textarea
            value={step.description}
            onChange={(e) => onUpdate(step._id, 'description', e.target.value)}
            rows={3}
            placeholder="Describe what happens at this step..."
            className="w-full rounded-lg border border-border px-3 py-2.5 text-[15px] text-body focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary resize-none"
          />
        </div>
      </div>
    </div>
  )
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function ProcessAdmin() {
  const [data, setData] = useState<SortableStep[] | null>(null)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { setDirty } = useUnsavedChanges()

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  )

  useEffect(() => {
    fetch('/api/admin/content?section=process')
      .then((r) => r.json())
      .then((r: { data: ProcessStep[] }) => setData(toSortable(r.data ?? [])))
      .catch(() => setError('Failed to load content'))
  }, [])

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event
    if (!data || !over || active.id === over.id) return
    const oldIndex = data.findIndex((s) => s._id === active.id)
    const newIndex = data.findIndex((s) => s._id === over.id)
    setData(renumber(arrayMove(data, oldIndex, newIndex)))
    setDirty(true)
  }

  function updateStep(id: string, field: keyof ProcessStep, value: string) {
    if (!data) return
    setData(data.map((s) => (s._id === id ? { ...s, [field]: value } : s)))
    setDirty(true)
  }

  function addStep() {
    if (!data) return
    const newStep: SortableStep = {
      _id: makeId(),
      number: String(data.length + 1).padStart(2, '0'),
      title: '',
      description: '',
    }
    setData([...data, newStep])
    setDirty(true)
  }

  function removeStep(id: string) {
    if (!data || data.length <= 1) return
    setData(renumber(data.filter((s) => s._id !== id)))
    setDirty(true)
  }

  async function handleSave(e: FormEvent) {
    e.preventDefault()
    if (!data) return
    setSaving(true)
    setSaved(false)
    setError(null)

    // Strip _id before sending to Sanity
    const payload: ProcessStep[] = renumber(data).map(({ _id: _, ...rest }) => rest)

    try {
      const res = await fetch('/api/admin/content?section=process', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      if (!res.ok) throw new Error('Save failed')
      setSaved(true)
      setDirty(false)
      setTimeout(() => setSaved(false), 3000)
    } catch {
      setError('Failed to save. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  if (!data && !error) return <div className="text-muted">Loading...</div>
  if (!data) return <div className="text-red-500 text-[14px]">{error}</div>

  return (
    <div>
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="text-[28px] font-bold text-dark mb-2">Process Steps</h1>
          <p className="text-[16px] text-muted">
            Add, remove, or drag to reorder the steps shown in the &ldquo;How It Works&rdquo; section.
          </p>
        </div>
        <button
          type="button"
          onClick={addStep}
          className="shrink-0 h-[40px] px-5 rounded-lg border border-border text-[14px] font-semibold text-body hover:bg-light-bg transition-colors flex items-center gap-2"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
          Add Step
        </button>
      </div>

      <form onSubmit={handleSave} className="space-y-4 max-w-2xl">
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={data.map((s) => s._id)}
            strategy={verticalListSortingStrategy}
          >
            <div className="space-y-4">
              {data.map((step, index) => (
                <SortableStepCard
                  key={step._id}
                  step={step}
                  index={index}
                  canRemove={data.length > 1}
                  onUpdate={updateStep}
                  onRemove={removeStep}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>

        {/* Add step dashed shortcut */}
        <button
          type="button"
          onClick={addStep}
          className="w-full flex items-center justify-center gap-2 h-[48px] rounded-xl border-2 border-dashed border-border text-[14px] font-medium text-muted hover:border-primary hover:text-primary transition-colors"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
          Add another step
        </button>

        <div className="flex items-center gap-4 pt-2">
          <button
            type="submit"
            disabled={saving}
            className="h-[44px] px-6 rounded-lg bg-dark text-white text-[14px] font-semibold hover:bg-body transition-colors disabled:opacity-50"
          >
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
          {saved && <span className="text-[14px] text-green-600 font-medium">Saved successfully!</span>}
          {error && <span className="text-[14px] text-red-500 font-medium">{error}</span>}
        </div>
      </form>
    </div>
  )
}
