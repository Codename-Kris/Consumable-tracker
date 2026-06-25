import React, { useState } from 'react'
import Modal from './Modal.jsx'

export default function Receipts({ items, receipts, canEdit, onReceiveStock }) {
  const [modalOpen, setModalOpen] = useState(false)
  const [form, setForm] = useState({ itemId: items[0]?.id || '', qty: '', supplier: '' })

  function handleSubmit(e) {
    e.preventDefault()
    if (!form.itemId || !form.qty) return
    onReceiveStock(form.itemId, Number(form.qty), form.supplier)
    setModalOpen(false)
    setForm({ itemId: items[0]?.id || '', qty: '', supplier: '' })
  }

  return (
    <div>
      <div className="page-header">
        <h1>Stock Receipts</h1>
        <p>Record consumables coming into the store and keep a history of every delivery.</p>
      </div>

      <div className="row" style={{ marginBottom: 16 }}>
        <span className="spacer" />
        {canEdit && <button className="btn btn-primary" onClick={() => setModalOpen(true)}>+ Record stock received</button>}
      </div>

      <div className="panel">
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Date</th>
                <th>Item</th>
                <th>Quantity received</th>
                <th>Supplier</th>
              </tr>
            </thead>
            <tbody>
              {receipts.length === 0 ? (
                <tr><td colSpan={4}><div className="empty-state">No stock receipts recorded yet.</div></td></tr>
              ) : receipts.slice().reverse().map((r) => (
                <tr key={r.id}>
                  <td className="muted">{r.date}</td>
                  <td style={{ fontWeight: 600 }}>{r.itemName}</td>
                  <td>+{r.qty}</td>
                  <td className="muted">{r.supplier || '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {modalOpen && (
        <Modal title="Record stock received" onClose={() => setModalOpen(false)}>
          <form onSubmit={handleSubmit}>
            <div className="form-row">
              <label>Item</label>
              <select value={form.itemId} onChange={(e) => setForm({ ...form, itemId: e.target.value })}>
                {items.map((i) => <option key={i.id} value={i.id}>{i.name}</option>)}
              </select>
            </div>
            <div className="form-row">
              <label>Quantity received</label>
              <input type="number" min="1" required value={form.qty} onChange={(e) => setForm({ ...form, qty: e.target.value })} />
            </div>
            <div className="form-row">
              <label>Supplier</label>
              <input value={form.supplier} onChange={(e) => setForm({ ...form, supplier: e.target.value })} placeholder="e.g. OfficeMart" />
            </div>
            <div className="row row-end">
              <button type="button" className="btn btn-outline" onClick={() => setModalOpen(false)}>Cancel</button>
              <button type="submit" className="btn btn-primary">Add to stock</button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  )
}
