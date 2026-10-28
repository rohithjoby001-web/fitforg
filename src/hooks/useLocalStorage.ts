'use client'

import { useEffect, useRef, useState } from 'react'

// ============================================================
// useLocalStorage — persists state to localStorage so the app
// works completely offline, no server, no database, no cost.
// Uses lazy initialization to avoid the "setState in effect" pattern.
// ============================================================

const isBrowser = typeof window !== 'undefined'

function readValue<T>(key: string, initial: T): T {
  if (!isBrowser) return initial
  try {
    const raw = window.localStorage.getItem(key)
    if (raw == null) return initial
    return JSON.parse(raw) as T
  } catch {
    return initial
  }
}

export function useLocalStorage<T>(key: string, initial: T) {
  // Lazy init: read from localStorage on first client render
  const [value, setValue] = useState<T>(() => readValue(key, initial))

  // Skip the very first save (the value was just loaded from storage)
  const isFirstRender = useRef(true)

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false
      return
    }
    if (!isBrowser) return
    try {
      window.localStorage.setItem(key, JSON.stringify(value))
    } catch {
      // ignore quota errors
    }
  }, [key, value])

  // ready is always true because lazy init reads synchronously on first client render
  return [value, setValue, true] as const
}
