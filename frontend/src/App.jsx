import React, { useState, useEffect } from 'react'
import { getBoards, createBoard } from './api'
import BoardView from './components/BoardView'
import './App.css'

export default function App() {
  const [boards, setBoards]     = useState([])
  const [selected, setSelected] = useState(null)
  const [newName, setNewName]   = useState('')
  const [adding, setAdding]     = useState(false)

  const load = async () => {
    try {
      const res = await getBoards()
      setBoards(Array.isArray(res.data) ? res.data : [])
    } catch {
      setBoards([])
    }
  }

  useEffect(() => { load() }, [])

  const handleCreate = async (e) => {
    e.preventDefault()
    if (!newName.trim()) return
    const res = await createBoard({ name: newName.trim() })
    setBoards(b => [res.data, ...b])
    setNewName('')
    setAdding(false)
  }

  if (selected) {
    return <BoardView boardId={selected} onBack={() => setSelected(null)} />
  }

  return (
    <div className="home">
      <header className="home-header">
        <h1>🗂 Kanban</h1>
        <button className="btn-primary" onClick={() => setAdding(true)}>+ New Board</button>
      </header>

      {adding && (
        <div className="modal-overlay" onClick={() => setAdding(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <h2>Create Board</h2>
            <form onSubmit={handleCreate}>
              <div className="form-row">
                <label>Board name</label>
                <input autoFocus value={newName} onChange={e => setNewName(e.target.value)} placeholder="My project" />
              </div>
              <div className="form-actions">
                <button type="button" className="btn-ghost" onClick={() => setAdding(false)}>Cancel</button>
                <button type="submit" className="btn-primary">Create</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="board-grid">
        {boards.map(b => (
          <div key={b.id} className="board-card" onClick={() => setSelected(b.id)}>
            <h2>{b.name}</h2>
            {b.description && <p>{b.description}</p>}
            <span className="board-meta">{b.members?.length ?? 0} members</span>
          </div>
        ))}
        {boards.length === 0 && <p className="empty">No boards yet. Create one!</p>}
      </div>
    </div>
  )
}
