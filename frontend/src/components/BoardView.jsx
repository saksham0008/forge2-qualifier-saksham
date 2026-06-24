import React, { useState, useEffect, useCallback } from 'react'
import { DragDropContext, Droppable } from '@hello-pangea/dnd'
import { getBoard, createList, deleteList, moveCard } from '../api'
import ListColumn from './ListColumn'
import CardModal from './CardModal'
import MembersPanel from './MembersPanel'
import './BoardView.css'

export default function BoardView({ boardId, onBack }) {
  const [board, setBoard]       = useState(null)
  const [openCard, setOpenCard] = useState(null)
  const [showMembers, setShowMembers] = useState(false)
  const [newList, setNewList]   = useState('')
  const [addingList, setAddingList] = useState(false)

  const refresh = useCallback(async () => {
    const res = await getBoard(boardId)
    setBoard(res.data)
  }, [boardId])

  useEffect(() => { refresh() }, [refresh])

  const handleAddList = async (e) => {
    e.preventDefault()
    if (!newList.trim()) return
    await createList(boardId, { name: newList.trim(), position: (board?.lists?.length ?? 0) })
    setNewList('')
    setAddingList(false)
    refresh()
  }

  const handleDeleteList = async (listId) => {
    if (!window.confirm('Delete this list and all its cards?')) return
    await deleteList(boardId, listId)
    refresh()
  }

  const handleDragEnd = async (result) => {
    const { draggableId, source, destination } = result
    if (!destination) return
    if (source.droppableId === destination.droppableId && source.index === destination.index) return
    await moveCard(draggableId, { list_id: destination.droppableId, position: destination.index })
    refresh()
  }

  if (!board) return <div style={{ padding: 32 }}>Loading…</div>

  return (
    <div className="board-view">
      <div className="board-topbar">
        <button className="btn-ghost" onClick={onBack}>← Back</button>
        <h1>{board.name}</h1>
        <button className="btn-primary" onClick={() => setShowMembers(true)}>👥 Members</button>
      </div>

      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="lists-scroll">
          {board.lists.map(list => (
            <Droppable droppableId={String(list.id)} key={list.id}>
              {(provided) => (
                <ListColumn
                  list={list}
                  provided={provided}
                  board={board}
                  onRefresh={refresh}
                  onOpenCard={setOpenCard}
                  onDeleteList={() => handleDeleteList(list.id)}
                />
              )}
            </Droppable>
          ))}

          <div className="add-list-col">
            {addingList ? (
              <form onSubmit={handleAddList}>
                <input autoFocus value={newList} onChange={e => setNewList(e.target.value)} placeholder="List name" />
                <div style={{ display: 'flex', gap: 6, marginTop: 8 }}>
                  <button type="submit" className="btn-primary" style={{ flex: 1 }}>Add</button>
                  <button type="button" className="btn-ghost" onClick={() => setAddingList(false)}>✕</button>
                </div>
              </form>
            ) : (
              <button className="btn-ghost" style={{ width: '100%' }} onClick={() => setAddingList(true)}>
                + Add list
              </button>
            )}
          </div>
        </div>
      </DragDropContext>

      {openCard && (
        <CardModal
          cardId={openCard}
          board={board}
          onClose={() => { setOpenCard(null); refresh() }}
        />
      )}

      {showMembers && (
        <MembersPanel
          board={board}
          onClose={() => { setShowMembers(false); refresh() }}
        />
      )}
    </div>
  )
}
