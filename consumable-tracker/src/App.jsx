import React, { useMemo, useState } from 'react'
import { db } from './data/store.js'
import Sidebar from './components/Sidebar.jsx'
import Topbar from './components/Topbar.jsx'
import Dashboard from './components/Dashboard.jsx'
import Inventory from './components/Inventory.jsx'
import Receipts from './components/Receipts.jsx'
import Requests from './components/Requests.jsx'
import Approvals from './components/Approvals.jsx'
import Issuance from './components/Issuance.jsx'
import Reports from './components/Reports.jsx'
import AuditTrail from './components/AuditTrail.jsx'

const CAN_EDIT_INVENTORY = ['Super Administrator', 'Inventory Administrator']
const CAN_APPROVE = ['Super Administrator', 'Inventory Administrator', 'Department Manager']
const CAN_ISSUE = ['Super Administrator', 'Inventory Administrator']
const CAN_SEE_AUDIT = ['Super Administrator', 'Inventory Administrator']

export default function App() {
  const [state, setState] = useState(() => db.load())
  const [active, setActive] = useState('dashboard')

  const currentUser = state.users.find((u) => u.id === state.currentUserId) || state.users[0]

  function persist(next) {
    db.save(next)
    setState(next)
  }

  function logAction(action, base = state) {
    const entry = { id: db.uid('aud'), date: new Date().toISOString(), actor: currentUser.name, action }
    return { ...base, auditLog: [...base.auditLog, entry] }
  }

  // ---------- Inventory ----------
  function addItem(payload) {
    const item = { id: db.uid('itm'), ...payload }
    let next = { ...state, items: [...state.items, item] }
    next = logAction(`Added new consumable "${item.name}" to inventory`, next)
    persist(next)
  }

  function updateItem(id, payload) {
    let next = { ...state, items: state.items.map((i) => (i.id === id ? { ...i, ...payload } : i)) }
    next = logAction(`Updated consumable "${payload.name}"`, next)
    persist(next)
  }

  function deleteItem(id) {
    const item = state.items.find((i) => i.id === id)
    let next = { ...state, items: state.items.filter((i) => i.id !== id) }
    if (item) next = logAction(`Removed consumable "${item.name}" from inventory`, next)
    persist(next)
  }

  // ---------- Stock receipts ----------
  function receiveStock(itemId, qty, supplier) {
    const item = state.items.find((i) => i.id === itemId)
    if (!item) return
    const receipt = { id: db.uid('rcp'), itemId, itemName: item.name, qty, supplier, date: db.today() }
    let next = {
      ...state,
      items: state.items.map((i) => (i.id === itemId ? { ...i, quantity: i.quantity + qty, supplier: supplier || i.supplier } : i)),
      receipts: [...state.receipts, receipt],
    }
    next = logAction(`Received ${qty} ${item.unit}(s) of "${item.name}" from ${supplier || 'unspecified supplier'}`, next)
    persist(next)
  }

  // ---------- Requests ----------
  function submitRequest({ itemId, qty, comments }) {
    const item = state.items.find((i) => i.id === itemId)
    if (!item) return
    const request = {
      id: db.uid('req'), itemId, itemName: item.name, qty, unit: item.unit,
      requestedBy: currentUser.name, department: currentUser.department,
      dateRequested: db.today(), status: 'Pending', comments: comments || '', approverComments: '',
    }
    let next = { ...state, requests: [...state.requests, request] }
    next = logAction(`Submitted a request for ${qty} ${item.unit}(s) of "${item.name}"`, next)
    persist(next)
  }

  function cancelRequest(id) {
    const request = state.requests.find((r) => r.id === id)
    let next = { ...state, requests: state.requests.filter((r) => r.id !== id) }
    if (request) next = logAction(`Cancelled request for "${request.itemName}"`, next)
    persist(next)
  }

  function approveRequest(id, comment) {
    let next = {
      ...state,
      requests: state.requests.map((r) => (r.id === id ? { ...r, status: 'Approved', approverComments: comment } : r)),
    }
    const request = state.requests.find((r) => r.id === id)
    if (request) next = logAction(`Approved request from ${request.requestedBy} for "${request.itemName}"`, next)
    persist(next)
  }

  function rejectRequest(id, comment) {
    let next = {
      ...state,
      requests: state.requests.map((r) => (r.id === id ? { ...r, status: 'Rejected', approverComments: comment } : r)),
    }
    const request = state.requests.find((r) => r.id === id)
    if (request) next = logAction(`Rejected request from ${request.requestedBy} for "${request.itemName}"`, next)
    persist(next)
  }

  // ---------- Issuance ----------
  function issueItem(requestId, recipient, issuer) {
    const request = state.requests.find((r) => r.id === requestId)
    if (!request) return
    const issuance = {
      id: db.uid('iss'), requestId, itemId: request.itemId, itemName: request.itemName,
      qty: request.qty, unit: request.unit, recipient, issuer, date: db.today(),
    }
    let next = {
      ...state,
      requests: state.requests.map((r) => (r.id === requestId ? { ...r, status: 'Issued' } : r)),
      issuances: [...state.issuances, issuance],
      items: state.items.map((i) => (i.id === request.itemId ? { ...i, quantity: Math.max(0, i.quantity - request.qty) } : i)),
    }
    next = logAction(`Issued ${request.qty} ${request.unit}(s) of "${request.itemName}" to ${recipient}`, next)
    persist(next)
  }

  function switchUser(userId) {
    persist({ ...state, currentUserId: userId })
    setActive('dashboard')
  }

  const notifications = useMemo(() => {
    const list = []
    const lowStock = state.items.filter((i) => i.quantity <= i.minStock)
    lowStock.forEach((i) => list.push({ title: 'Low stock', body: `${i.name} is at ${i.quantity} ${i.unit}(s), below the minimum of ${i.minStock}.` }))
    if (CAN_APPROVE.includes(currentUser.role)) {
      const pending = state.requests.filter((r) => r.status === 'Pending')
      if (pending.length > 0) list.push({ title: 'Approvals waiting', body: `${pending.length} request(s) are waiting for your review.` })
    }
    const myUpdates = state.requests.filter((r) => r.requestedBy === currentUser.name && (r.status === 'Approved' || r.status === 'Rejected'))
    myUpdates.slice(-3).forEach((r) => list.push({ title: `Request ${r.status.toLowerCase()}`, body: `Your request for "${r.itemName}" was ${r.status.toLowerCase()}.` }))
    return list
  }, [state, currentUser])

  function renderPage() {
    switch (active) {
      case 'dashboard':
        return <Dashboard items={state.items} requests={state.requests} issuances={state.issuances} />
      case 'inventory':
        return (
          <Inventory
            items={state.items}
            canEdit={CAN_EDIT_INVENTORY.includes(currentUser.role)}
            onAddItem={addItem}
            onUpdateItem={updateItem}
            onDeleteItem={deleteItem}
          />
        )
      case 'receipts':
        return (
          <Receipts
            items={state.items}
            receipts={state.receipts}
            canEdit={CAN_EDIT_INVENTORY.includes(currentUser.role)}
            onReceiveStock={receiveStock}
          />
        )
      case 'requests':
        return (
          <Requests
            items={state.items}
            requests={state.requests}
            currentUser={currentUser}
            onSubmitRequest={submitRequest}
            onCancelRequest={cancelRequest}
          />
        )
      case 'approvals':
        return CAN_APPROVE.includes(currentUser.role)
          ? <Approvals requests={state.requests} onApprove={approveRequest} onReject={rejectRequest} />
          : <AccessDenied />
      case 'issuance':
        return CAN_ISSUE.includes(currentUser.role)
          ? <Issuance requests={state.requests} issuances={state.issuances} currentUser={currentUser} onIssue={issueItem} />
          : <AccessDenied />
      case 'reports':
        return <Reports items={state.items} requests={state.requests} issuances={state.issuances} />
      case 'audit':
        return CAN_SEE_AUDIT.includes(currentUser.role)
          ? <AuditTrail auditLog={state.auditLog} />
          : <AccessDenied />
      default:
        return null
    }
  }

  return (
    <div className="app-shell">
      <Sidebar active={active} onNavigate={setActive} role={currentUser.role} />
      <div className="main">
        <Topbar
          active={active}
          users={state.users}
          currentUser={currentUser}
          onSwitchUser={switchUser}
          notifications={notifications}
        />
        <div className="content">
          {renderPage()}
        </div>
      </div>
    </div>
  )
}

function AccessDenied() {
  return (
    <div className="panel">
      <div className="panel-body">
        <div className="empty-state">Your current role doesn't have access to this page. Switch roles from the top bar to see how it looks for an administrator or manager.</div>
      </div>
    </div>
  )
}
