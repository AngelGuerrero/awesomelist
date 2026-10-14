import List from './ListClass'

export function createCollectionList (collection) {
  const list = new List('collection', collection.name, 'collectionId', 'Tareas de la colección', '#0078d7')
  list.collectionId = collection.id
  return list
}

export function filterToDosByList (todos, list) {
  if (list.filter === 'default') return todos
  if (list.filter === 'collectionId') {
    return todos.filter(todo => todo.collectionId === list.collectionId)
  }
  return todos.filter(todo => todo[list.filter])
}

export function normalizeCollectionId (value) {
  if (value === null || value === undefined) return null
  if (typeof value !== 'string' || !value.trim() || value.includes('/') || value === '.' || value === '..') {
    throw new Error('La colección seleccionada no es válida')
  }
  return value
}

export function getCurrentUserId (rootState) {
  const user = rootState && rootState.user && rootState.user.currentUser
  if (!user || !user.uid) throw new Error('Inicia sesión para guardar los cambios')
  return user.uid
}

export async function getOwnedCollection (transaction, db, id, uid) {
  const snapshot = await transaction.get(db.collection('collections').doc(id))
  if (!snapshot.exists || snapshot.data().userId !== uid) {
    throw new Error('La colección no existe o no pertenece a tu cuenta')
  }
  return snapshot.data()
}
