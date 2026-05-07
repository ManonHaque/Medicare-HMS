"use client"

import { useEffect, useMemo, useRef } from "react"

export default function PrescriptionPdfModal({ open, onClose, title = "Prescription PDF", html }) {
  const iframeRef = useRef(null)

  const srcDoc = useMemo(() => html || "", [html])

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") onClose?.()
    }
    if (open) document.addEventListener("keydown", onKey)
    return () => document.removeEventListener("keydown", onKey)
  }, [open, onClose])

  if (!open) return null

  const print = () => {
    try {
      iframeRef.current?.contentWindow?.focus()
      iframeRef.current?.contentWindow?.print()
    } catch {
      window.print()
    }
  }

  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-slate-900/30" onClick={onClose} />
      <div className="absolute inset-0 flex items-center justify-center p-4">
        <div className="w-full max-w-4xl bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="px-4 py-3 border-b border-slate-200 flex items-center justify-between">
            <div className="text-sm font-semibold text-slate-900">{title}</div>
            <div className="flex gap-2">
              <button
                onClick={print}
                className="text-xs px-3 py-1.5 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Print
              </button>
              <button
                onClick={onClose}
                className="text-xs px-3 py-1.5 border border-slate-200 rounded-md hover:bg-slate-50"
              >
                Close
              </button>
            </div>
          </div>
          <div className="h-[75vh] bg-slate-50">
            <iframe ref={iframeRef} title="Prescription PDF" className="w-full h-full" srcDoc={srcDoc} />
          </div>
        </div>
      </div>
    </div>
  )
}
