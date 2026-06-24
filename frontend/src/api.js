import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
})

// Boards
export const getBoards    = ()           => api.get('/boards')
export const createBoard  = (data)       => api.post('/boards', data)
export const updateBoard  = (id, data)   => api.put(`/boards/${id}`, data)
export const deleteBoard  = (id)         => api.delete(`/boards/${id}`)
export const getBoard     = (id)         => api.get(`/boards/${id}`)
export const addMember    = (boardId, memberId) => api.post(`/boards/${boardId}/members`, { member_id: memberId })

// Lists
export const createList   = (boardId, data)        => api.post(`/boards/${boardId}/lists`, data)
export const updateList   = (boardId, id, data)    => api.put(`/boards/${boardId}/lists/${id}`, data)
export const deleteList   = (boardId, id)          => api.delete(`/boards/${boardId}/lists/${id}`)

// Cards
export const createCard   = (listId, data)   => api.post(`/lists/${listId}/cards`, data)
export const updateCard   = (id, data)       => api.put(`/cards/${id}`, data)
export const deleteCard   = (id)             => api.delete(`/cards/${id}`)
export const moveCard     = (id, data)       => api.post(`/cards/${id}/move`, data)
export const syncCardTags = (id, tagIds)     => api.post(`/cards/${id}/tags`, { tag_ids: tagIds })

// Tags
export const getTags      = ()       => api.get('/tags')
export const createTag    = (data)   => api.post('/tags', data)

// Members
export const getMembers   = ()       => api.get('/members')
export const createMember = (data)   => api.post('/members', data)

// Comments
export const createComment = (cardId, data) => api.post(`/cards/${cardId}/comments`, data)
export const deleteComment = (cardId, id)   => api.delete(`/cards/${cardId}/comments/${id}`)

export default api
