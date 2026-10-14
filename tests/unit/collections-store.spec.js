import todo from '@/store/modules/ToDo'
import { db } from '@/data/FirebaseConfig'
import { deferred } from './helpers'

function context () {
  const state = todo.state()
  const commit = jest.fn((name, value) => {
    if (todo.mutations[name]) todo.mutations[name](state, value)
  })
  return { state, commit, dispatch: jest.fn(), rootState: { user: { currentUser: { uid: 'owner' } } } }
}

describe('Relación directa entre colecciones y tareas', () => {
  let transaction
  let documents
  let add

  beforeEach(() => {
    documents = {
      'collections/work': { userId: 'owner', name: 'Trabajo' },
      'collections/home': { userId: 'owner', name: 'Casa' },
      'collections/foreign': { userId: 'someone-else', name: 'Ajena' },
      'todos/task-1': { createdBy: 'owner', title: 'Tarea', collectionId: 'work' },
      'todos/foreign-task': { createdBy: 'someone-else', title: 'Ajena' }
    }
    add = jest.fn().mockResolvedValue({ id: 'new-document' })
    db.collection.mockImplementation(name => ({
      add,
      doc: id => ({ id: id || 'new-task', path: name + '/' + (id || 'new-task') }),
      where: jest.fn().mockReturnValue({ path: name, owner: 'owner' })
    }))
    transaction = {
      get: jest.fn(async reference => ({ exists: !!documents[reference.path], data: () => documents[reference.path] })),
      set: jest.fn(),
      update: jest.fn()
    }
    db.runTransaction.mockImplementation(callback => callback(transaction))
  })

  test('crear un grupo recorta el nombre y toma el propietario de la sesión', async () => {
    const result = await todo.actions.createNewToDoCollection(context(), { name: ' Trabajo ', userId: 'someone-else' })
    expect(result.error).toBe(false)
    expect(add).toHaveBeenCalledWith(expect.objectContaining({ name: 'Trabajo', userId: 'owner' }))
  })

  test('renombrar actualiza solo nombre y fecha y sincroniza el título de la lista seleccionada', async () => {
    const ctx = context()
    todo.mutations.selectCollection(ctx.state, { id: 'work', name: 'Trabajo' })
    const result = await todo.actions.renameCollection(ctx, { id: 'work', name: '  Proyectos  ' })
    expect(result.error).toBe(false)
    expect(transaction.update).toHaveBeenCalledWith(expect.objectContaining({ path: 'collections/work' }), { name: 'Proyectos', lastUpdated: expect.any(Date) })
    expect(ctx.state.currentList).toMatchObject({ collectionId: 'work', title: 'Proyectos' })
  })

  test.each(['foreign', 'missing', null, 'bad/id'])('renombrar rechaza colección ajena, ausente o inválida: %p', async id => {
    const result = await todo.actions.renameCollection(context(), { id, name: 'Proyectos' })
    expect(result.error).toBe(true)
    expect(transaction.update).not.toHaveBeenCalled()
  })

  test.each(['', '   ', 'x'.repeat(201), null])('renombrar rechaza nombres inválidos: %p', async name => {
    const result = await todo.actions.renameCollection(context(), { id: 'work', name })
    expect(result.error).toBe(true)
    expect(transaction.update).not.toHaveBeenCalled()
  })

  test('un fallo de persistencia mantiene el título y devuelve el error', async () => {
    const ctx = context()
    todo.mutations.selectCollection(ctx.state, { id: 'work', name: 'Trabajo' })
    db.runTransaction.mockRejectedValueOnce(new Error('Sin conexión'))
    expect(await todo.actions.renameCollection(ctx, { id: 'work', name: 'Proyectos' })).toMatchObject({ error: true, message: 'Sin conexión' })
    expect(ctx.state.currentList.title).toBe('Trabajo')
  })

  test.each(['', '   ', 'x'.repeat(201), null])('rechaza nombres inválidos sin escribir: %p', async name => {
    const result = await todo.actions.createNewToDoCollection(context(), { name })
    expect(result.error).toBe(true)
    expect(add).not.toHaveBeenCalled()
  })

  test('crear una tarea dentro de una colección comprueba el propietario y guarda su ID como texto', async () => {
    const draft = Object.freeze({ title: '  Preparar reporte ', createdBy: 'someone-else', collectionId: 'work' })
    const ctx = context()
    const result = await todo.actions.saveToDo(ctx, draft)
    expect(result).toMatchObject({ error: false, data: { id: 'new-task', title: 'Preparar reporte', collectionId: 'work', createdBy: 'owner' } })
    expect(transaction.get).toHaveBeenCalledWith(expect.objectContaining({ path: 'collections/work' }))
    expect(transaction.set).toHaveBeenCalledWith(expect.objectContaining({ path: 'todos/new-task' }), expect.objectContaining({ collectionId: 'work' }))
    expect(add).not.toHaveBeenCalled()
    expect(draft.createdBy).toBe('someone-else')
  })

  test.each(['foreign', 'missing'])('no crea una tarea en una colección ajena o ausente: %s', async collectionId => {
    const ctx = context()
    const result = await todo.actions.saveToDo(ctx, { title: 'Tarea', collectionId })
    expect(result.error).toBe(true)
    expect(transaction.set).not.toHaveBeenCalled()
    expect(ctx.dispatch).not.toHaveBeenCalled()
  })

  test('crear sin colección guarda null sin leer grupos', async () => {
    const result = await todo.actions.saveToDo(context(), { title: 'Tarea antigua' })
    expect(result.error).toBe(false)
    expect(add).toHaveBeenCalledWith(expect.objectContaining({ collectionId: null }))
    expect(db.runTransaction).not.toHaveBeenCalled()
  })

  test('mover entre grupos cambia solo la referencia y la fecha, sin copiar la tarea', async () => {
    const result = await todo.actions.moveToDoToCollection(context(), { id: 'task-1', collectionId: 'home' })
    expect(result).toMatchObject({ error: false, data: { id: 'task-1', collectionId: 'home' } })
    expect(transaction.update).toHaveBeenCalledWith(expect.objectContaining({ path: 'todos/task-1' }), { collectionId: 'home', lastUpdated: expect.any(Date) })
    expect(transaction.set).not.toHaveBeenCalled()
    expect(transaction.get).toHaveBeenCalledTimes(2)
  })

  test('quitar de un grupo escribe null y conserva la tarea', async () => {
    const result = await todo.actions.moveToDoToCollection(context(), { id: 'task-1', collectionId: null })
    expect(result.error).toBe(false)
    expect(transaction.update).toHaveBeenCalledWith(expect.anything(), expect.objectContaining({ collectionId: null }))
    expect(transaction.get).toHaveBeenCalledTimes(1)
  })

  test.each(['foreign', 'missing'])('no mueve tareas a una colección ajena o ausente: %s', async collectionId => {
    const ctx = context()
    const result = await todo.actions.moveToDoToCollection(ctx, { id: 'task-1', collectionId })
    expect(result.error).toBe(true)
    expect(transaction.update).not.toHaveBeenCalled()
    expect(ctx.commit).toHaveBeenCalledWith('ui/showNotification', expect.objectContaining({ color: 'danger' }), { root: true })
  })

  test.each(['foreign-task', 'missing-task'])('no mueve tareas ajenas o ausentes: %s', async id => {
    const result = await todo.actions.moveToDoToCollection(context(), { id, collectionId: 'work' })
    expect(result.error).toBe(true)
    expect(transaction.update).not.toHaveBeenCalled()
  })

  test.each([true, [], {}, '', 'path/with/slash', '.', '..'])('rechaza referencias inválidas: %p', async collectionId => {
    const result = await todo.actions.moveToDoToCollection(context(), { id: 'task-1', collectionId })
    expect(result.error).toBe(true)
    expect(db.runTransaction).not.toHaveBeenCalled()
  })

  test('una transacción fallida no emite éxito ni cambia el estado local', async () => {
    db.runTransaction.mockRejectedValue(new Error('Sin conexión'))
    const ctx = context()
    ctx.state.todos = [{ id: 'task-1', collectionId: 'work' }]
    const result = await todo.actions.moveToDoToCollection(ctx, { id: 'task-1', collectionId: 'home' })
    expect(result).toMatchObject({ error: true, message: 'Sin conexión' })
    expect(ctx.state.todos[0].collectionId).toBe('work')
    expect(ctx.commit).not.toHaveBeenCalledWith('ui/showNotification', expect.objectContaining({ border: 'success' }), expect.anything())
  })

  test('una edición de título con una referencia vieja no deshace un movimiento', async () => {
    const update = jest.fn().mockResolvedValue(undefined)
    db.collection.mockReturnValue({ doc: () => ({ update }) })
    await todo.actions.updateToDoById(context(), { id: 'task-1', title: 'Nuevo título', collectionId: 'work' })
    expect(update).toHaveBeenCalledWith({ title: 'Nuevo título' })
  })

  test.each(['createNewToDoCollection', 'saveToDo', 'moveToDoToCollection'])('%s exige una sesión antes de escribir', async action => {
    const ctx = context()
    ctx.rootState.user.currentUser = null
    const result = await todo.actions[action](ctx, { name: 'Grupo', title: 'Tarea', id: 'task-1', collectionId: 'work' })
    expect(result.error).toBe(true)
    expect(add).not.toHaveBeenCalled()
    expect(db.runTransaction).not.toHaveBeenCalled()
  })
})

describe('Filtros y carga de agrupaciones', () => {
  const tasks = [
    { id: 'legacy', done: false, created: 1 },
    { id: 'free', done: false, created: 2, collectionId: null },
    { id: 'work', done: false, created: 4, collectionId: 'work', isImportant: true },
    { id: 'home', done: false, created: 3, collectionId: 'home', isOnMyDay: true },
    { id: 'done-work', done: true, created: 5, collectionId: 'work' },
    { id: 'done-home', done: true, created: 6, collectionId: 'home' }
  ]
  const ids = tasks => tasks.map(task => task.id)

  test('una colección seleccionada muestra solo sus pendientes y completadas', () => {
    const state = todo.state()
    state.todos = tasks
    todo.mutations.selectCollection(state, { id: 'work', name: 'Trabajo' })
    expect(ids(todo.getters.getUncompletedToDos(state))).toEqual(['work'])
    expect(ids(todo.getters.getCompletedToDos(state))).toEqual(['done-work'])
  })

  test('Tareas, Mi día e Importante siguen cruzando todas las colecciones', () => {
    const state = todo.state()
    state.todos = tasks
    expect(ids(todo.getters.getUncompletedToDos(state))).toEqual(['work', 'home', 'free', 'legacy'])
    state.currentList = state.categories.IMPORTANT
    expect(ids(todo.getters.getUncompletedToDos(state))).toEqual(['work'])
    state.currentList = state.categories.MYDAY
    expect(ids(todo.getters.getUncompletedToDos(state))).toEqual(['home'])
  })

  test('la carga consulta únicamente los grupos del usuario y distingue carga de vacío', async () => {
    const ctx = context()
    const query = { owner: 'owner' }
    const where = jest.fn().mockReturnValue(query)
    db.collection.mockReturnValue({ where })
    const pending = deferred()
    ctx.bindFirestoreRef = jest.fn().mockReturnValue(pending.promise)
    const operation = todo.actions.getCollections(ctx, 'owner')
    expect(ctx.state.collectionsLoading).toBe(true)
    expect(where).toHaveBeenCalledWith('userId', '==', 'owner')
    expect(ctx.bindFirestoreRef).toHaveBeenCalledWith('collections', query)
    pending.resolve()
    await operation
    expect(ctx.state.collectionsLoading).toBe(false)
    expect(ctx.state.collectionsError).toBeNull()
  })

  test('un fallo de carga deja un error recuperable', async () => {
    const ctx = context()
    db.collection.mockReturnValue({ where: jest.fn() })
    ctx.bindFirestoreRef = jest.fn().mockRejectedValue(new Error('Sin permisos'))
    await todo.actions.getCollections(ctx, 'owner')
    expect(ctx.state.collectionsError).toBe('Sin permisos')
    expect(ctx.state.collectionsLoading).toBe(false)
  })

  test('sin sesión desvincula y limpia los grupos', async () => {
    const ctx = context()
    ctx.state.collections = [{ id: 'work' }]
    ctx.unbindFirestoreRef = jest.fn()
    await todo.actions.getCollections(ctx, null)
    expect(ctx.unbindFirestoreRef).toHaveBeenCalledWith('collections')
    expect(ctx.state.collections).toEqual([])
  })

  test('un error tardío de otro usuario no reemplaza su estado de carga', async () => {
    const ctx = context()
    db.collection.mockReturnValue({ where: jest.fn() })
    const pending = deferred()
    ctx.bindFirestoreRef = jest.fn().mockReturnValue(pending.promise)
    const operation = todo.actions.getCollections(ctx, 'old-owner')
    ctx.state.collectionUserId = 'new-owner'
    pending.reject(new Error('Error anterior'))
    await operation
    expect(ctx.state.collectionsError).toBeNull()
    expect(ctx.state.collectionsLoading).toBe(true)
  })
})
