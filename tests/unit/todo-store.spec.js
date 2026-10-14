import todo from '@/store/modules/ToDo'
import { db } from '@/data/FirebaseConfig'
import { deferred } from './helpers'

const context = () => ({ commit: jest.fn(), dispatch: jest.fn() })

describe('Persistencia de tareas', () => {
  let add
  let update
  let remove

  beforeEach(() => {
    add = jest.fn()
    update = jest.fn()
    remove = jest.fn()
    db.collection.mockReturnValue({
      add,
      doc: jest.fn(() => ({ update, delete: remove }))
    })
  })

  test('crear devuelve el identificador sin modificar el borrador', async () => {
    add.mockResolvedValue({ id: 'task-1' })
    const ctx = context()
    const draft = Object.freeze({ title: 'Comprar pan', createdBy: 'user-1' })
    const result = await todo.actions.saveToDo(ctx, draft)
    expect(result).toMatchObject({ error: false, data: { ...draft, id: 'task-1' } })
    expect(draft).not.toHaveProperty('id')
    expect(ctx.dispatch).toHaveBeenCalledWith('ui/playAddTaskSound', true, { root: true })
  })

  test('un error al crear se retorna y no reproduce sonido de éxito', async () => {
    add.mockRejectedValue(new Error('Sin permisos'))
    const ctx = context()
    const result = await todo.actions.saveToDo(ctx, { title: 'Comprar pan' })
    expect(result.error).toBe(true)
    expect(ctx.dispatch).not.toHaveBeenCalled()
    expect(ctx.commit).toHaveBeenCalledWith('ui/showNotification', expect.objectContaining({ color: 'danger' }), { root: true })
  })

  test('actualizar no guarda el identificador en los campos del documento', async () => {
    update.mockResolvedValue(undefined)
    const result = await todo.actions.updateToDoById(context(), { id: 'task-1', title: 'Nuevo título' })
    expect(result.error).toBe(false)
    expect(update).toHaveBeenCalledWith({ title: 'Nuevo título' })
  })

  test('actualizar retorna el error de Firebase', async () => {
    update.mockRejectedValue(new Error('Sin permisos'))
    const result = await todo.actions.updateToDoById(context(), { id: 'task-1' })
    expect(result).toMatchObject({ error: true, message: 'Sin permisos' })
  })

  test('borrar espera la escritura y devuelve un resultado', async () => {
    const pending = deferred()
    remove.mockReturnValue(pending.promise)
    let finished = false
    const operation = todo.actions.deleteToDoById(context(), 'task-1').then(result => {
      finished = true
      return result
    })
    await Promise.resolve()
    expect(finished).toBe(false)
    pending.resolve()
    await expect(operation).resolves.toMatchObject({ error: false })
  })

  test('borrar informa un error y permite que el llamador conserve la tarea', async () => {
    remove.mockRejectedValue(new Error('Sin permisos'))
    const ctx = context()
    await expect(todo.actions.deleteToDoById(ctx, 'task-1')).resolves.toMatchObject({ error: true, message: 'Sin permisos' })
    expect(ctx.commit).toHaveBeenCalledWith('ui/showNotification', expect.objectContaining({ color: 'danger' }), { root: true })
  })

  test.each([
    ['onToggleToDo', { id: 'task-1', title: 'Tarea', done: true }],
    ['onToggleAddToMyDay', { todo: { id: 'task-1', title: 'Tarea' }, value: true }],
    ['onToggleMarkAsImportant', { todo: { id: 'task-1', title: 'Tarea' }, value: true }]
  ])('%s no anuncia éxito si la actualización falla', async (action, payload) => {
    const ctx = context()
    ctx.dispatch.mockResolvedValue({ error: true, message: 'Sin permisos' })
    const result = await todo.actions[action](ctx, payload)
    expect(result.error).toBe(true)
    expect(ctx.commit).not.toHaveBeenCalled()
  })

  test.each([
    ['onToggleToDo', { id: 'task-1', title: 'Tarea', done: true }, 'done'],
    ['onToggleAddToMyDay', { todo: { id: 'task-1', title: 'Tarea' }, value: true }, 'isOnMyDay'],
    ['onToggleMarkAsImportant', { todo: { id: 'task-1', title: 'Tarea' }, value: true }, 'isImportant']
  ])('%s confirma una actualización exitosa sin alterar la tarea recibida', async (action, payload, flag) => {
    const before = JSON.stringify(payload)
    const ctx = context()
    ctx.dispatch.mockResolvedValue({ error: false })
    await todo.actions[action](ctx, payload)
    expect(ctx.dispatch).toHaveBeenCalledWith('updateToDoById', expect.objectContaining({ id: 'task-1', [flag]: true }))
    expect(ctx.commit).toHaveBeenCalledWith('ui/showNotification', expect.objectContaining({ border: 'success' }), { root: true })
    expect(JSON.stringify(payload)).toBe(before)
  })

  test('crear colección espera la escritura y retorna su identificador', async () => {
    const pending = deferred()
    add.mockReturnValue(pending.promise)
    const operation = todo.actions.createNewToDoCollection(context(), { name: 'Trabajo', userId: 'user-1' })
    pending.resolve({ id: 'collection-1' })
    await expect(operation).resolves.toMatchObject({ error: false, data: { id: 'collection-1', name: 'Trabajo' } })
  })

  test('crear colección retorna y notifica el fallo', async () => {
    add.mockRejectedValue(new Error('Sin permisos'))
    const ctx = context()
    await expect(todo.actions.createNewToDoCollection(ctx, { name: 'Trabajo', userId: 'user-1' })).resolves.toMatchObject({ error: true })
    expect(ctx.commit).toHaveBeenCalledWith('ui/showNotification', expect.objectContaining({ color: 'danger' }), { root: true })
  })
})

describe('Filtros de tareas', () => {
  const tasks = [
    { id: 'pending', done: false, created: 1 },
    { id: 'day', done: false, created: 3, isOnMyDay: true },
    { id: 'important', done: false, created: 2, isImportant: true },
    { id: 'done', done: true, created: 4, isOnMyDay: true }
  ]
  const ids = result => result.map(task => task.id)

  test('el estado inicial muestra tareas antes de montar el dashboard', () => {
    const state = typeof todo.state === 'function' ? todo.state() : { ...todo.state }
    state.todos = tasks
    expect(ids(todo.getters.getUncompletedToDos(state))).toEqual(['day', 'important', 'pending'])
    expect(ids(todo.getters.getCompletedToDos(state))).toEqual(['done'])
  })

  test.each([
    ['default', ['day', 'important', 'pending']],
    ['isOnMyDay', ['day']],
    ['isImportant', ['important']]
  ])('filtra %s y no altera el orden del estado', (filter, expected) => {
    const state = { todos: tasks, currentList: { filter } }
    const before = tasks.map(task => task.id)
    expect(ids(todo.getters.getUncompletedToDos(state))).toEqual(expected)
    expect(tasks.map(task => task.id)).toEqual(before)
  })

  test('listas vacías no producen errores', () => {
    const state = { todos: [], currentList: { filter: 'default' } }
    expect(todo.getters.getUncompletedToDos(state)).toEqual([])
    expect(todo.getters.getCompletedToDos(state)).toEqual([])
  })

  test('dos instancias del módulo no comparten tareas ni colecciones', () => {
    const first = todo.state()
    const second = todo.state()
    first.todos.push(tasks[0])
    first.collections.push({ id: 'collection-1' })
    expect(second.todos).toEqual([])
    expect(second.collections).toEqual([])
  })

  test('una respuesta tardía de una colección ausente se ignora', () => {
    const state = { collections: [] }
    expect(() => todo.mutations.setListToCollection(state, { collectionId: 'removed', lists: [] })).not.toThrow()
    expect(state.collections).toEqual([])
  })
})
