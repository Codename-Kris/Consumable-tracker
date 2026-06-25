import React, { useState } from 'react'

const TITLES = {
  dashboard: 'Dashboard',
  inventory: 'Inventory Management',
  receipts: 'Stock Receipts',
  requests: 'My Requests',
  approvals: 'Approval Workflow',
  issuance: 'Inventory Issuance',
  reports: 'Reports',
  audit: 'Audit Trail',
}

function initials(name) {
  return name.split(' ').map((p) => p[0]).slice(0, 2).join('').toUpperCase()
}

export default function Topbar({ active, users, currentUser, onSwitchUser, notifications }) {
  const [open, setOpen] = useState(false)

  return (
    <header className="topbar">
      <div className="topbar-title">{TITLES[active] || ''}</div>
      <div className="topbar-right">
        <div style={{ position: 'relative' }}>
          <button className="bell-btn" onClick={() => setOpen((o) => !o)} aria-label="Notifications">
            🔔
            {notifications.length > 0 && <span className="bell-dot">{notifications.length}</span>}
          </button>
          {open && (
            <div className="notif-list">
              {notifications.length === 0 ? (
                <div className="notif-item muted">No notifications right now.</div>
              ) : (
                notifications.map((n, i) => (
                  <div className="notif-item" key={i}>
                    <div className="notif-title">{n.title}</div>
                    <div className="muted">{n.body}</div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>

        <div className="role-switcher">
          <select value={currentUser.id} onChange={(e) => onSwitchUser(e.target.value)}>
            {users.map((u) => (
              <option key={u.id} value={u.id}>{u.name} — {u.role}</option>
            ))}
          </select>
        </div>

        <div className="avatar">{initials(currentUser.name)}</div>
      </div>
    </header>
  )
}
