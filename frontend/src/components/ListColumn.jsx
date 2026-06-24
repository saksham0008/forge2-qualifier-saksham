import React, { useState } from 'react'
import { Draggable } from '@hello-pangea/dnd'
import { createCard } from '../api'
import CardItem from './CardItem'

export default function ListColumn({ list, provided, board, onRefresh, onOpenCard, onDeleteList }) {
  const [adding, setAdding] = useState(false)
  const [title, setTitle]   = useState('')

  const handleAdd = async (e) => {
    e.preventDefault()
    if (!title.trim()) return
    await createCard(list.id, { title: title.trim(), position: list.cards.length })
    setTitle('')
    setAdding(false)
    onRefresh()
  }

  return (
    <div className="list-col">
      <div className="list-header">
        <h3>{list.name}</h3>
        <button className="btn-ghost" style={{ fontSize: 12, padding: '2px 6px', color: '#ef4444' }} onClick={onDeleteList}>✕</button>
      </div>

      <div
        className="cards-area"
        ref={provided.innerRef}
        {...provided.droppableProps}
      >
        {list.cards.map((card, i) => (
          <Draggable draggableId={String(card.id)} index={i} key={card.id}>
            {(drag) => (
              <CardItem card={card} drag={drag} onClick={() => onOpenCard(card.id)} />
            )}
          </Draggable>
        ))}
        {provided.placeholder}
      </div>

      {adding ? (
        <form onSubmit={handleAdd} style={{ marginTop: 8 }}>
          <input autoFocus value={title} onChange={e => setTitle(e.target.value)} placeholder="Card title" />
          <div style={{ display: 'flex', gap: 6, marginTop: 6 }}>
            <button type="submit" className="btn-primary" style={{ flex: 1 }}>Add</button>
            <button type="button" className="btn-ghost" onClick={() => setAdding(false)}>✕</button>
          </div>
        </form>
      ) : (
        <button className="btn-ghost" style={{ marginTop: 8, width: '100%', textAlign: 'left' }} onClick={() => setAdding(true)}>
          + Add card
        </button>
      )}
    </div>
  )
}
