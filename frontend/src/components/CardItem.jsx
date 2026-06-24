import React from 'react'
import './CardItem.css'

export default function CardItem({ card, drag, onClick }) {
  const overdue = card.is_overdue
  return (
    <div
      className={`card-item ${overdue ? 'overdue' : ''}`}
      ref={drag.innerRef}
      {...drag.draggableProps}
      {...drag.dragHandleProps}
      onClick={onClick}
    >
      <p className="card-title">{card.title}</p>
      <div className="card-meta">
        {card.tags?.map(t => (
          <span key={t.id} className="tag" style={{ background: t.color }}>{t.name}</span>
        ))}
        {card.due_date && (
          <span className={`due ${overdue ? 'due-overdue' : ''}`}>
            📅 {card.due_date}
          </span>
        )}
        {card.assigned_member && (
          <span className="assignee">👤 {card.assigned_member.name}</span>
        )}
      </div>
    </div>
  )
}
