import React, { useState } from 'react'

const TABS = [
  { key: 'inventory', label: 'Inventory balances' },
  { key: 'consumption', label: 'Consumption' },
  { key: 'department', label: 'By department' },
  { key: 'reorder', label: 'Reorder' },
]

function toCSV(rows, headers) {
  const escape = (v) => `"${String(v).replace(/"/g, '""')}"`
  const lines = [headers.map(escape).join(',')]
  rows.forEach((r) => lines.push(headers.map((h) => escape(r[h] ?? '')).join(',')))
  return lines.join('\n')
}

function download(filename, text) {
  const blob = new Blob([text], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  a.remove()
  URL.revokeObjectURL(url)
}

export default function Reports({ items, requests, issuances }) {
  const [tab, setTab] = useState('inventory')

  const consumptionByItem = {}
  issuances.forEach((i) => { consumptionByItem[i.itemName] = (consumptionByItem[i.itemName] || 0) + i.qty })
  const consumptionRows = Object.entries(consumptionByItem)
    .map(([name, qty]) => ({ Item: name, 'Total issued': qty }))
    .sort((a, b) => b['Total issued'] - a['Total issued'])

  const byDept = {}
  requests.forEach((r) => {
    byDept[r.department] = byDept[r.department] || { requests: 0, units: 0, approved: 0 }
    byDept[r.department].requests += 1
    byDept[r.department].units += r.qty
    if (r.status === 'Approved' || r.status === 'Issued') byDept[r.department].approved += 1
  })
  const deptRows = Object.entries(byDept).map(([dept, v]) => ({
    Department: dept, 'Requests submitted': v.requests, 'Units requested': v.units, 'Requests approved': v.approved,
  }))

  const reorderRows = items
    .filter((i) => i.quantity <= i.minStock)
    .map((i) => ({
      Item: i.name, 'Current stock': i.quantity, 'Minimum stock': i.minStock,
      'Suggested reorder qty': Math.max(i.minStock * 2 - i.quantity, i.minStock),
      Supplier: i.supplier || '—',
    }))

  const inventoryRows = items.map((i) => ({
    Item: i.name, Category: i.category, 'Current stock': i.quantity, Unit: i.unit,
    'Minimum stock': i.minStock, Status: i.quantity <= i.minStock ? 'Low stock' : 'Healthy', Supplier: i.supplier || '—',
  }))

  function exportCSV() {
    const map = {
      inventory: { rows: inventoryRows, name: 'inventory-balances.csv' },
      consumption: { rows: consumptionRows, name: 'consumption-report.csv' },
      department: { rows: deptRows, name: 'department-report.csv' },
      reorder: { rows: reorderRows, name: 'reorder-report.csv' },
    }
    const { rows, name } = map[tab]
    if (rows.length === 0) return
    download(name, toCSV(rows, Object.keys(rows[0])))
  }

  const activeRows = { inventory: inventoryRows, consumption: consumptionRows, department: deptRows, reorder: reorderRows }[tab]
  const headers = activeRows.length ? Object.keys(activeRows[0]) : []

  return (
    <div>
      <div className="page-header">
        <h1>Reports</h1>
        <p>Inventory balances, consumption trends, department usage and reorder recommendations.</p>
      </div>

      <div className="row" style={{ marginBottom: 16 }}>
        <div className="row" style={{ gap: 6 }}>
          {TABS.map((t) => (
            <button
              key={t.key}
              className={`btn btn-sm ${tab === t.key ? 'btn-primary' : 'btn-outline'}`}
              onClick={() => setTab(t.key)}
            >
              {t.label}
            </button>
          ))}
        </div>
        <span className="spacer" />
        <button className="btn btn-outline" onClick={exportCSV} disabled={activeRows.length === 0}>⬇ Export CSV</button>
      </div>

      <div className="panel">
        <div className="table-wrap">
          <table>
            <thead>
              <tr>{headers.map((h) => <th key={h}>{h}</th>)}</tr>
            </thead>
            <tbody>
              {activeRows.length === 0 ? (
                <tr><td colSpan={headers.length || 1}><div className="empty-state">No data available for this report yet.</div></td></tr>
              ) : activeRows.map((row, idx) => (
                <tr key={idx}>
                  {headers.map((h) => (
                    <td key={h} style={h === 'Status' && row[h] === 'Low stock' ? { color: 'var(--danger)', fontWeight: 600 } : undefined}>
                      {row[h]}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
