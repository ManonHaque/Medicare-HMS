"use client"

import { useEffect, useState } from "react"
import PublicNavbar from "@/components/PublicNavbar"
import { useStore } from "@/lib/store"

const SEARCH_FIELDS = [
  { value: "all", label: "Brand & Generic" },
  { value: "brand", label: "Brand" },
  { value: "generic", label: "Generic" },
  { value: "indication", label: "Indication" },
  { value: "company", label: "Company" },
]

const FAV_KEY = "medicine_favorites_v1"
const RECENT_KEY = "medicine_recent_v1"

export default function MedicinesPage() {
  const { data, hydrated } = useStore()
  const [query, setQuery] = useState("")
  const [field, setField] = useState("all")
  const [typeFilter, setTypeFilter] = useState("All")
  const [companyFilter, setCompanyFilter] = useState("All")
  const [selectedId, setSelectedId] = useState(null)
  const [favorites, setFavorites] = useState([])
  const [recent, setRecent] = useState([])
  const [copied, setCopied] = useState(false)
  const [activeVariant, setActiveVariant] = useState(0)

  // Load favorites and recent on mount
  useEffect(() => {
    try {
      const f = localStorage.getItem(FAV_KEY)
      if (f) setFavorites(JSON.parse(f))
      const r = localStorage.getItem(RECENT_KEY)
      if (r) setRecent(JSON.parse(r))
    } catch (e) {
      console.log("[v0] Failed to load fav/recent:", e?.message)
    }
  }, [])

  // Persist favorites
  useEffect(() => {
    try {
      localStorage.setItem(FAV_KEY, JSON.stringify(favorites))
    } catch (e) {
      console.log("[v0] fav persist err", e?.message)
    }
  }, [favorites])

  // Persist recent
  useEffect(() => {
    try {
      localStorage.setItem(RECENT_KEY, JSON.stringify(recent))
    } catch (e) {
      console.log("[v0] recent persist err", e?.message)
    }
  }, [recent])

  if (!hydrated) {
    return (
      <div className="min-h-screen flex flex-col bg-slate-50">
        <PublicNavbar />
        <div className="p-8 text-slate-500 text-sm">Loading drug directory…</div>
      </div>
    )
  }

  const approved = data.medicines.filter((m) => m.status === "Approved")
  const types = ["All", ...Array.from(new Set(approved.map((m) => m.type)))]
  const companies = ["All", ...Array.from(new Set(approved.map((m) => m.company || "Unknown")))]
  const generics = Array.from(new Set(approved.map((m) => m.generic)))

  const filtered = approved.filter((m) => {
    const q = query.trim().toLowerCase()
    if (typeFilter !== "All" && m.type !== typeFilter) return false
    if (companyFilter !== "All" && m.company !== companyFilter) return false
    if (!q) return true
    if (field === "brand") return (m.brand || m.name || "").toLowerCase().includes(q)
    if (field === "generic") return (m.generic || "").toLowerCase().includes(q)
    if (field === "indication")
      return (
        (m.indication || "").toLowerCase().includes(q) ||
        (m.usage || "").toLowerCase().includes(q)
      )
    if (field === "company") return (m.company || "").toLowerCase().includes(q)
    // all
    return (
      (m.brand || m.name || "").toLowerCase().includes(q) ||
      (m.generic || "").toLowerCase().includes(q) ||
      (m.usage || "").toLowerCase().includes(q) ||
      (m.indication || "").toLowerCase().includes(q) ||
      (m.company || "").toLowerCase().includes(q)
    )
  })

  const selected = approved.find((m) => m.id === selectedId)
  const recentList = recent
    .map((id) => approved.find((m) => m.id === id))
    .filter(Boolean)
    .slice(0, 5)

  function openMedicine(m) {
    setSelectedId(m.id)
    setActiveVariant(0)
    setRecent((prev) => {
      const next = [m.id, ...prev.filter((x) => x !== m.id)].slice(0, 8)
      return next
    })
  }

  function toggleFav(id) {
    setFavorites((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]))
  }

  function copyMedicine(m) {
    const text = `${m.brand || m.name} ${m.strength || ""} (${m.generic}) — ${m.company}`
    try {
      navigator.clipboard?.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 1400)
    } catch {
      setCopied(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <PublicNavbar />

      {/* Search bar - dense pharmaceutical bar */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-[1280px] mx-auto px-4 py-3">
          <div className="flex items-stretch gap-0 max-w-3xl">
            <select
              value={field}
              onChange={(e) => setField(e.target.value)}
              className="bg-slate-100 border border-slate-300 border-r-0 rounded-l-md px-3 text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              aria-label="Search field"
            >
              {SEARCH_FIELDS.map((f) => (
                <option key={f.value} value={f.value}>
                  {f.label}
                </option>
              ))}
            </select>
            <div className="flex-1 relative">
              <input
                type="text"
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value)
                  setSelectedId(null)
                }}
                placeholder="Search medicines (e.g. Napa, Paracetamol, Fever, Square Pharma)"
                className="w-full h-11 px-4 pl-10 border border-slate-300 rounded-r-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <SearchIcon className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 max-w-[1280px] mx-auto w-full px-4 py-4 flex gap-4">
        {/* Sidebar Filters */}
        <aside className="hidden lg:block w-60 flex-shrink-0 space-y-4">
          <FilterPanel title="Type">
            {types.map((t) => (
              <FilterRow
                key={t}
                active={typeFilter === t}
                onClick={() => setTypeFilter(t)}
                label={t}
                count={t === "All" ? approved.length : approved.filter((m) => m.type === t).length}
              />
            ))}
          </FilterPanel>

          <FilterPanel title="Company">
            <div className="max-h-56 overflow-y-auto">
              {companies.map((c) => (
                <FilterRow
                  key={c}
                  active={companyFilter === c}
                  onClick={() => setCompanyFilter(c)}
                  label={c.replace(" Pharmaceuticals Ltd.", " Pharma").replace(" Limited", "")}
                  count={
                    c === "All"
                      ? approved.length
                      : approved.filter((m) => m.company === c).length
                  }
                />
              ))}
            </div>
          </FilterPanel>

          <FilterPanel title="Generics">
            <div className="max-h-44 overflow-y-auto">
              {generics.slice(0, 12).map((g) => (
                <button
                  key={g}
                  onClick={() => {
                    setQuery(g)
                    setField("generic")
                    setSelectedId(null)
                  }}
                  className="block w-full text-left px-2 py-1 text-xs text-slate-700 hover:bg-blue-50 hover:text-blue-700 rounded"
                >
                  {g}
                </button>
              ))}
            </div>
          </FilterPanel>

          {recentList.length > 0 && (
            <FilterPanel title="Recently Viewed">
              {recentList.map((m) => (
                <button
                  key={m.id}
                  onClick={() => openMedicine(m)}
                  className="block w-full text-left px-2 py-1.5 hover:bg-blue-50 rounded"
                >
                  <div className="text-xs font-semibold text-slate-800">
                    {m.brand} {m.strength}
                  </div>
                  <div className="text-[11px] text-slate-500">{m.generic}</div>
                </button>
              ))}
            </FilterPanel>
          )}
        </aside>

        {/* Main content */}
        <main className="flex-1 min-w-0">
          {!selected ? (
            <ResultsList
              items={filtered}
              query={query}
              favorites={favorites}
              onOpen={openMedicine}
              onFav={toggleFav}
              total={approved.length}
            />
          ) : (
            <MedicineDetail
              medicine={selected}
              allMedicines={approved}
              activeVariant={activeVariant}
              onVariantChange={setActiveVariant}
              isFav={favorites.includes(selected.id)}
              onFav={() => toggleFav(selected.id)}
              onCopy={() => copyMedicine(selected)}
              onBack={() => setSelectedId(null)}
              onOpenOther={openMedicine}
              copied={copied}
            />
          )}
        </main>
      </div>
    </div>
  )
}

/* ----------------- Filter sidebar ----------------- */

function FilterPanel({ title, children }) {
  return (
    <section className="bg-white border border-slate-200 rounded">
      <header className="px-3 py-2 bg-blue-50 border-b border-slate-200 text-[11px] font-bold uppercase tracking-wide text-blue-900">
        {title}
      </header>
      <div className="p-1">{children}</div>
    </section>
  )
}

function FilterRow({ active, onClick, label, count }) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center justify-between px-2 py-1 text-xs rounded ${
        active
          ? "bg-blue-600 text-white font-medium"
          : "text-slate-700 hover:bg-slate-100"
      }`}
    >
      <span className="truncate">{label}</span>
      <span className={`ml-2 text-[10px] ${active ? "text-blue-100" : "text-slate-400"}`}>
        {count}
      </span>
    </button>
  )
}

/* ----------------- Results list ----------------- */

function ResultsList({ items, query, favorites, onOpen, onFav, total }) {
  return (
    <div className="bg-white border border-slate-200 rounded">
      <header className="flex items-center justify-between px-4 py-2 bg-slate-50 border-b border-slate-200">
        <div className="text-xs text-slate-600">
          <span className="font-semibold text-slate-900">{items.length}</span> result
          {items.length !== 1 && "s"}
          {query && (
            <span>
              {" "}
              for <span className="font-mono text-blue-700">"{query}"</span>
            </span>
          )}
          <span className="text-slate-400"> · {total} medicines indexed</span>
        </div>
        <div className="text-[11px] text-slate-500 hidden sm:block">
          Click a row to view detailed drug information
        </div>
      </header>

      {items.length === 0 ? (
        <div className="p-10 text-center">
          <div className="text-slate-400 text-sm mb-2">No medicines match your search</div>
          <div className="text-xs text-slate-400">
            Try searching by brand (Napa), generic (Paracetamol), or indication (Fever).
          </div>
        </div>
      ) : (
        <ul className="divide-y divide-slate-200">
          {items.map((m) => (
            <li
              key={m.id}
              className="flex items-center gap-3 px-4 py-2.5 hover:bg-blue-50 cursor-pointer group"
              onClick={() => onOpen(m)}
            >
              <TypeBadge type={m.type} />
              <div className="flex-1 min-w-0 grid grid-cols-1 sm:grid-cols-12 gap-1 sm:gap-3 items-baseline">
                <div className="sm:col-span-5">
                  <div className="text-sm font-semibold text-blue-700 group-hover:underline truncate">
                    {m.brand} {m.strength}
                  </div>
                  <div className="text-[11px] text-slate-500 truncate">{m.company}</div>
                </div>
                <div className="sm:col-span-4 text-xs text-slate-700 truncate">
                  <span className="text-slate-400">Generic:</span> {m.generic}
                </div>
                <div className="sm:col-span-2 text-xs text-slate-700">
                  <span className="text-slate-400">Pack:</span>{" "}
                  <span className="font-medium">{m.price}</span>
                </div>
                <div className="sm:col-span-1 flex items-center justify-end gap-1">
                  <Warnings list={m.warnings} compact />
                </div>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  onFav(m.id)
                }}
                aria-label="Toggle favorite"
                className={`p-1 rounded hover:bg-amber-100 ${
                  favorites.includes(m.id) ? "text-amber-500" : "text-slate-300"
                }`}
              >
                <StarIcon filled={favorites.includes(m.id)} />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

function TypeBadge({ type }) {
  const colors = {
    Tablet: "bg-blue-100 text-blue-800",
    Capsule: "bg-emerald-100 text-emerald-800",
    Syrup: "bg-amber-100 text-amber-800",
    Suspension: "bg-orange-100 text-orange-800",
    Injection: "bg-rose-100 text-rose-800",
    Drops: "bg-indigo-100 text-indigo-800",
    Cream: "bg-pink-100 text-pink-800",
    Suppository: "bg-violet-100 text-violet-800",
    Infusion: "bg-red-100 text-red-800",
    Shampoo: "bg-teal-100 text-teal-800",
  }
  const cls = colors[type] || "bg-slate-100 text-slate-700"
  return (
    <span
      className={`flex-shrink-0 inline-flex items-center justify-center text-[10px] font-bold uppercase tracking-wide px-2 py-1 rounded w-20 ${cls}`}
    >
      {type}
    </span>
  )
}

function Warnings({ list, compact = false }) {
  if (!list || list.length === 0) return null
  const map = {
    Pregnancy: { color: "bg-amber-100 text-amber-800 border-amber-200", label: "Preg." },
    Liver: { color: "bg-rose-100 text-rose-800 border-rose-200", label: "Liver" },
    Kidney: { color: "bg-orange-100 text-orange-800 border-orange-200", label: "Kidney" },
  }
  return (
    <div className="flex gap-1 flex-wrap justify-end">
      {list.map((w) => {
        const m = map[w] || { color: "bg-slate-100 text-slate-700", label: w }
        return (
          <span
            key={w}
            className={`px-1.5 py-0.5 text-[9px] font-bold uppercase rounded border ${m.color}`}
            title={`${w} warning`}
          >
            {compact ? m.label : `${w} Warning`}
          </span>
        )
      })}
    </div>
  )
}

/* ----------------- Medicine Detail ----------------- */

function MedicineDetail({
  medicine: m,
  allMedicines,
  activeVariant,
  onVariantChange,
  isFav,
  onFav,
  onCopy,
  onBack,
  onOpenOther,
  copied,
}) {
  const variants = m.variants && m.variants.length > 0 ? m.variants : [{ label: `${m.strength} ${m.type}`, strength: m.strength, type: m.type }]
  const otherBrands = allMedicines.filter((x) => x.generic === m.generic && x.id !== m.id)
  const sections = [
    { key: "indication", label: "Indications", value: m.indication || m.usage },
    { key: "adultDose", label: "Adult Dose", value: m.adultDose || m.dosage },
    { key: "childDose", label: "Child Dose", value: m.childDose },
    { key: "renalDose", label: "Renal Dose", value: m.renalDose },
    { key: "administration", label: "Administration", value: m.administration },
    { key: "contraindications", label: "Contraindications", value: m.contraindications },
    { key: "precautions", label: "Precautions", value: m.precautions },
    { key: "pregnancy", label: "Pregnancy & Lactation", value: m.pregnancy },
    { key: "interactions", label: "Drug Interactions", value: m.interactions },
    { key: "adverse", label: "Adverse Effects", value: m.adverse || m.sideEffects },
    { key: "mechanism", label: "Mechanism of Action", value: m.mechanism },
    { key: "storage", label: "Storage Conditions", value: m.storage },
  ]

  return (
    <div className="space-y-3">
      {/* Top header */}
      <div className="bg-white border border-slate-200 rounded">
        <div className="flex items-center justify-between px-4 py-2 bg-slate-50 border-b border-slate-200">
          <button
            onClick={onBack}
            className="flex items-center gap-1 text-xs text-blue-700 hover:text-blue-900 font-medium"
          >
            <ArrowLeftIcon /> Back to results
          </button>
          <div className="flex items-center gap-1">
            <button
              onClick={onCopy}
              className="flex items-center gap-1 px-2 py-1 text-[11px] font-medium text-slate-700 border border-slate-300 rounded hover:bg-slate-100"
            >
              <CopyIcon /> {copied ? "Copied" : "Copy"}
            </button>
            <button
              onClick={onFav}
              className={`flex items-center gap-1 px-2 py-1 text-[11px] font-medium border rounded ${
                isFav
                  ? "bg-amber-50 border-amber-300 text-amber-700"
                  : "border-slate-300 text-slate-700 hover:bg-slate-100"
              }`}
            >
              <StarIcon filled={isFav} /> {isFav ? "Favorited" : "Favorite"}
            </button>
            <button
              onClick={() => window.print()}
              className="flex items-center gap-1 px-2 py-1 text-[11px] font-medium text-slate-700 border border-slate-300 rounded hover:bg-slate-100"
            >
              <PrintIcon /> Print
            </button>
          </div>
        </div>

        <div className="p-4">
          <div className="flex items-start justify-between gap-3 flex-wrap">
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap mb-1">
                <h1 className="text-2xl font-bold text-slate-900 leading-tight">
                  {m.brand} {variants[activeVariant]?.strength || m.strength}
                </h1>
                <Warnings list={m.warnings} />
              </div>
              <div className="text-sm text-blue-700 font-medium">{m.generic}</div>
              <div className="text-xs text-slate-600 mt-0.5">
                {m.company}
              </div>
            </div>
            <div className="text-right">
              <div className="text-xs uppercase tracking-wide text-slate-500">Unit Price</div>
              <div className="text-2xl font-bold text-slate-900 leading-none">{m.price}</div>
              <div className="text-[11px] text-slate-500 mt-1">{m.packSize}</div>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-3 pt-3 border-t border-slate-200">
            <Stat label="Type" value={variants[activeVariant]?.type || m.type} />
            <Stat label="Strength" value={variants[activeVariant]?.strength || m.strength} />
            <Stat label="Generic" value={m.generic} truncate />
            <Stat label="Pack" value={m.packSize} truncate />
          </div>
        </div>
      </div>

      {/* Dosage variants */}
      {variants.length > 1 && (
        <div className="bg-white border border-slate-200 rounded">
          <header className="px-4 py-2 bg-blue-50 border-b border-slate-200 text-[11px] font-bold uppercase tracking-wide text-blue-900">
            Available Dosage Forms
          </header>
          <div className="p-3 flex flex-wrap gap-2">
            {variants.map((v, i) => (
              <button
                key={i}
                onClick={() => onVariantChange(i)}
                className={`px-3 py-1.5 text-xs font-medium rounded border ${
                  i === activeVariant
                    ? "bg-blue-600 text-white border-blue-600"
                    : "bg-white text-slate-700 border-slate-300 hover:border-blue-400 hover:text-blue-700"
                }`}
              >
                {v.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Medical sections */}
      <div className="bg-white border border-slate-200 rounded">
        {sections
          .filter((s) => s.value)
          .map((s, idx, arr) => (
            <Section key={s.key} label={s.label} value={s.value} last={idx === arr.length - 1} />
          ))}
      </div>

      {/* Other brands */}
      {otherBrands.length > 0 && (
        <div className="bg-white border border-slate-200 rounded">
          <header className="px-4 py-2 bg-blue-50 border-b border-slate-200 text-[11px] font-bold uppercase tracking-wide text-blue-900">
            Other Brands of {m.generic}
          </header>
          <ul className="divide-y divide-slate-200">
            {otherBrands.map((o) => (
              <li
                key={o.id}
                onClick={() => onOpenOther(o)}
                className="flex items-center gap-3 px-4 py-2 hover:bg-blue-50 cursor-pointer"
              >
                <TypeBadge type={o.type} />
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-semibold text-blue-700 truncate">
                    {o.brand} {o.strength}
                  </div>
                  <div className="text-[11px] text-slate-500 truncate">{o.company}</div>
                </div>
                <div className="text-xs text-slate-700">{o.price}</div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}

function Stat({ label, value, truncate }) {
  return (
    <div>
      <div className="text-[10px] uppercase tracking-wide text-slate-500 font-semibold">
        {label}
      </div>
      <div className={`text-sm text-slate-900 font-medium ${truncate ? "truncate" : ""}`}>
        {value || "—"}
      </div>
    </div>
  )
}

function Section({ label, value, last }) {
  return (
    <div className={last ? "" : "border-b border-slate-200"}>
      <header className="px-4 py-1.5 bg-blue-50 border-b border-slate-200 text-[11px] font-bold uppercase tracking-wide text-blue-900">
        {label}
      </header>
      <div className="px-4 py-2.5 text-sm text-slate-800 leading-relaxed">{value}</div>
    </div>
  )
}

/* ----------------- Icons ----------------- */

function SearchIcon({ className = "" }) {
  return (
    <svg className={className} viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="9" cy="9" r="6" />
      <path d="M14 14l4 4" strokeLinecap="round" />
    </svg>
  )
}

function StarIcon({ filled }) {
  return (
    <svg
      className="h-4 w-4"
      viewBox="0 0 24 24"
      fill={filled ? "currentColor" : "none"}
      stroke="currentColor"
      strokeWidth="2"
      strokeLinejoin="round"
    >
      <polygon points="12 2 15 9 22 9.5 17 14.5 18.5 22 12 18 5.5 22 7 14.5 2 9.5 9 9 12 2" />
    </svg>
  )
}

function CopyIcon() {
  return (
    <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="9" y="9" width="13" height="13" rx="2" />
      <path d="M5 15V5a2 2 0 0 1 2-2h10" />
    </svg>
  )
}

function PrintIcon() {
  return (
    <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M6 9V3h12v6" />
      <rect x="4" y="9" width="16" height="8" rx="1" />
      <path d="M6 17h12v4H6z" />
    </svg>
  )
}

function ArrowLeftIcon() {
  return (
    <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M19 12H5M12 19l-7-7 7-7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}
