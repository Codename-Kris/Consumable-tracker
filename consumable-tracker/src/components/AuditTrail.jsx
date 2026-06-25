import React from 'react'

export default function AuditTrail({ auditLog }) {
  const sorted = auditLog.slice().sort((a, b) => (a.date < b.date ? 1 : -1))

  return (
    <div>
      <div className="page-header">
        <h1>Audit Trail</h1>
        <p>A running log of every meaningful change made in the system, for accountability and review.</p>
      </div>

      <div className="panel">
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Date &amp; time</th>
                <th>Actor</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {sorted.length === 0 ? (
                <tr><td colSpan={3}><div className="empty-state">No activity has been recorded yet.</div></td></tr>
              ) : sorted.map((a) => (
                <tr key={a.id}>
                  <td className="muted">{new Date(a.date).toLocaleString()}</td>
                  <td style={{ fontWeight: 600 }}>{a.actor}</td>
                  <td>{a.action}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
