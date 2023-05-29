import { usersCollection, firebase } from '@/data/FirebaseConfig'
import { firestoreAction } from 'vuexfire'

export default {
  namespaced: true,

  state: {
    //
    // Current user profile
    currentProfile: null,
    //
    //
    currentUser: null,
    //
    //
    isLoadingUser: true,
    //
    // All database users
    users: []
  },

  getters: {
    isAuthenticated (state) {
      return !!(state.currentUser && state.currentUser !== {})
    },

    isLoadingUser (state) {
      return state.isLoadingUser
    }
  },

  mutations: {
    setCurrentUser (state, payload) {
      state.currentUser = payload
    },

    setCurrentProfile (state, payload) {
      state.currentProfile = payload
    },

    setIsLoadingUser (state, payload) {
      state.isLoadingUser = payload
    }
  },

  actions: {
    setCurrentUser: ({ commit }, user) => {
      commit('setCurrentUser', user)
      return { error: false, message: 'User loaded successfully' }
    },

    fetchUserProfile: async ({ commit }, uid) => {
      const returnValue = {
        error: false,
        message: '',
        event: 'fetching user profile',
        data: null
      }

      return new Promise((resolve, reject) => {
        usersCollection
          .doc(uid)
          .get()
          .then(result => {
            commit('setCurrentProfile', result.data())
            commit('setIsLoadingUser', false)
            resolve(returnValue)
          })
          .catch(error => {
            returnValue.error = true
            returnValue.message = error.message
            returnValue.errorFatal = true
            // dispatch('pushAsyncLog', returnValue, { root: true })
            reject(returnValue)
          })
      })
    },

    bindUsers: firestoreAction(({ bindFirestoreRef }) => {
      return bindFirestoreRef('users', usersCollection)
    }),

    createUserAccount: async ({ dispatch }, user) => {
      const returnValue = { error: false, message: '', data: null }

      const resUserWithEmailAndPassword = await dispatch(
        'createUserWithEmailAndPassword',
        user
      )

      //
      // Error creating user with email and password ?
      if (resUserWithEmailAndPassword.error) {
        return resUserWithEmailAndPassword
      }

      //
      // Save just created user to collection
      //
      // Do not save password in database
      delete user.password

      const resUserSavedToCollection = await dispatch(
        'saveUserToUsersCollections',
        {
          uid: resUserWithEmailAndPassword.data.user.uid,
          user
        }
      )

      //
      // Error saving user to collection ?
      if (resUserSavedToCollection.error) return resUserSavedToCollection

      returnValue.message = 'Cuenta de usuario creada correctamente'
      returnValue.data = resUserSavedToCollection.data

      return returnValue
    },

    createUserWithEmailAndPassword: async ({ dispatch }, user) => {
      const returnValue = { error: false, message: '', data: null }

      const createdUser = await firebase
        .auth()
        .createUserWithEmailAndPassword(user.email, user.password)
        .catch(error => {
          returnValue.error = true
          returnValue.message = error.message
        })

      //
      // Error saving user with email with password
      if (returnValue.error) return returnValue

      returnValue.message = 'account created'
      returnValue.data = createdUser

      return returnValue
    },

    restorePassword: async ({ dispatch }, email) => {
      const returnValue = {
        error: false,
        message: 'Se ha enviado un correo para restablecer la contraseña',
        data: null
      }

      try {
        await firebase.auth().sendPasswordResetEmail(email)
      } catch (error) {
        returnValue.error = true
        returnValue.message = error.message
      }

      return returnValue
    },

    saveUserToUsersCollections: async ({ context }, { uid, user }) => {
      const returnValue = { error: false, message: '', data: null }

      await usersCollection
        .doc(uid)
        .set(user)
        .catch(err => {
          returnValue.error = true
          returnValue.message = err.message
        })

      if (returnValue.error) return returnValue

      returnValue.message = 'user saved'
      returnValue.data = uid

      return returnValue
    },

    signInWithEmailAndPassword: async ({ dispatch }, { email, password }) => {
      const returnValue = { error: false, message: 'ok', data: null }

      await firebase
        .auth()
        .signInWithEmailAndPassword(email, password)
        .catch(error => {
          returnValue.error = true
          returnValue.message = error.message
        })

      return returnValue
    },

    signOut: async ({ commit }) => {
      const returnValue = { error: false, message: '' }

      await firebase
        .auth()
        .signOut()
        .catch(error => {
          returnValue.error = true
          returnValue.message = error
        })
      commit('setCurrentUser', null)

      return returnValue
    },

    getUserByNickName: async ({ dispatch }, nickname) => {
      const returnValue = { error: false, message: '', data: null }

      const query = await usersCollection.where('nickname', '==', nickname)

      const response = await dispatch('getDataByQuery', query, { root: true })

      if (response.error) return response

      try {
        const user = response.data.find(user => user.nickname === nickname)

        if (user) {
          returnValue.data = user
          returnValue.message = 'Usuario encontrado'
        } else {
          returnValue.error = true
          returnValue.message = 'Usuario no encontrado'
        }
      } catch (error) {
        returnValue.error = true
        returnValue.message = error.message
      }

      return returnValue
    },

    /**
     * Get a user by email
     *
     * @returnValue contains the next information
     *
     * @error is true if something went wrong or user doesn't exist
     * @message contains information about error
     * @data contains the user object, is null if user doesn't exist
     */
    getUserByEmail: async ({ dispatch }, email) => {
      const returnValue = { error: false, message: 'ok', data: null }

      const query = await usersCollection.where('email', '==', email)

      const response = await dispatch('getDataByQuery', query, { root: true })

      //
      // Error fetching data ?
      if (response.error) return response

      try {
        const user = response.data.find(user => user.email === email)

        if (user) {
          returnValue.data = user
          returnValue.message = 'Usuario encontrado'
        } else {
          returnValue.error = true
          returnValue.message = 'Usuario no encontrado'
        }
      } catch (error) {
        returnValue.error = true
        returnValue.message = error.message
      }

      return returnValue
    }
  }
}
