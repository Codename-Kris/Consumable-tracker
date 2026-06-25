import React from 'react'

const NAV = [
  { group: 'Overview', items: [
    { key: 'dashboard', label: 'Dashboard', icon: '◧' },
  ]},
  { group: 'Inventory', items: [
    { key: 'inventory', label: 'Inventory', icon: '▣' },
    { key: 'receipts', label: 'Stock Receipts', icon: '▤' },
  ]},
  { group: 'Requests', items: [
    { key: 'requests', label: 'My Requests', icon: '▥' },
    { key: 'approvals', label: 'Approvals', icon: '✓', roles: ['Super Administrator', 'Inventory Administrator', 'Department Manager'] },
    { key: 'issuance', label: 'Issuance', icon: '➜', roles: ['Super Administrator', 'Inventory Administrator'] },
  ]},
  { group: 'Insights', items: [
    { key: 'reports', label: 'Reports', icon: '▦' },
    { key: 'audit', label: 'Audit Trail', icon: '≡', roles: ['Super Administrator', 'Inventory Administrator'] },
  ]},
]

export default function Sidebar({ active, onNavigate, role }) {
  return (
    <aside className="sidebar">
      <div className="brand">
        <div className="brand-mark" />
        <div>
          <div className="brand-name">Consumable Tracker</div>
          <div className="brand-sub">Inventory &amp; requests</div>
        </div>
      </div>

      {NAV.map((group) => {
        const visibleItems = group.items.filter((it) => !it.roles || it.roles.includes(role))
        if (visibleItems.length === 0) return null
        return (
          <div key={group.group}>
            <div className="nav-group-label">{group.group}</div>
            {visibleItems.map((it) => (
              <button
                key={it.key}
                className={`nav-item ${active === it.key ? 'active' : ''}`}
                onClick={() => onNavigate(it.key)}
              >
                <span className="nav-icon">{it.icon}</span>
                {it.label}
              </button>
            ))}
          </div>
        )
      })}

      <div className="sidebar-footer">
        Consumable Tracker v1.0 · Local demo data
      </div>
    </aside>
  )
}
