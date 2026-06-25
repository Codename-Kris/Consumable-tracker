import React, { useState } from 'react'
import Modal from './Modal.jsx'

function statusPill(status) {
  const map = { Pending: 'pill-warn', Approved: 'pill-teal', Rejected: 'pill-danger', Issued: 'pill-success' }
  return <span className={`pill ${map[status] || 'pill-neutral'}`}>{status}</span>
}

export default function Requests({ items, requests, currentUser, onSubmitRequest, onCancelRequest }) {
  const [modalOpen, setModalOpen] = useState(false)
  const [form, setForm] = useState({ itemId: items[0]?.id || '', qty: 1, comments: '' })

  const myRequests = requests
    .filter((r) => r.requestedBy === currentUser.name)
    .slice()
    .sort((a, b) => (a.dateRequested < b.dateRequested ? 1 : -1))

  function handleSubmit(e) {
    e.preventDefault()
    if (!form.itemId || !form.qty) return
    onSubmitRequest({ itemId: form.itemId, qty: Number(form.qty), comments: form.comments })
    setModalOpen(false)
    setForm({ itemId: items[0]?.id || '', qty: 1, comments: '' })
  }

  return (
    <div>
      <div className="page-header">
        <h1>My Requests</h1>
        <p>Submit a request for consumables and track its approval status.</p>
      </div>

      <div className="row" style={{ marginBottom: 16 }}>
        <span className="spacer" />
        <button className="btn btn-primary" onClick={() => setModalOpen(true)}>+ New request</button>
      </div>

      <div className="panel">
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Date</th>
                <th>Item</th>
                <th>Qty</th>
                <th>Status</th>
                <th>Approver comments</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {myRequests.length === 0 ? (
                <tr><td colSpan={6}><div className="empty-state">You haven't submitted any requests yet.</div></td></tr>
              ) : myRequests.map((r) => (
                <tr key={r.id}>
                  <td className="muted">{r.dateRequested}</td>
                  <td style={{ fontWeight: 600 }}>{r.itemName}</td>
                  <td>{r.qty} {r.unit}</td>
                  <td>{statusPill(r.status)}</td>
                  <td className="muted">{r.approverComments || '—'}</td>
                  <td className="text-right">
                    {r.status === 'Pending' && (
                      <button className="btn btn-outline btn-sm" onClick={() => onCancelRequest(r.id)}>Cancel</button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {modalOpen && (
        <Modal title="Request a consumable" onClose={() => setModalOpen(false)}>
          <form onSubmit={handleSubmit}>
            <div className="form-row">
              <label>Item</label>
              <select value={form.itemId} onChange={(e) => setForm({ ...form, itemId: e.target.value })}>
                {items.map((i) => <option key={i.id} value={i.id}>{i.name} ({i.quantity} {i.unit} in stock)</option>)}
              </select>
            </div>
            <div className="form-row">
              <label>Quantity needed</label>
              <input type="number" min="1" required value={form.qty} onChange={(e) => setForm({ ...form, qty: e.target.value })} />
            </div>
            <div className="form-row">
              <label>Reason / comments (optional)</label>
              <textarea rows={3} value={form.comments} onChange={(e) => setForm({ ...form, comments: e.target.value })} placeholder="e.g. Needed for the client workshop on Friday" />
            </div>
            <div className="row row-end">
              <button type="button" className="btn btn-outline" onClick={() => setModalOpen(false)}>Cancel</button>
              <button type="submit" className="btn btn-primary">Submit request</button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  )
}
