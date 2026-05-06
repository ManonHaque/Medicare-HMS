export default function CompanyProfile({ company, stats }) {
  return (
    <div className="grid lg:grid-cols-[1.2fr_1fr] gap-5">
      <section className="bg-white border border-slate-200 rounded-lg p-4">
        <div className="text-sm font-semibold text-slate-900">Company Profile</div>
        <div className="text-xs text-slate-500">Registered pharmaceutical profile</div>

        <div className="mt-4 space-y-3 text-sm">
          <ProfileRow label="Company Name" value={company?.name || "Unknown"} />
          <ProfileRow label="Email" value={company?.email || "—"} />
          <ProfileRow label="Status" value="Active" />
          <ProfileRow label="Approval Flow" value="Super Admin review required" />
        </div>
      </section>

      <section className="bg-white border border-slate-200 rounded-lg p-4">
        <div className="text-sm font-semibold text-slate-900">Portfolio Summary</div>
        <div className="text-xs text-slate-500">Overview of current portfolio</div>
        <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
          <SummaryCard label="Total" value={stats.total} />
          <SummaryCard label="Approved" value={stats.approved} />
          <SummaryCard label="Pending" value={stats.pending} />
          <SummaryCard label="Rejected" value={stats.rejected} />
        </div>
      </section>
    </div>
  )
}

function ProfileRow({ label, value }) {
  return (
    <div className="flex items-center justify-between">
      <div className="text-xs uppercase tracking-wide text-slate-500">{label}</div>
      <div className="text-sm font-semibold text-slate-900 text-right">{value}</div>
    </div>
  )
}

function SummaryCard({ label, value }) {
  return (
    <div className="bg-slate-50 border border-slate-200 rounded p-3">
      <div className="text-xs uppercase tracking-wide text-slate-500">{label}</div>
      <div className="text-lg font-semibold text-slate-900 mt-1">{value}</div>
    </div>
  )
}
