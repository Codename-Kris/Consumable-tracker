import React, { useState } from 'react'
import Modal from './Modal.jsx'

function statusPill(status) {
  const map = { Pending: 'pill-warn', Approved: 'pill-teal', Rejected: 'pill-danger', Issued: 'pill-success' }
  return <span className={`pill ${map[status] || 'pill-neutral'}`}>{status}</span>
}

export default function Approvals({ requests, onApprove, onReject }) {
  const [activeRequest, setActiveRequest] = useState(null)
  const [mode, setMode] = useState(null) // 'approve' | 'reject'
  const [comment, setComment] = useState('')

  const pending = requests.filter((r) => r.status === 'Pending')
  const resolved = requests
    .filter((r) => r.status !== 'Pending')
    .slice()
    .sort((a, b) => (a.dateRequested < b.dateRequested ? 1 : -1))

  function openAction(request, actionMode) {
    setActiveRequest(request)
    setMode(actionMode)
    setComment('')
  }

  function confirmAction() {
    if (!activeRequest) return
    if (mode === 'approve') onApprove(activeRequest.id, comment)
    else onReject(activeRequest.id, comment)
    setActiveRequest(null)
    setMode(null)
  }

  return (
    <div>
      <div className="page-header">
        <h1>Approval Workflow</h1>
        <p>Review pending requests, approve or reject them, and leave a comment for the requester.</p>
      </div>

      <div className="panel" style={{ marginBottom: 20 }}>
        <div className="panel-header">
          <span className="section-title" style={{ margin: 0 }}>Pending approval ({pending.length})</span>
        </div>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Date</th>
                <th>Requested by</th>
                <th>Department</th>
                <th>Item</th>
                <th>Qty</th>
                <th>Comments</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {pending.length === 0 ? (
                <tr><td colSpan={7}><div className="empty-state">No requests are waiting for approval.</div></td></tr>
              ) : pending.map((r) => (
                <tr key={r.id}>
                  <td className="muted">{r.dateRequested}</td>
                  <td style={{ fontWeight: 600 }}>{r.requestedBy}</td>
                  <td className="muted">{r.department}</td>
                  <td>{r.itemName}</td>
                  <td>{r.qty} {r.unit}</td>
                  <td className="muted">{r.comments || '—'}</td>
                  <td className="text-right">
                    <div className="row row-end">
                      <button className="btn btn-success btn-sm" onClick={() => openAction(r, 'approve')}>Approve</button>
                      <button className="btn btn-danger btn-sm" onClick={() => openAction(r, 'reject')}>Reject</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="panel">
        <div className="panel-header">
          <span className="section-title" style={{ margin: 0 }}>Resolved requests</span>
        </div>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Date</th>
                <th>Requested by</th>
                <th>Item</th>
                <th>Qty</th>
                <th>Status</th>
                <th>Approver comments</th>
              </tr>
            </thead>
            <tbody>
              {resolved.length === 0 ? (
                <tr><td colSpan={6}><div className="empty-state">No requests have been resolved yet.</div></td></tr>
              ) : resolved.map((r) => (
                <tr key={r.id}>
                  <td className="muted">{r.dateRequested}</td>
                  <td style={{ fontWeight: 600 }}>{r.requestedBy}</td>
                  <td>{r.itemName}</td>
                  <td>{r.qty} {r.unit}</td>
                  <td>{statusPill(r.status)}</td>
                  <td className="muted">{r.approverComments || '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {activeRequest && (
        <Modal title={mode === 'approve' ? 'Approve request' : 'Reject request'} onClose={() => setActiveRequest(null)}>
          <p className="muted" style={{ marginTop: 0, fontSize: 13.5 }}>
            {activeRequest.requestedBy} requested {activeRequest.qty} {activeRequest.unit} of <strong>{activeRequest.itemName}</strong>.
          </p>
          <div className="form-row">
            <label>{mode === 'approve' ? 'Approval comment (optional)' : 'Reason for rejection'}</label>
            <textarea
              rows={3}
              required={mode === 'reject'}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder={mode === 'approve' ? 'e.g. Approved - within department allocation' : 'e.g. Exceeds monthly allocation for this item'}
            />
          </div>
          <div className="row row-end">
            <button className="btn btn-outline" onClick={() => setActiveRequest(null)}>Cancel</button>
            <button
              className={mode === 'approve' ? 'btn btn-success' : 'btn btn-danger'}
              onClick={confirmAction}
              disabled={mode === 'reject' && !comment.trim()}
            >
              {mode === 'approve' ? 'Confirm approval' : 'Confirm rejection'}
            </button>
          </div>
        </Modal>
      )}
    </div>
  )
}
