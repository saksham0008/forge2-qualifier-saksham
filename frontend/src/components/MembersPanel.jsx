import React, { useState, useEffect } from 'react'
import { getMembers, createMember, addMember } from '../api'

export default function MembersPanel({ board, onClose }) {
  const [all, setAll]     = useState([])
  const [name, setName]   = useState('')
  const [email, setEmail] = useState('')
  const [adding, setAdding] = useState(false)

  useEffect(() => { getMembers().then(r => setAll(r.data)) }, [])

  const handleCreate = async (e) => {
    e.preventDefault()
    if (!name.trim() || !email.trim()) return
    const res = await createMember({ name, email })
    setAll(a => [...a, res.data])
    await addMember(board.id, res.data.id)
    setName(''); setEmail(''); setAdding(false)
    onClose()
  }

  const handleAdd = async (memberId) => {
    await addMember(board.id, memberId)
    onClose()
  }

  const boardMemberIds = board.members?.map(m => m.id) ?? []

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <h2>Board Members</h2>
        <p style={{ fontSize: 13, color: '#94a3b8', marginBottom: 12 }}>Current: {board.members?.map(m => m.name).join(', ') || 'none'}</p>

        <p style={{ fontSize: 13, fontWeight: 600, marginBottom: 8 }}>Add existing member:</p>
        {all.filter(m => !boardMemberIds.includes(m.id)).map(m => (
          <div key={m.id} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
            <span style={{ fontSize: 14 }}>{m.name} <span style={{ color: '#64748b', fontSize: 12 }}>{m.email}</span></span>
            <button className="btn-primary" style={{ padding: '3px 10px', fontSize: 12 }} onClick={() => handleAdd(m.id)}>Add</button>
          </div>
        ))}

        <hr style={{ border: 'none', borderTop: '1px solid #334155', margin: '16px 0' }} />

        {adding ? (
          <form onSubmit={handleCreate}>
            <div className="form-row">
              <label>Name</label>
              <input value={name} onChange={e => setName(e.target.value)} placeholder="Alex Smith" />
            </div>
            <div className="form-row">
              <label>Email</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="alex@example.com" />
            </div>
            <div className="form-actions">
              <button type="button" className="btn-ghost" onClick={() => setAdding(false)}>Cancel</button>
              <button type="submit" className="btn-primary">Create & Add</button>
            </div>
          </form>
        ) : (
          <button className="btn-primary" onClick={() => setAdding(true)}>+ Create new member</button>
        )}

        <div style={{ marginTop: 16 }}>
          <button className="btn-ghost" onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  )
}
