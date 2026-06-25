import React from 'react'

function StatCard({ label, value, sub, accent }) {
  return (
    <div className="card stat-card">
      <div className="stat-label">{label}</div>
      <div className="stat-value" style={accent ? { color: accent } : undefined}>{value}</div>
      {sub && <div className="stat-sub">{sub}</div>}
    </div>
  )
}

function statusPill(status) {
  const map = {
    Pending: 'pill-warn',
    Approved: 'pill-teal',
    Rejected: 'pill-danger',
    Issued: 'pill-success',
  }
  return <span className={`pill ${map[status] || 'pill-neutral'}`}>{status}</span>
}

export default function Dashboard({ items, requests, issuances }) {
  const lowStock = items.filter((i) => i.quantity <= i.minStock)
  const pending = requests.filter((r) => r.status === 'Pending')
  const totalUnits = items.reduce((s, i) => s + i.quantity, 0)

  const last30 = issuances.length // demo proxy for "consumption this period"

  const recentActivity = [
    ...requests.map((r) => ({ date: r.dateRequested, text: `${r.requestedBy} requested ${r.qty} ${r.unit} of ${r.itemName}`, status: r.status })),
    ...issuances.map((i) => ({ date: i.date, text: `${i.qty} ${i.unit} of ${i.itemName} issued to ${i.recipient}`, status: 'Issued' })),
  ].sort((a, b) => (a.date < b.date ? 1 : -1)).slice(0, 6)

  // simple consumption-by-department aggregate, based on requests
  const byDept = {}
  requests.forEach((r) => {
    byDept[r.department] = (byDept[r.department] || 0) + r.qty
  })
  const maxDept = Math.max(1, ...Object.values(byDept))

  return (
    <div>
      <div className="page-header">
        <h1>Welcome back</h1>
        <p>Here's what's happening with your consumables right now.</p>
      </div>

      <div className="grid grid-4" style={{ marginBottom: 18 }}>
        <StatCard label="Items tracked" value={items.length} sub={`${totalUnits} total units in stock`} />
        <StatCard label="Low stock alerts" value={lowStock.length} sub={lowStock.length ? 'Needs replenishment' : 'All items healthy'} accent={lowStock.length ? 'var(--danger)' : undefined} />
        <StatCard label="Pending requests" value={pending.length} sub="Awaiting approval" accent={pending.length ? 'var(--warn)' : undefined} />
        <StatCard label="Items issued" value={last30} sub="All-time issuance count" />
      </div>

      <div className="grid grid-2" style={{ alignItems: 'start' }}>
        <div className="panel">
          <div className="panel-header">
            <span className="section-title" style={{ margin: 0 }}>Low stock alerts</span>
          </div>
          <div className="panel-body" style={{ paddingTop: 6 }}>
            {lowStock.length === 0 ? (
              <div className="empty-state">No items are below their minimum stock level.</div>
            ) : (
              lowStock.map((i) => {
                const pct = Math.min(100, Math.round((i.quantity / Math.max(i.minStock, 1)) * 100))
                return (
                  <div key={i.id} style={{ marginBottom: 14 }}>
                    <div className="row" style={{ marginBottom: 6 }}>
                      <span style={{ fontSize: 13.5, fontWeight: 600 }}>{i.name}</span>
                      <span className="spacer" />
                      <span className="small muted">{i.quantity} / {i.minStock} {i.unit}</span>
                    </div>
                    <div className="progress-track">
                      <div className="progress-fill" style={{ width: `${pct}%`, background: pct < 50 ? 'var(--danger)' : 'var(--warn)' }} />
                    </div>
                  </div>
                )
              })
            )}
          </div>
        </div>

        <div className="panel">
          <div className="panel-header">
            <span className="section-title" style={{ margin: 0 }}>Recent activity</span>
          </div>
          <div className="panel-body" style={{ paddingTop: 6 }}>
            {recentActivity.length === 0 ? (
              <div className="empty-state">No activity yet.</div>
            ) : (
              recentActivity.map((a, i) => (
                <div key={i} className="row" style={{ padding: '9px 0', borderBottom: i < recentActivity.length - 1 ? '1px solid var(--border)' : 'none' }}>
                  <span style={{ fontSize: 13 }}>{a.text}</span>
                  <span className="spacer" />
                  {statusPill(a.status)}
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      <div className="panel" style={{ marginTop: 16 }}>
        <div className="panel-header">
          <span className="section-title" style={{ margin: 0 }}>Requests by department</span>
        </div>
        <div className="panel-body">
          {Object.keys(byDept).length === 0 ? (
            <div className="empty-state">No requests have been logged yet.</div>
          ) : (
            Object.entries(byDept).map(([dept, qty]) => (
              <div key={dept} style={{ marginBottom: 12 }}>
                <div className="row" style={{ marginBottom: 6 }}>
                  <span style={{ fontSize: 13.5, fontWeight: 600 }}>{dept}</span>
                  <span className="spacer" />
                  <span className="small muted">{qty} units requested</span>
                </div>
                <div className="progress-track">
                  <div className="progress-fill" style={{ width: `${(qty / maxDept) * 100}%`, background: 'var(--teal)' }} />
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
