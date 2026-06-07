'use client'

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react'
import { usePathname } from 'next/navigation'

// ── Context ───────────────────────────────────────────────────────────────────

interface UnsavedChangesCtx {
  isDirty: boolean
  setDirty: (dirty: boolean) => void
  /** Returns true if safe to navigate (not dirty, or user confirmed). */
  confirmNavigation: () => boolean
}

const UnsavedChangesContext = createContext<UnsavedChangesCtx>({
  isDirty: false,
  setDirty: () => {},
  confirmNavigation: () => true,
})

export function useUnsavedChanges() {
  return useContext(UnsavedChangesContext)
}

// ── Provider ──────────────────────────────────────────────────────────────────

export function UnsavedChangesProvider({ children }: { children: ReactNode }) {
  const [isDirty, setIsDirty] = useState(false)
  const pathname = usePathname()

  // Reset when the route changes (after navigation completes)
  useEffect(() => {
    setIsDirty(false)
  }, [pathname])

  // Block browser-level navigation (refresh, close tab, external link)
  useEffect(() => {
    if (!isDirty) return
    function onBeforeUnload(e: BeforeUnloadEvent) {
      e.preventDefault()
      e.returnValue = ''
    }
    window.addEventListener('beforeunload', onBeforeUnload)
    return () => window.removeEventListener('beforeunload', onBeforeUnload)
  }, [isDirty])

  const setDirty = useCallback((dirty: boolean) => setIsDirty(dirty), [])

  const confirmNavigation = useCallback((): boolean => {
    if (!isDirty) return true
    return window.confirm('You have unsaved changes. Leave this page without saving?')
  }, [isDirty])

  return (
    <UnsavedChangesContext.Provider value={{ isDirty, setDirty, confirmNavigation }}>
      {children}
    </UnsavedChangesContext.Provider>
  )
}

// ── Banner ────────────────────────────────────────────────────────────────────

export function UnsavedChangesBanner() {
  const { isDirty } = useUnsavedChanges()
  if (!isDirty) return null

  return (
    <div className="flex items-center gap-3 bg-amber-50 border-b border-amber-200 px-8 py-3">
      <div className="w-2 h-2 rounded-full bg-amber-500 shrink-0 animate-pulse" />
      <p className="text-[13px] font-semibold text-amber-800">
        Unsaved changes — click <strong>Save Changes</strong> before leaving this page.
      </p>
    </div>
  )
}
