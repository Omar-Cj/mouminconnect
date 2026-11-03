import { useEffect, useState, type Dispatch, type SetStateAction } from 'react'
import { load, save } from './storage'
import { BRAND } from './constants'

export function useTitle(title: string) {
  useEffect(() => {
    const prev = document.title
    document.title = title ? `${title} · ${BRAND.name}` : BRAND.name
    return () => {
      document.title = prev
    }
  }, [title])
}

/**
 * useState backed by localStorage. Persists on every change and
 * stays in sync across browser tabs through the `storage` event.
 */
export function usePersistentState<T>(key: string, initial: () => T): [T, Dispatch<SetStateAction<T>>] {
  const [state, setState] = useState<T>(() => load(key, initial()))

  useEffect(() => {
    save(key, state)
  }, [key, state])

  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.storageArea !== localStorage || e.key !== key) return
      if (e.newValue == null) return
      try {
        setState(JSON.parse(e.newValue) as T)
      } catch {
        /* ignore malformed */
      }
    }
    window.addEventListener('storage', onStorage)
    return () => window.removeEventListener('storage', onStorage)
  }, [key])

  return [state, setState]
}

export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(() => (typeof window !== 'undefined' ? window.matchMedia(query).matches : false))
  useEffect(() => {
    const mql = window.matchMedia(query)
    const onChange = (e: MediaQueryListEvent) => setMatches(e.matches)
    mql.addEventListener('change', onChange)
    return () => mql.removeEventListener('change', onChange)
  }, [query])
  return matches
}
