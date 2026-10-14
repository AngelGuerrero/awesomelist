import { mount, shallowMount } from '@vue/test-utils'
import { BButton, BCollapse, BFormInput } from 'bootstrap-vue'
import ToDoCollections from '@/components/ToDo/ToDoCollections'
import ToDoCollectionTitle from '@/components/ToDo/ToDoCollectionTitle'
import ToDoCollectionPicker from '@/components/ToDo/ToDoCollectionPicker'
import ToDoCreate from '@/components/ToDo/ToDoCreate'
import ToDoMenu from '@/components/ToDo/ToDoMenu'
import todo from '@/store/modules/ToDo'
import { createTestStore, deferred } from './helpers'

const settle = async () => {
  for (let i = 0; i < 10; i++) await Promise.resolve()
}

describe('Navegación por colecciones', () => {
  let wrapper
  let options
  let getCollections

  beforeEach(() => {
    getCollections = jest.fn().mockResolvedValue({ error: false })
    options = createTestStore({ ...todo, actions: { getCollections } })
    options.localVue.component('b-button', BButton)
    options.localVue.component('b-collapse', BCollapse)
    options.store.state.todo.collections = [{ id: 'work', name: 'Trabajo' }, { id: 'home', name: 'Casa' }]
    options.store.state.todo.todos = [
      { id: 'work-task', collectionId: 'work', done: false },
      { id: 'done-task', collectionId: 'work', done: true },
      { id: 'home-task', collectionId: 'home', done: false }
    ]
    wrapper = mount(ToDoCollections, { ...options, stubs: ['b-icon', 'b-spinner'] })
  })

  afterEach(() => wrapper.destroy())

  test('seleccionar un grupo cambia la lista principal, muestra su contador y expone un botón accesible', async () => {
    expect(getCollections).toHaveBeenCalledWith(expect.anything(), 'user-1')
    expect(wrapper.findAll('.collection__item').at(0).text()).toContain('Trabajo')
    expect(wrapper.findAll('.collection__item').at(0).text()).toContain('2')
    await wrapper.findAll('.collection__item').at(0).trigger('click')
    expect(options.store.state.todo.currentList).toMatchObject({ collectionId: 'work', title: 'Trabajo' })
    expect(wrapper.findAll('.collection__item').at(0).attributes('aria-pressed')).toBe('true')
    expect(wrapper.findAll('.collection__item').at(0).element.tagName).toBe('BUTTON')
  })

  test('un segundo clic contrae el grupo sin perder la selección de la lista principal', async () => {
    const button = wrapper.findAll('.collection__item').at(0)
    expect(button.attributes('aria-expanded')).toBe('false')
    await button.trigger('click')
    expect(button.attributes('aria-expanded')).toBe('true')
    expect(wrapper.find('#collection-tasks-work').exists()).toBe(true)
    await button.trigger('click')
    expect(button.attributes('aria-expanded')).toBe('false')
    expect(options.store.state.todo.currentList.collectionId).toBe('work')
  })

  test('expandir y contraer todas no cambia la colección seleccionada', async () => {
    await wrapper.findAll('.collection__item').at(0).trigger('click')
    await wrapper.find('[aria-label="Expandir todas las colecciones"]').trigger('click')
    expect(wrapper.vm.expandedCollections).toEqual(['work', 'home'])
    await wrapper.find('[aria-label="Contraer todas las colecciones"]').trigger('click')
    expect(wrapper.vm.expandedCollections).toEqual([])
    expect(options.store.state.todo.currentList.collectionId).toBe('work')
  })

  test('el contenido desplegado muestra solo las tareas del grupo y abre su detalle', async () => {
    options.store.state.todo.todos[0].title = 'Reporte de trabajo'
    options.store.state.todo.todos[1].title = 'Trabajo completado'
    options.store.state.todo.todos[2].title = 'Tarea de casa'
    await wrapper.findAll('.collection__item').at(0).trigger('click')
    const content = wrapper.find('#collection-tasks-work .collection__tasks')
    expect(content.text()).toContain('Reporte de trabajo')
    expect(content.text()).toContain('Trabajo completado')
    expect(content.text()).not.toContain('Tarea de casa')
    expect(content.find('.task--completed').exists()).toBe(true)
    await content.find('button').trigger('click')
    expect(options.store.state.todo.currentList.collectionId).toBe('work')
    expect(options.store.state.ui.selectedComponent).toEqual({ name: 'ToDoDetail', props: { id: 'work-task' } })
  })

  test('una colección vacía mantiene su contenido desplegable y muestra el mensaje', async () => {
    options.store.state.todo.todos = []
    await wrapper.findAll('.collection__item').at(0).trigger('click')
    expect(wrapper.find('#collection-tasks-work .collection__tasks').text()).toContain('Colección vacía')
  })

  test('carga, fallo recuperable y vacío son estados diferentes', async () => {
    options.store.state.todo.collectionsLoading = true
    await wrapper.vm.$nextTick()
    expect(wrapper.text()).toContain('Cargando')
    options.store.state.todo.collectionsLoading = false
    options.store.state.todo.collectionsError = 'Sin permisos'
    await wrapper.vm.$nextTick()
    expect(wrapper.text()).toContain('No se pudieron cargar')
    await wrapper.find('button').trigger('click')
    expect(getCollections).toHaveBeenCalledTimes(2)
    options.store.state.todo.collectionsError = null
    options.store.state.todo.collections = []
    await wrapper.vm.$nextTick()
    expect(wrapper.text()).toContain('No hay colecciones')
  })

  test('al salir de la sesión solicita desvincular los grupos anteriores', async () => {
    options.store.state.user.currentUser = null
    await wrapper.vm.$nextTick()
    expect(getCollections).toHaveBeenLastCalledWith(expect.anything(), null)
  })
})

describe('Creación dentro de un grupo', () => {
  let wrapper

  afterEach(() => wrapper.destroy())

  test('una tarea creada en la colección seleccionada envía su ID, no una bandera booleana', async () => {
    const save = jest.fn().mockResolvedValue({ error: false, data: { id: 'new-task' } })
    const options = createTestStore({
      getters: { getCurrentList: () => ({ name: 'collection', filter: 'collectionId', collectionId: 'work' }) },
      actions: { saveToDo: save }
    })
    options.localVue.component('b-input', BFormInput)
    wrapper = mount(ToDoCreate, options)
    await wrapper.setData({ inputText: 'Nueva tarea' })
    await wrapper.vm.createToDo()
    expect(save).toHaveBeenCalledWith(expect.anything(), expect.objectContaining({ collectionId: 'work' }))
  })

  test('crear una colección la selecciona para agregar tareas inmediatamente', async () => {
    jest.useFakeTimers()
    const createCollection = jest.fn().mockResolvedValue({ error: false, data: { id: 'work', name: 'Trabajo' } })
    const options = createTestStore({ ...todo, actions: { createNewToDoCollection: createCollection } })
    wrapper = shallowMount(ToDoMenu, { ...options, stubs: ['b-input', 'b-button', 'b-icon'] })
    await wrapper.setData({ collection: { visible: true, name: 'Trabajo' } })
    await wrapper.vm.saveToDoCollection()
    expect(options.store.state.todo.currentList).toMatchObject({ collectionId: 'work', title: 'Trabajo' })
    expect(wrapper.vm.collection.visible).toBe(false)
    jest.clearAllTimers()
    jest.useRealTimers()
  })
})

describe('Asignación desde el detalle de tarea', () => {
  let wrapper
  let move
  let options
  beforeEach(async () => {
    move = jest.fn().mockResolvedValue({ error: false })
    options = createTestStore({ ...todo, actions: { moveToDoToCollection: move } })
    options.localVue.component('b-button', BButton)
    options.store.state.todo.collections = [{ id: 'work', name: 'Trabajo' }, { id: 'home', name: 'Casa' }]
    wrapper = mount(ToDoCollectionPicker, {
      ...options,
      propsData: { todo: { id: 'task-1', collectionId: 'work' } },
      stubs: {
        'b-list-group': { template: '<div><slot /></div>' },
        'b-list-group-item': { template: '<div><slot /></div>' },
        'b-modal': { props: ['value'], template: '<div v-if="value"><slot /><slot name="modal-footer" /></div>' },
        'b-icon': true,
        'b-spinner': true
      }
    })
    await wrapper.find('.picker__trigger').trigger('click')
  })
  afterEach(() => wrapper.destroy())

  test('muestra la pertenencia actual y permite mover desde el modal', async () => {
    expect(wrapper.find('.picker__trigger').text()).toBe('Trabajo')
    expect(wrapper.find('.picker__option--selected').text()).toBe('Trabajo')
    await wrapper.findAll('.picker__option').at(2).trigger('click')
    await settle()
    expect(move).toHaveBeenCalledWith(expect.anything(), { id: 'task-1', collectionId: 'home' })
    expect(wrapper.vm.modalVisible).toBe(false)
    expect(wrapper.find('.picker__trigger').text()).toBe('Casa')
  })
  test('busca sin distinguir acentos o mayúsculas y muestra ausencia de resultados', async () => {
    options.store.state.todo.collections[1].name = 'Administración'
    await wrapper.find('input').setValue('ADMINISTRACION')
    expect(wrapper.findAll('.picker__option')).toHaveLength(1)
    expect(wrapper.find('.picker__option').text()).toBe('Administración')
    await wrapper.find('input').setValue('inexistente')
    expect(wrapper.find('[role="status"]').text()).toContain('No hay colecciones')
    expect(move).not.toHaveBeenCalled()
  })
  test('Sin colección envía null y no borra la tarea', async () => {
    await wrapper.find('.picker__option').trigger('click')
    await settle()
    expect(move).toHaveBeenCalledWith(expect.anything(), { id: 'task-1', collectionId: null })
  })
  test('un fallo conserva el modal y la pertenencia y permite reintentar', async () => {
    move.mockResolvedValueOnce({ error: true })
    await wrapper.findAll('.picker__option').at(2).trigger('click')
    await settle()
    expect(wrapper.vm.modalVisible).toBe(true)
    expect(wrapper.find('.picker__trigger').text()).toBe('Trabajo')
    expect(wrapper.find('[role="alert"]').text()).toContain('No se pudo cambiar')
    await wrapper.findAll('.picker__option').at(2).trigger('click')
    await settle()
    expect(move).toHaveBeenCalledTimes(2)
  })
  test('bloquea controles durante una escritura y evita duplicados', async () => {
    const pending = deferred()
    move.mockReturnValue(pending.promise)
    await wrapper.findAll('.picker__option').at(2).trigger('click')
    expect(wrapper.find('.picker__trigger').element.disabled).toBe(true)
    expect(wrapper.find('input').element.disabled).toBe(true)
    await wrapper.vm.moveToCollection('home')
    expect(move).toHaveBeenCalledTimes(1)
    pending.resolve({ error: false })
    await settle()
    expect(wrapper.find('.picker__trigger').element.disabled).toBe(false)
  })
  test('una tarea antigua aparece sin colección y una referencia ausente se conserva', async () => {
    await wrapper.setProps({ todo: { id: 'legacy' } })
    expect(wrapper.find('.picker__trigger').text()).toBe('Sin colección')
    await wrapper.setProps({ todo: { id: 'task-1', collectionId: 'unavailable' } })
    expect(wrapper.find('.picker__trigger').text()).toBe('Colección no disponible')
    await wrapper.find('.picker__trigger').trigger('click')
    expect(wrapper.find('.picker__option--selected').element.disabled).toBe(true)
    expect(move).not.toHaveBeenCalled()
  })
  test('un resultado tardío no cambia la pertenencia de otra tarea', async () => {
    const pending = deferred()
    move.mockReturnValue(pending.promise)
    await wrapper.findAll('.picker__option').at(2).trigger('click')
    await wrapper.setProps({ todo: { id: 'task-2', collectionId: null } })
    pending.resolve({ error: false })
    await settle()
    expect(wrapper.vm.selectedCollectionId).toBeNull()
    expect(wrapper.vm.modalVisible).toBe(false)
  })
  test('elegir la colección actual o cancelar cierra sin escribir', async () => {
    await wrapper.findAll('.picker__option').at(1).trigger('click')
    expect(move).not.toHaveBeenCalled()
    await wrapper.find('.picker__trigger').trigger('click')
    await wrapper.findAll('button').wrappers.find(button => button.text() === 'Cancelar').trigger('click')
    expect(wrapper.vm.modalVisible).toBe(false)
    expect(move).not.toHaveBeenCalled()
  })
  test('carga y error de lectura bloquean movimientos', async () => {
    options.store.state.todo.collectionsLoading = true
    await wrapper.vm.moveToCollection('home')
    expect(move).not.toHaveBeenCalled()
    options.store.state.todo.collectionsLoading = false
    options.store.state.todo.collectionsError = 'Sin conexión'
    await wrapper.vm.moveToCollection('home')
    expect(move).not.toHaveBeenCalled()
  })
})
describe('Edición del título principal de colección', () => {
  let wrapper
  let renameCollection

  beforeEach(() => {
    renameCollection = jest.fn().mockResolvedValue({ error: false })
    const options = createTestStore({ ...todo, actions: { renameCollection } })
    wrapper = mount(ToDoCollectionTitle, { ...options, propsData: { list: { collectionId: 'work', title: 'Trabajo', accentColor: '#0078d7' } } })
  })

  afterEach(() => wrapper.destroy())
  test('clic en el título permite editar sin expandir; Enter guarda el nombre recortado', async () => {
    await wrapper.find('.collection-title__text').trigger('click')
    expect(wrapper.find('h1').exists()).toBe(true)
    const input = wrapper.find('input')
    expect(input.element.value).toBe('Trabajo')
    await input.setValue('  Proyectos  ')
    await input.trigger('keydown', { key: 'Enter' })
    await settle()
    expect(renameCollection).toHaveBeenCalledWith(expect.anything(), { id: 'work', name: 'Proyectos' })
    expect(wrapper.find('input').exists()).toBe(false)
  })

  test('salir del campo guarda y Escape cancela sin escribir', async () => {
    await wrapper.find('.collection-title__text').trigger('click')
    await wrapper.find('input').setValue('Proyectos')
    await wrapper.find('input').trigger('keydown', { key: 'Escape' })
    expect(renameCollection).not.toHaveBeenCalled()
    await wrapper.find('.collection-title__text').trigger('click')
    await wrapper.find('input').setValue('Oficina')
    await wrapper.find('input').trigger('blur')
    await settle()
    expect(renameCollection).toHaveBeenCalledWith(expect.anything(), { id: 'work', name: 'Oficina' })
  })

  test('vacío y nombre sin cambios no escriben', async () => {
    await wrapper.find('.collection-title__text').trigger('click')
    await wrapper.find('input').setValue('   ')
    await wrapper.find('input').trigger('blur')
    expect(wrapper.find('[role="alert"]').exists()).toBe(true)
    expect(renameCollection).not.toHaveBeenCalled()
    await wrapper.find('input').setValue('Trabajo')
    await wrapper.find('input').trigger('blur')
    expect(renameCollection).not.toHaveBeenCalled()
    expect(wrapper.find('input').exists()).toBe(false)
  })

  test('fallo conserva el borrador y permite reintentar; una escritura pendiente no se duplica', async () => {
    const pending = deferred()
    renameCollection.mockReturnValueOnce(pending.promise)
    await wrapper.find('.collection-title__text').trigger('click')
    await wrapper.find('input').setValue('Proyectos')
    await wrapper.find('input').trigger('keydown', { key: 'Enter' })
    await wrapper.vm.saveName()
    expect(renameCollection).toHaveBeenCalledTimes(1)
    expect(wrapper.find('input').attributes('disabled')).toBeDefined()
    pending.resolve({ error: true, message: 'Sin conexión' })
    await settle()
    expect(wrapper.find('input').element.value).toBe('Proyectos')
    expect(wrapper.find('[role="alert"]').text()).toBe('Sin conexión')
    await wrapper.find('input').trigger('keydown', { key: 'Enter' })
    await settle()
    expect(renameCollection).toHaveBeenCalledTimes(2)
    expect(wrapper.find('input').exists()).toBe(false)
  })
})
