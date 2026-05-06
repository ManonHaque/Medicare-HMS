export default function CompanyDashboard({ stats, recent }) {
  return (
    <div className="space-y-5">
      <div className="grid gap-3 md:grid-cols-4">
        <StatCard label="Total Medicines" value={stats.total} tone="blue" />
        <StatCard label="Approved Medicines" value={stats.approved} tone="green" />
        <StatCard label="Pending Medicines" value={stats.pending} tone="amber" />
        <StatCard label="Recently Updated" value={stats.recent} tone="indigo" />
      </div>

      <section className="bg-white border border-slate-200 rounded-lg">
        <header className="px-4 py-3 border-b border-slate-200 bg-slate-50">
          <div className="text-sm font-semibold text-slate-900">Recent Updates</div>
          <div className="text-xs text-slate-500">Latest changes across your portfolio</div>
        </header>
        <div className="divide-y divide-slate-200">
          {recent.length === 0 ? (
            <div className="p-6 text-sm text-slate-400">No recent updates yet.</div>
          ) : (
            recent.map((m) => (
              <div key={m.id} className="px-4 py-3 flex items-center justify-between">
                <div>
                  <div className="text-sm font-semibold text-slate-900">{m.brandName}</div>
                  <div className="text-xs text-slate-500">{m.genericName}</div>
                </div>
                <div className="text-right">
                  <div className="text-xs text-slate-500">{m.updatedAtLabel}</div>
                  <StatusBadge status={m.status} />
                </div>
              </div>
            ))
          )}
        </div>
      </section>
    </div>
  )
}

function StatCard({ label, value, tone }) {
  const styles = {
    blue: "bg-blue-50 text-blue-700",
    green: "bg-emerald-50 text-emerald-700",
    amber: "bg-amber-50 text-amber-700",
    indigo: "bg-indigo-50 text-indigo-700",
  }
  return (
    <div className="bg-white border border-slate-200 rounded-lg p-4">
      <div className="text-xs uppercase tracking-wide text-slate-500">{label}</div>
      <div className={`text-2xl font-semibold mt-1 ${styles[tone]}`}>{value}</div>
    </div>
  )
}

function StatusBadge({ status }) {
  const map = {
    Approved: "bg-emerald-50 text-emerald-700",
    Pending: "bg-amber-50 text-amber-700",
    Rejected: "bg-rose-50 text-rose-700",
  }
  return (
    <span className={`inline-flex px-2 py-0.5 rounded text-[11px] font-semibold ${map[status]}`}>
      {status}
    </span>
  )
}
