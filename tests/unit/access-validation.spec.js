import { createLocalVue, mount } from '@vue/test-utils'
import VueFormulate from '@braid/vue-formulate'
import EmailForm from '@/Views/Access/Shared/EmailForm'
import user from '@/store/modules/User'
import { firebase, usersCollection } from '@/data/FirebaseConfig'

const settle = async () => {
  for (let i = 0; i < 3; i++) await new Promise(resolve => setTimeout(resolve, 0))
}

describe('Correo: validación local sin acceso a perfiles', () => {
  let wrapper
  let dispatch

  function create (value = '') {
    const localVue = createLocalVue()
    localVue.use(VueFormulate)
    dispatch = jest.fn()
    wrapper = mount(EmailForm, { localVue, propsData: { value }, mocks: { $store: { dispatch } } })
  }

  afterEach(() => wrapper.destroy())

  test('un correo válido permite continuar sin consultar Firestore', async () => {
    create()
    await wrapper.find('input').setValue('persona@example.com')
    await wrapper.find('input').trigger('keyup')
    await settle()
    expect(wrapper.emitted('passValidation').slice(-1)).toEqual([[true]])
    expect(wrapper.emitted('input').slice(-1)).toEqual([['persona@example.com']])
    expect(dispatch).not.toHaveBeenCalled()
    expect(usersCollection.where).not.toHaveBeenCalled()
  })

  test.each(['', 'no-es-correo', 'a'.repeat(45) + '@example.com'])('un correo inválido impide continuar: %p', async value => {
    create()
    await wrapper.find('input').setValue(value)
    await wrapper.find('input').trigger('keyup')
    await settle()
    expect(wrapper.emitted('passValidation').slice(-1)).toEqual([[false]])
    expect(dispatch).not.toHaveBeenCalled()
  })

  test('no considera válido un estado de validación todavía desconocido', async () => {
    create()
    await wrapper.setData({ validations: {} })
    wrapper.vm.performValidation()
    expect(wrapper.emitted('passValidation').slice(-1)).toEqual([[false]])
  })

  test('el valor inicial y los cambios del padre se reflejan en el control', async () => {
    create('persona@example.com')
    await settle()
    expect(wrapper.find('input').element.value).toBe('persona@example.com')
    expect(wrapper.emitted('passValidation').slice(-1)).toEqual([[true]])
    await wrapper.setProps({ value: '' })
    await settle()
    expect(wrapper.find('input').element.value).toBe('')
    expect(wrapper.emitted('passValidation').slice(-1)).toEqual([[false]])
  })
})

describe('Firebase Auth decide acceso, registro y recuperación', () => {
  let auth

  beforeEach(() => {
    auth = {
      signInWithEmailAndPassword: jest.fn(),
      createUserWithEmailAndPassword: jest.fn(),
      sendPasswordResetEmail: jest.fn()
    }
    firebase.auth.mockReturnValue(auth)
  })

  test('ingresar no necesita un documento público de perfil', async () => {
    auth.signInWithEmailAndPassword.mockResolvedValue({ user: { uid: 'owner' } })
    const result = await user.actions.signInWithEmailAndPassword({}, { email: 'persona@example.com', password: 'password' })
    expect(result.error).toBe(false)
    expect(auth.signInWithEmailAndPassword).toHaveBeenCalledWith('persona@example.com', 'password')
    expect(usersCollection.where).not.toHaveBeenCalled()
  })

  test('un error de credenciales se devuelve para mostrarlo en el formulario', async () => {
    auth.signInWithEmailAndPassword.mockRejectedValue(new Error('Credenciales incorrectas'))
    const result = await user.actions.signInWithEmailAndPassword({}, { email: 'persona@example.com', password: 'password' })
    expect(result).toMatchObject({ error: true, message: 'Credenciales incorrectas' })
  })

  test('Firebase Auth rechaza un correo ya registrado', async () => {
    auth.createUserWithEmailAndPassword.mockRejectedValue(new Error('Correo registrado'))
    const result = await user.actions.createUserWithEmailAndPassword({}, { email: 'persona@example.com', password: 'password' })
    expect(result).toMatchObject({ error: true, message: 'Correo registrado' })
  })

  test('recuperar contraseña llama directamente a Auth sin buscar perfiles', async () => {
    auth.sendPasswordResetEmail.mockResolvedValue(undefined)
    const result = await user.actions.restorePassword({}, 'persona@example.com')
    expect(result.error).toBe(false)
    expect(auth.sendPasswordResetEmail).toHaveBeenCalledWith('persona@example.com')
    expect(usersCollection.where).not.toHaveBeenCalled()
  })

  test('un error de recuperación se devuelve al llamador', async () => {
    auth.sendPasswordResetEmail.mockRejectedValue(new Error('No se pudo enviar el correo'))
    const result = await user.actions.restorePassword({}, 'persona@example.com')
    expect(result).toMatchObject({ error: true, message: 'No se pudo enviar el correo' })
  })
})
