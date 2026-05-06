"use client"

import { createContext, useContext, useEffect, useState, useCallback } from "react"
import { seedData, STORAGE_KEY, AUTH_KEY } from "./seed"

const StoreContext = createContext(null)

function generateId(prefix = "id") {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`
}

export function StoreProvider({ children }) {
  const [data, setData] = useState(seedData)
  const [auth, setAuth] = useState(null)
  const [hydrated, setHydrated] = useState(false)

  // Load from localStorage
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (raw) {
        const parsed = JSON.parse(raw)
        // Merge to ensure new seed keys exist
        setData({ ...seedData, ...parsed })
      } else {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(seedData))
      }
      const rawAuth = localStorage.getItem(AUTH_KEY)
      if (rawAuth) setAuth(JSON.parse(rawAuth))
    } catch (e) {
      console.log("[v0] Failed to load store:", e?.message)
    }
    setHydrated(true)
  }, [])

  // Persist data
  useEffect(() => {
    if (!hydrated) return
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
    } catch (e) {
      console.log("[v0] Failed to persist data:", e?.message)
    }
  }, [data, hydrated])

  // Persist auth
  useEffect(() => {
    if (!hydrated) return
    try {
      if (auth) localStorage.setItem(AUTH_KEY, JSON.stringify(auth))
      else localStorage.removeItem(AUTH_KEY)
    } catch (e) {
      console.log("[v0] Failed to persist auth:", e?.message)
    }
  }, [auth, hydrated])

  // Auth helpers
  const login = useCallback((role, userId) => {
    setAuth({ role, userId, loggedAt: new Date().toISOString() })
  }, [])
  const logout = useCallback(() => setAuth(null), [])

  // Generic CRUD helpers per collection
  const addItem = useCallback((collection, item) => {
    const newItem = { id: item.id || generateId(collection.slice(0, 2)), ...item }
    setData((prev) => ({ ...prev, [collection]: [...(prev[collection] || []), newItem] }))
    return newItem
  }, [])

  const updateItem = useCallback((collection, id, patch) => {
    setData((prev) => ({
      ...prev,
      [collection]: (prev[collection] || []).map((it) => (it.id === id ? { ...it, ...patch } : it)),
    }))
  }, [])

  const removeItem = useCallback((collection, id) => {
    setData((prev) => ({
      ...prev,
      [collection]: (prev[collection] || []).filter((it) => it.id !== id),
    }))
  }, [])

  const value = {
    data,
    auth,
    hydrated,
    login,
    logout,
    addItem,
    updateItem,
    removeItem,
    setData,
  }

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>
}

export function useStore() {
  const ctx = useContext(StoreContext)
  if (!ctx) throw new Error("useStore must be used within StoreProvider")
  return ctx
}
