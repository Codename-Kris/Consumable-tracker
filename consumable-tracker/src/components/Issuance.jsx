import React, { useState } from 'react'
import Modal from './Modal.jsx'

export default function Issuance({ requests, issuances, currentUser, onIssue }) {
  const [activeRequest, setActiveRequest] = useState(null)
  const [recipient, setRecipient] = useState('')

  const readyToIssue = requests.filter((r) => r.status === 'Approved')
  const history = issuances.slice().sort((a, b) => (a.date < b.date ? 1 : -1))

  function openIssue(request) {
    setActiveRequest(request)
    setRecipient(request.requestedBy)
  }

  function confirmIssue() {
    if (!activeRequest || !recipient.trim()) return
    onIssue(activeRequest.id, recipient.trim(), currentUser.name)
    setActiveRequest(null)
  }

  return (
    <div>
      <div className="page-header">
        <h1>Inventory Issuance</h1>
        <p>Hand over approved items to the requester and keep a record of who issued what, to whom, and when.</p>
      </div>

      <div className="panel" style={{ marginBottom: 20 }}>
        <div className="panel-header">
          <span className="section-title" style={{ margin: 0 }}>Approved — ready to issue ({readyToIssue.length})</span>
        </div>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Date approved</th>
                <th>Requested by</th>
                <th>Department</th>
                <th>Item</th>
                <th>Qty</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {readyToIssue.length === 0 ? (
                <tr><td colSpan={6}><div className="empty-state">No approved requests are waiting to be issued.</div></td></tr>
              ) : readyToIssue.map((r) => (
                <tr key={r.id}>
                  <td className="muted">{r.dateRequested}</td>
                  <td style={{ fontWeight: 600 }}>{r.requestedBy}</td>
                  <td className="muted">{r.department}</td>
                  <td>{r.itemName}</td>
                  <td>{r.qty} {r.unit}</td>
                  <td className="text-right">
                    <button className="btn btn-teal btn-sm" onClick={() => openIssue(r)}>Issue item</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="panel">
        <div className="panel-header">
          <span className="section-title" style={{ margin: 0 }}>Issuance history</span>
        </div>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Date</th>
                <th>Item</th>
                <th>Qty</th>
                <th>Recipient</th>
                <th>Issued by</th>
              </tr>
            </thead>
            <tbody>
              {history.length === 0 ? (
                <tr><td colSpan={5}><div className="empty-state">Nothing has been issued yet.</div></td></tr>
              ) : history.map((h) => (
                <tr key={h.id}>
                  <td className="muted">{h.date}</td>
                  <td style={{ fontWeight: 600 }}>{h.itemName}</td>
                  <td>{h.qty} {h.unit}</td>
                  <td>{h.recipient}</td>
                  <td className="muted">{h.issuer}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {activeRequest && (
        <Modal title="Confirm issuance" onClose={() => setActiveRequest(null)}>
          <p className="muted" style={{ marginTop: 0, fontSize: 13.5 }}>
            Issuing {activeRequest.qty} {activeRequest.unit} of <strong>{activeRequest.itemName}</strong>.
          </p>
          <div className="form-row">
            <label>Recipient</label>
            <input value={recipient} onChange={(e) => setRecipient(e.target.value)} />
          </div>
          <div className="form-row">
            <label>Issued by</label>
            <input value={currentUser.name} disabled />
          </div>
          <div className="row row-end">
            <button className="btn btn-outline" onClick={() => setActiveRequest(null)}>Cancel</button>
            <button className="btn btn-teal" onClick={confirmIssue} disabled={!recipient.trim()}>Confirm issuance</button>
          </div>
        </Modal>
      )}
    </div>
  )
}
