import React, { useState, useEffect } from 'react'
import { getBoard, updateCard, deleteCard, syncCardTags, createComment, deleteComment, getTags, getMembers, createTag } from '../api'
import api from '../api'

export default function CardModal({ cardId, board, onClose }) {
  const [card, setCard]       = useState(null)
  const [tags, setTags]       = useState([])
  const [members, setMembers] = useState([])
  const [comment, setComment] = useState('')
  const [commentMember, setCommentMember] = useState('')
  const [newTag, setNewTag]   = useState({ name: '', color: '#6366f1' })
  const [addingTag, setAddingTag] = useState(false)

  const loadCard = async () => {
    const res = await api.get(`/cards/${cardId}`)
    setCard(res.data)
  }

  useEffect(() => {
    loadCard()
    getTags().then(r => setTags(r.data))
    getMembers().then(r => setMembers(r.data))
  }, [cardId])

  const save = async (field, value) => {
    await updateCard(card.id, { [field]: value })
    loadCard()
  }

  const handleDeleteCard = async () => {
    if (!window.confirm('Delete this card?')) return
    await deleteCard(card.id)
    onClose()
  }

  const toggleTag = async (tagId) => {
    const current = card.tags.map(t => t.id)
    const next = current.includes(tagId)
      ? current.filter(id => id !== tagId)
      : [...current, tagId]
    await syncCardTags(card.id, next)
    loadCard()
  }

  const handleAddTag = async (e) => {
    e.preventDefault()
    const res = await createTag(newTag)
    setTags(t => [...t, res.data])
    await syncCardTags(card.id, [...card.tags.map(t => t.id), res.data.id])
    setNewTag({ name: '', color: '#6366f1' })
    setAddingTag(false)
    loadCard()
  }

  const handleComment = async (e) => {
    e.preventDefault()
    if (!comment.trim() || !commentMember) return
    await createComment(card.id, { member_id: commentMember, body: comment })
    setComment('')
    loadCard()
  }

  const handleDeleteComment = async (cid) => {
    await deleteComment(card.id, cid)
    loadCard()
  }

  if (!card) return null

  const overdue = card.is_overdue

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" style={{ width: 560 }} onClick={e => e.stopPropagation()}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <h2 style={{ flex: 1 }}>
            <input
              defaultValue={card.title}
              style={{ fontSize: 18, fontWeight: 600, background: 'transparent', border: 'none', borderBottom: '1px solid #334155', borderRadius: 0, padding: '2px 0', width: '100%' }}
              onBlur={e => save('title', e.target.value)}
            />
          </h2>
          <button className="btn-danger" style={{ marginLeft: 8 }} onClick={handleDeleteCard}>Delete</button>
          <button className="btn-ghost" style={{ marginLeft: 4 }} onClick={onClose}>✕</button>
        </div>

        {overdue && <p style={{ color: '#f87171', fontSize: 13, marginTop: 4 }}>⚠ Overdue</p>}

        <div className="form-row" style={{ marginTop: 16 }}>
          <label>Description</label>
          <textarea
            rows={3}
            defaultValue={card.description || ''}
            onBlur={e => save('description', e.target.value)}
          />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <div className="form-row">
            <label>Due date</label>
            <input
              type="date"
              defaultValue={card.due_date || ''}
              onBlur={e => save('due_date', e.target.value || null)}
            />
          </div>

          <div className="form-row">
            <label>Assign member</label>
            <select
              value={card.assigned_member_id || ''}
              onChange={e => save('assigned_member_id', e.target.value || null)}
            >
              <option value="">— unassigned —</option>
              {members.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
            </select>
          </div>
        </div>

        <div className="form-row">
          <label>Tags</label>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
            {tags.map(t => {
              const active = card.tags.some(ct => ct.id === t.id)
              return (
                <span
                  key={t.id}
                  onClick={() => toggleTag(t.id)}
                  style={{
                    padding: '3px 10px', borderRadius: 12, cursor: 'pointer',
                    background: active ? t.color : 'transparent',
                    border: `2px solid ${t.color}`,
                    color: active ? '#fff' : t.color,
                    fontSize: 12, fontWeight: 500
                  }}
                >{t.name}</span>
              )
            })}
            {addingTag ? (
              <form onSubmit={handleAddTag} style={{ display: 'flex', gap: 6 }}>
                <input value={newTag.name} onChange={e => setNewTag(n => ({ ...n, name: e.target.value }))} placeholder="Tag name" style={{ width: 100 }} />
                <input type="color" value={newTag.color} onChange={e => setNewTag(n => ({ ...n, color: e.target.value }))} style={{ width: 36, padding: 2 }} />
                <button type="submit" className="btn-primary">+</button>
                <button type="button" className="btn-ghost" onClick={() => setAddingTag(false)}>✕</button>
              </form>
            ) : (
              <button className="btn-ghost" style={{ fontSize: 12 }} onClick={() => setAddingTag(true)}>+ new tag</button>
            )}
          </div>
        </div>

        <div className="form-row" style={{ marginTop: 12 }}>
          <label>Comments ({card.comments?.length ?? 0})</label>
          {card.comments?.map(c => (
            <div key={c.id} style={{ background: '#0f172a', borderRadius: 6, padding: '8px 12px', marginBottom: 6 }}>
              <span style={{ fontWeight: 600, fontSize: 13 }}>{c.member?.name}</span>
              <span style={{ color: '#64748b', fontSize: 11, marginLeft: 8 }}>{c.created_at?.slice(0,10)}</span>
              <p style={{ fontSize: 13, marginTop: 4 }}>{c.body}</p>
              <button className="btn-ghost" style={{ fontSize: 11, marginTop: 4, color: '#ef4444' }} onClick={() => handleDeleteComment(c.id)}>delete</button>
            </div>
          ))}
          <form onSubmit={handleComment} style={{ display: 'flex', flexDirection: 'column', gap: 6, marginTop: 4 }}>
            <select value={commentMember} onChange={e => setCommentMember(e.target.value)}>
              <option value="">Post as…</option>
              {members.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
            </select>
            <div style={{ display: 'flex', gap: 6 }}>
              <input value={comment} onChange={e => setComment(e.target.value)} placeholder="Write a comment…" />
              <button type="submit" className="btn-primary">Post</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
