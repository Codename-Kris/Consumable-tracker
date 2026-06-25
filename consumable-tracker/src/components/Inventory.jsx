import React, { useState } from 'react'
import Modal from './Modal.jsx'

const CATEGORIES = ['Stationery', 'Printing', 'Cleaning Supplies', 'Electrical', 'Other']

function emptyForm() {
  return { name: '', category: 'Stationery', unit: '', quantity: 0, minStock: 0, supplier: '' }
}

export default function Inventory({ items, canEdit, onAddItem, onUpdateItem, onDeleteItem }) {
  const [modalOpen, setModalOpen] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [form, setForm] = useState(emptyForm())
  const [search, setSearch] = useState('')

  const filtered = items.filter((i) =>
    i.name.toLowerCase().includes(search.toLowerCase()) ||
    i.category.toLowerCase().includes(search.toLowerCase())
  )

  function openAdd() {
    setEditingId(null)
    setForm(emptyForm())
    setModalOpen(true)
  }

  function openEdit(item) {
    setEditingId(item.id)
    setForm({ name: item.name, category: item.category, unit: item.unit, quantity: item.quantity, minStock: item.minStock, supplier: item.supplier })
    setModalOpen(true)
  }

  function handleSubmit(e) {
    e.preventDefault()
    if (!form.name.trim() || !form.unit.trim()) return
    const payload = { ...form, quantity: Number(form.quantity) || 0, minStock: Number(form.minStock) || 0 }
    if (editingId) onUpdateItem(editingId, payload)
    else onAddItem(payload)
    setModalOpen(false)
  }

  return (
    <div>
      <div className="page-header">
        <h1>Inventory Management</h1>
        <p>Track every consumable, its category, current stock and minimum threshold.</p>
      </div>

      <div className="row" style={{ marginBottom: 16 }}>
        <input
          placeholder="Search items or categories…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ flex: 1, maxWidth: 320, border: '1px solid var(--border)', borderRadius: 8, padding: '9px 12px', fontSize: 13.5 }}
        />
        <span className="spacer" />
        {canEdit && <button className="btn btn-primary" onClick={openAdd}>+ Add consumable</button>}
      </div>

      <div className="panel">
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Item</th>
                <th>Category</th>
                <th>Stock</th>
                <th>Minimum</th>
                <th>Supplier</th>
                <th>Status</th>
                {canEdit && <th></th>}
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={7}><div className="empty-state">No consumables match your search.</div></td></tr>
              ) : filtered.map((i) => {
                const low = i.quantity <= i.minStock
                return (
                  <tr key={i.id}>
                    <td style={{ fontWeight: 600 }}>{i.name}</td>
                    <td className="muted">{i.category}</td>
                    <td>{i.quantity} {i.unit}{i.quantity !== 1 ? 's' : ''}</td>
                    <td className="muted">{i.minStock} {i.unit}</td>
                    <td className="muted">{i.supplier || '—'}</td>
                    <td>
                      {low
                        ? <span className="pill pill-danger">Low stock</span>
                        : <span className="pill pill-success">Healthy</span>}
                    </td>
                    {canEdit && (
                      <td className="text-right">
                        <div className="row row-end">
                          <button className="btn btn-outline btn-sm" onClick={() => openEdit(i)}>Edit</button>
                          <button className="btn btn-danger btn-sm" onClick={() => onDeleteItem(i.id)}>Remove</button>
                        </div>
                      </td>
                    )}
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>

      {modalOpen && (
        <Modal title={editingId ? 'Edit consumable' : 'Add a new consumable'} onClose={() => setModalOpen(false)}>
          <form onSubmit={handleSubmit}>
            <div className="form-row">
              <label>Item name</label>
              <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="e.g. A4 Paper (Ream)" />
            </div>
            <div className="form-grid">
              <div className="form-row">
                <label>Category</label>
                <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
                  {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div className="form-row">
                <label>Unit of measure</label>
                <input required value={form.unit} onChange={(e) => setForm({ ...form, unit: e.target.value })} placeholder="e.g. ream, box, piece" />
              </div>
            </div>
            <div className="form-grid">
              <div className="form-row">
                <label>Current stock</label>
                <input type="number" min="0" value={form.quantity} onChange={(e) => setForm({ ...form, quantity: e.target.value })} />
              </div>
              <div className="form-row">
                <label>Minimum stock level</label>
                <input type="number" min="0" value={form.minStock} onChange={(e) => setForm({ ...form, minStock: e.target.value })} />
              </div>
            </div>
            <div className="form-row">
              <label>Supplier</label>
              <input value={form.supplier} onChange={(e) => setForm({ ...form, supplier: e.target.value })} placeholder="e.g. OfficeMart" />
            </div>
            <div className="row row-end">
              <button type="button" className="btn btn-outline" onClick={() => setModalOpen(false)}>Cancel</button>
              <button type="submit" className="btn btn-primary">{editingId ? 'Save changes' : 'Add item'}</button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  )
}
