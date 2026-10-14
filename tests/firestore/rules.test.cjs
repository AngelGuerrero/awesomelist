const fs = require('node:fs')
const path = require('node:path')
const { test, before, after, beforeEach } = require('node:test')
const { initializeTestEnvironment, assertSucceeds, assertFails } = require('@firebase/rules-unit-testing')
const { doc, setDoc, getDoc, updateDoc, deleteDoc, collection, query, where, getDocs, setLogLevel } = require('firebase/firestore')

let environment
let owner
let stranger
let anonymous

before(async () => {
  if (process.env.FIRESTORE_EMULATOR_HOST !== '127.0.0.1:8180') {
    throw new Error('Estas pruebas requieren el emulador local en 127.0.0.1:8180')
  }
  setLogLevel('silent')
  environment = await initializeTestEnvironment({
    projectId: 'demo-awesomelist',
    firestore: {
      host: '127.0.0.1',
      port: 8180,
      rules: fs.readFileSync(path.join(__dirname, '../../firebase/firestore.rules'), 'utf8')
    }
  })
  owner = environment.authenticatedContext('owner').firestore()
  stranger = environment.authenticatedContext('stranger').firestore()
  anonymous = environment.unauthenticatedContext().firestore()
})

beforeEach(async () => {
  await environment.clearFirestore()
  await environment.withSecurityRulesDisabled(async context => {
    const db = context.firestore()
    await Promise.all([
      setDoc(doc(db, 'collections/work'), { name: 'Trabajo', userId: 'owner' }),
      setDoc(doc(db, 'collections/home'), { name: 'Casa', userId: 'owner' }),
      setDoc(doc(db, 'collections/foreign'), { name: 'Ajena', userId: 'stranger' }),
      setDoc(doc(db, 'todos/legacy'), { title: 'Antigua', createdBy: 'owner' }),
      setDoc(doc(db, 'todos/task'), { title: 'Tarea', createdBy: 'owner', collectionId: 'work' }),
      setDoc(doc(db, 'users/owner'), { fullName: 'Usuario', email: 'owner@example.com' }),
      setDoc(doc(db, 'lists/legacy'), { userId: 'owner', name: 'Lista antigua' })
    ])
  })
})

after(async () => {
  if (environment) await environment.cleanup()
})

test('el propietario crea y consulta sus agrupaciones', async () => {
  await assertSucceeds(setDoc(doc(owner, 'collections/new'), { name: 'Nuevo grupo', userId: 'owner' }))
  await assertSucceeds(getDoc(doc(owner, 'collections/work')))
  await assertSucceeds(getDocs(query(collection(owner, 'collections'), where('userId', '==', 'owner'))))
})

test('una colección no puede crearse a nombre de otra persona', async () => {
  await assertFails(setDoc(doc(owner, 'collections/new'), { name: 'Grupo', userId: 'stranger' }))
})

test('el propietario puede renombrar sin cambiar la pertenencia de las tareas', async () => {
  await assertSucceeds(updateDoc(doc(owner, 'collections/work'), { name: 'Proyectos', lastUpdated: new Date() }))
  const group = await getDoc(doc(owner, 'collections/work'))
  const task = await getDoc(doc(owner, 'todos/task'))
  if (group.data().name !== 'Proyectos' || task.data().collectionId !== 'work') {
    throw new Error('El nombre o la pertenencia no coincide')
  }
})

test('usuarios ajenos y anónimos no leen ni modifican colecciones', async () => {
  await assertFails(getDoc(doc(stranger, 'collections/work')))
  await assertFails(getDoc(doc(anonymous, 'collections/work')))
  await assertFails(updateDoc(doc(stranger, 'collections/work'), { name: 'Cambiar' }))
  await assertFails(updateDoc(doc(anonymous, 'collections/work'), { name: 'Cambiar' }))
  await assertFails(setDoc(doc(anonymous, 'collections/new'), { name: 'Grupo', userId: 'owner' }))
})

test('no se puede cambiar el propietario de un grupo', async () => {
  await assertFails(updateDoc(doc(owner, 'collections/work'), { userId: 'stranger' }))
})

test('se rechazan los nombres vacíos o demasiado largos', async () => {
  for (const name of ['', '   ', 'x'.repeat(201)]) {
    await assertFails(setDoc(doc(owner, 'collections/new'), { name, userId: 'owner' }))
    await assertFails(updateDoc(doc(owner, 'collections/work'), { name }))
  }
})

test('crear una tarea en un grupo propio y consultarla es válido', async () => {
  await assertSucceeds(setDoc(doc(owner, 'todos/new'), { title: 'Nueva', createdBy: 'owner', collectionId: 'work' }))
  await assertSucceeds(getDoc(doc(owner, 'todos/new')))
  await assertSucceeds(getDocs(query(collection(owner, 'todos'), where('createdBy', '==', 'owner'))))
})

test('las tareas sin colección y los documentos antiguos siguen siendo válidos', async () => {
  await assertSucceeds(setDoc(doc(owner, 'todos/free'), { title: 'Libre', createdBy: 'owner', collectionId: null }))
  await assertSucceeds(getDoc(doc(owner, 'todos/legacy')))
  await assertSucceeds(updateDoc(doc(owner, 'todos/legacy'), { done: true }))
  await assertSucceeds(updateDoc(doc(owner, 'todos/legacy'), { collectionId: 'work' }))
})

test('mover entre grupos y quitar la pertenencia conserva el documento', async () => {
  await assertSucceeds(updateDoc(doc(owner, 'todos/task'), { collectionId: 'home' }))
  await assertSucceeds(updateDoc(doc(owner, 'todos/task'), { collectionId: null }))
  await assertSucceeds(getDoc(doc(owner, 'todos/task')))
})

test('no se pueden asignar grupos ajenos o inexistentes, ni al crear ni al mover', async () => {
  for (const collectionId of ['foreign', 'missing']) {
    await assertFails(setDoc(doc(owner, 'todos/new'), { title: 'Nueva', createdBy: 'owner', collectionId }))
    await assertFails(updateDoc(doc(owner, 'todos/task'), { collectionId }))
  }
})

test('la referencia de colección debe ser un ID de documento o null', async () => {
  for (const collectionId of [true, [], {}, '', 'collections/work']) {
    await assertFails(setDoc(doc(owner, 'todos/new'), { title: 'Nueva', createdBy: 'owner', collectionId }))
  }
})

test('nadie puede mover o borrar tareas ajenas ni transferir su propietario', async () => {
  await assertFails(updateDoc(doc(stranger, 'todos/task'), { collectionId: 'foreign' }))
  await assertFails(deleteDoc(doc(stranger, 'todos/task')))
  await assertFails(updateDoc(doc(owner, 'todos/task'), { createdBy: 'stranger' }))
  await assertFails(setDoc(doc(owner, 'todos/new'), { createdBy: 'stranger', collectionId: null }))
})

test('una consulta sin filtro de propietario se deniega', async () => {
  await assertFails(getDocs(collection(owner, 'todos')))
  await assertFails(getDocs(collection(owner, 'collections')))
})

test('los usuarios anónimos no leen ni crean tareas', async () => {
  await assertFails(getDoc(doc(anonymous, 'todos/task')))
  await assertFails(setDoc(doc(anonymous, 'todos/new'), { createdBy: 'owner', collectionId: null }))
})

test('una colección no se elimina dejando tareas huérfanas', async () => {
  await assertFails(deleteDoc(doc(owner, 'collections/work')))
})

test('un usuario puede crear, consultar y actualizar únicamente su perfil', async () => {
  await assertSucceeds(getDoc(doc(owner, 'users/owner')))
  await assertSucceeds(updateDoc(doc(owner, 'users/owner'), { fullName: 'Mi nombre' }))
  await assertSucceeds(setDoc(doc(stranger, 'users/stranger'), { fullName: 'Otro usuario' }))
})

test('perfiles privados: anónimos y otros usuarios no pueden leer ni escribirlos', async () => {
  await assertFails(getDoc(doc(anonymous, 'users/owner')))
  await assertFails(getDoc(doc(stranger, 'users/owner')))
  await assertFails(updateDoc(doc(stranger, 'users/owner'), { fullName: 'Cambiar' }))
  await assertFails(setDoc(doc(anonymous, 'users/new'), { fullName: 'Crear' }))
  await assertFails(setDoc(doc(owner, 'users/stranger'), { fullName: 'Crear otro perfil' }))
})

test('buscar todos los perfiles o un correo ajeno se deniega', async () => {
  await assertFails(getDocs(collection(owner, 'users')))
  await assertFails(getDocs(query(collection(anonymous, 'users'), where('email', '==', 'owner@example.com'))))
  await assertFails(getDocs(query(collection(stranger, 'users'), where('email', '==', 'owner@example.com'))))
})

test('las rutas desconocidas y las listas antiguas quedan cerradas', async () => {
  await assertFails(getDoc(doc(owner, 'lists/legacy')))
  await assertFails(setDoc(doc(owner, 'lists/new'), { userId: 'owner' }))
  await assertFails(setDoc(doc(owner, 'other/new'), { userId: 'owner' }))
  await assertFails(setDoc(doc(owner, 'collections/work/lists/new'), { userId: 'owner' }))
})

test('el borrado aislado de perfiles no está habilitado', async () => {
  await assertFails(deleteDoc(doc(owner, 'users/owner')))
})
