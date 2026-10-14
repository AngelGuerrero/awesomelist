import { mount, shallowMount } from '@vue/test-utils'
import { BFormInput, BButton } from 'bootstrap-vue'
import ToDoCreate from '@/components/ToDo/ToDoCreate'
import ToDoConfirmDelete from '@/components/ToDo/ToDoConfirmDelete'
import ToDoDetail from '@/components/ToDo/ToDoDetail'
import ToDoMenu from '@/components/ToDo/ToDoMenu'
import { db } from '@/data/FirebaseConfig'
import { createTestStore, deferred } from './helpers'

const settle = async () => {
  for (let i = 0; i < 10; i++) await Promise.resolve()
}

describe('Crear tareas', () => {
  let wrapper
  let save

  function create (filter = 'default') {
    save = jest.fn().mockResolvedValue({ error: false, data: { id: 'task-1' } })
    const options = createTestStore({
      getters: { getCurrentList: () => ({ name: filter, filter }) },
      actions: { saveToDo: save }
    })
    options.localVue.component('b-input', BFormInput)
    wrapper = mount(ToDoCreate, options)
    return options.store
  }

  afterEach(() => wrapper.destroy())

  test.each(['', '   '])('no guarda títulos vacíos: %p', async title => {
    create()
    await wrapper.setData({ inputText: title })
    await wrapper.find('input').trigger('change')
    expect(save).not.toHaveBeenCalled()
  })

  test('sin usuario no intenta escribir una tarea', async () => {
    const store = create()
    store.state.user.currentUser = null
    await wrapper.setData({ inputText: 'Comprar pan' })
    await wrapper.vm.createToDo()
    expect(save).not.toHaveBeenCalled()
  })

  test.each(['default', 'isOnMyDay', 'isImportant'])('crea desde %s con el título recortado', async filter => {
    create(filter)
    await wrapper.setData({ inputText: '  Comprar pan  ' })
    await wrapper.find('input').trigger('change')
    await settle()
    expect(save).toHaveBeenCalledWith(expect.anything(), expect.objectContaining({ title: 'Comprar pan', createdBy: 'user-1', done: false }))
    const sent = save.mock.calls[0][1]
    if (filter !== 'default') expect(sent[filter]).toBe(true)
    expect(sent).not.toHaveProperty('default')
    expect(wrapper.emitted('createdToDo')).toEqual([[{ id: 'task-1' }]])
    expect(wrapper.vm.inputText).toBeNull()
  })

  test('un fallo conserva el borrador y permite reintentar', async () => {
    create()
    save.mockResolvedValueOnce({ error: true })
    await wrapper.setData({ inputText: 'Comprar pan' })
    await wrapper.vm.createToDo()
    expect(wrapper.vm.inputText).toBe('Comprar pan')
    expect(wrapper.emitted('createdToDo')).toBeUndefined()
    await wrapper.vm.createToDo()
    expect(wrapper.emitted('createdToDo')).toHaveLength(1)
  })

  test('una operación pendiente impide crear duplicados', async () => {
    create()
    const pending = deferred()
    save.mockReturnValue(pending.promise)
    await wrapper.setData({ inputText: 'Comprar pan' })
    const operation = wrapper.vm.createToDo()
    await wrapper.vm.$nextTick()
    expect(wrapper.find('input').element.disabled).toBe(true)
    await wrapper.vm.createToDo()
    expect(save).toHaveBeenCalledTimes(1)
    pending.resolve({ error: false, data: { id: 'task-1' } })
    await operation
    await wrapper.vm.$nextTick()
    expect(wrapper.find('input').element.disabled).toBe(false)
  })
})

describe('Confirmación de borrado en la lista', () => {
  let wrapper
  let remove

  beforeEach(() => {
    remove = jest.fn().mockResolvedValue({ error: false })
    const options = createTestStore({ actions: { deleteToDoById: remove } })
    options.localVue.component('b-button', BButton)
    wrapper = mount(ToDoConfirmDelete, {
      ...options,
      propsData: { todo: { id: 'task-1' } },
      stubs: ['b-icon']
    })
  })

  afterEach(() => wrapper.destroy())

  test('cancelar no borra la tarea', async () => {
    await wrapper.find('button').trigger('click')
    await wrapper.findAll('a').at(0).trigger('click')
    expect(remove).not.toHaveBeenCalled()
    expect(wrapper.vm.confirmationMode).toBe(false)
  })

  test('no duplica borrados y conserva la confirmación si falla', async () => {
    const pending = deferred()
    remove.mockReturnValueOnce(pending.promise)
    await wrapper.find('button').trigger('click')
    await wrapper.findAll('a').at(1).trigger('click')
    await wrapper.findAll('a').at(1).trigger('click')
    expect(remove).toHaveBeenCalledTimes(1)
    pending.resolve({ error: true })
    await settle()
    expect(wrapper.vm.confirmationMode).toBe(true)
    await wrapper.findAll('a').at(1).trigger('click')
    await settle()
    expect(remove).toHaveBeenCalledTimes(2)
    expect(wrapper.vm.confirmationMode).toBe(false)
  })
})

describe('Persistencia desde el detalle', () => {
  let wrapper
  let remove
  let toggle
  let close

  beforeEach(() => {
    remove = jest.fn()
    toggle = jest.fn()
    close = jest.fn()
    db.collection.mockReturnValue({ doc: jest.fn() })
    const options = createTestStore({ actions: { deleteToDoById: remove, onToggleToDo: toggle } })
    wrapper = shallowMount(ToDoDetail, {
      ...options,
      propsData: { id: 'task-1' },
      data: () => ({ todo: { id: 'task-1', title: 'Comprar pan', done: false, created: new Date() } }),
      mocks: { $bind: jest.fn() },
      stubs: {
        Sidebar: { template: '<aside><slot /></aside>', methods: { close } },
        'vs-dialog': true,
        'vs-checkbox': true,
        'b-list-group': true,
        'b-list-group-item': true,
        'b-button': true,
        'b-icon': true
      }
    })
  })

  afterEach(() => wrapper.destroy())

  test('un borrado fallido mantiene abierto el detalle y el diálogo', async () => {
    await wrapper.setData({ modal: { active: true } })
    remove.mockResolvedValue({ error: true })
    await wrapper.vm.deleteToDo()
    expect(close).not.toHaveBeenCalled()
    expect(wrapper.vm.modal.active).toBe(true)
    remove.mockResolvedValue({ error: false })
    await wrapper.vm.deleteToDo()
    expect(close).toHaveBeenCalledTimes(1)
    expect(wrapper.vm.modal.active).toBe(false)
  })

  test('el detalle permanece abierto hasta terminar de completar la tarea', async () => {
    const pending = deferred()
    toggle.mockReturnValue(pending.promise)
    const operation = wrapper.vm.toggleToDoCompleted()
    await wrapper.vm.toggleToDoCompleted()
    expect(toggle).toHaveBeenCalledTimes(1)
    expect(close).not.toHaveBeenCalled()
    pending.resolve({ error: false })
    await operation
    expect(close).toHaveBeenCalledTimes(1)
  })

  test('un fallo al completar conserva el detalle para reintentar', async () => {
    toggle.mockResolvedValue({ error: true })
    await wrapper.vm.toggleToDoCompleted()
    expect(close).not.toHaveBeenCalled()
    toggle.mockResolvedValue({ error: false })
    await wrapper.vm.toggleToDoCompleted()
    expect(close).toHaveBeenCalledTimes(1)
  })

  test('un borrado pendiente no cierra el panel ni se envía dos veces', async () => {
    const pending = deferred()
    remove.mockReturnValue(pending.promise)
    const operation = wrapper.vm.deleteToDo()
    await wrapper.vm.deleteToDo()
    expect(remove).toHaveBeenCalledTimes(1)
    expect(close).not.toHaveBeenCalled()
    pending.resolve({ error: false })
    await operation
    expect(close).toHaveBeenCalledTimes(1)
  })

  test.each(['deleteToDo', 'toggleToDoCompleted'])('%s no cierra el detalle de otra tarea si se cambia la selección', async action => {
    const pending = deferred()
    remove.mockReturnValue(pending.promise)
    toggle.mockReturnValue(pending.promise)
    const operation = wrapper.vm[action]()
    await wrapper.setProps({ id: 'task-2' })
    pending.resolve({ error: false })
    await operation
    expect(close).not.toHaveBeenCalled()
  })
})

describe('Crear colecciones', () => {
  let wrapper
  let createCollection

  beforeEach(() => {
    jest.useFakeTimers()
    createCollection = jest.fn()
    const options = createTestStore({ actions: { createNewToDoCollection: createCollection } })
    options.localVue.component('b-input', BFormInput)
    options.localVue.component('b-button', BButton)
    wrapper = shallowMount(ToDoMenu, { ...options, stubs: ['b-icon'] })
  })

  afterEach(() => {
    wrapper.destroy()
    jest.clearAllTimers()
    jest.useRealTimers()
  })

  test('no guarda una colección vacía', async () => {
    await wrapper.setData({ collection: { visible: true, name: '   ' } })
    await wrapper.vm.saveToDoCollection()
    expect(createCollection).not.toHaveBeenCalled()
  })

  test('conserva el nombre mientras guarda y si falla; el reintento exitoso limpia el formulario', async () => {
    await wrapper.setData({ collection: { visible: true, name: ' Trabajo ' } })
    const pending = deferred()
    createCollection.mockReturnValueOnce(pending.promise)
    const operation = wrapper.vm.saveToDoCollection()
    wrapper.vm.clearToDoCollectionInput()
    await wrapper.vm.saveToDoCollection()
    expect(createCollection).toHaveBeenCalledTimes(1)
    expect(wrapper.vm.collection.name).toBe(' Trabajo ')
    pending.resolve({ error: true })
    await operation
    expect(wrapper.vm.collection.visible).toBe(true)
    createCollection.mockResolvedValueOnce({ error: false })
    await wrapper.vm.saveToDoCollection()
    expect(wrapper.vm.collection).toEqual({ visible: false, name: '' })
    expect(createCollection.mock.calls[0][1].name).toBe('Trabajo')
  })
})
