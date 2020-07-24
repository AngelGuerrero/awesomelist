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
    // All database users
    users: []
  },

  mutations: {
    setCurrentUser (state, payload) { state.currentUser = payload },

    setCurrentProfile (state, payload) { state.currentProfile = payload }
  },

  actions: {
    setCurrentUser: ({ commit }, user) => {
      commit('setCurrentUser', user)
      return { error: false, message: 'User loaded successfully' }
    },

    fetchUserProfile: async ({ commit, dispatch }, uid) => {
      const retval = { error: false, message: '', event: 'fetching user profile', data: null }

      return new Promise((resolve, reject) => {
        usersCollection
          .doc(uid)
          .get()
          .then(result => {
            commit('setCurrentProfile', result.data())
            resolve(retval)
          })
          .catch(error => {
            retval.error = true
            retval.message = error.message
            retval.errorFatal = true
            dispatch('pushAsyncLog', retval, { root: true })
            reject(retval)
          }
          )
      })
    },

    bindUsers: firestoreAction(({ bindFirestoreRef }) => {
      return bindFirestoreRef('users', usersCollection)
    }),

    createUserAccount: async ({ dispatch }, user) => {
      const retval = { error: false, message: '', data: null }

      const getvalUserWithEmailAndPassword = await dispatch(
        'createUserWithEmailAndPassword',
        user
      )

      //
      // Error creating user with email and password ?
      if (getvalUserWithEmailAndPassword.error) {
        return getvalUserWithEmailAndPassword
      }

      //
      // Save just created user to collection
      //
      // Do not save password in database
      delete user.password

      const getvalUserSavedToCollection = await dispatch(
        'saveUserToUsersCollections',
        {
          uid: getvalUserWithEmailAndPassword.data.user.uid,
          user
        }
      )

      //
      // Error saving user to collection ?
      if (getvalUserSavedToCollection.error) return getvalUserSavedToCollection

      retval.message = 'Cuenta de usuario creada correctamente'
      retval.data = getvalUserSavedToCollection.data

      return retval
    },

    createUserWithEmailAndPassword: async ({ dispatch }, user) => {
      const retval = { error: false, message: '', data: null }

      const createdUser = await firebase
        .auth()
        .createUserWithEmailAndPassword(user.email, user.password)
        .catch(error => {
          retval.error = true
          retval.message = error.message
        })

      //
      // Error saving user with email with password
      if (retval.error) return retval

      retval.message = 'account created'
      retval.data = createdUser

      return retval
    },

    saveUserToUsersCollections: async ({ context }, { uid, user }) => {
      const retval = { error: false, message: '', data: null }

      await usersCollection
        .doc(uid)
        .set(user)
        .catch(err => {
          retval.error = true
          retval.message = err.message
        })

      //
      // Error saving user to collections
      if (retval.error) return retval

      retval.message = 'user saved'
      retval.data = uid

      return retval
    },

    signInWithEmailAndPassword: async ({ dispatch }, { email, password }) => {
      const retval = { error: false, message: 'ok', data: null }

      await firebase
        .auth()
        .signInWithEmailAndPassword(email, password)
        .catch(error => {
          retval.error = true
          retval.message = error.message
        })

      return retval
    },

    signOut: async ({ context }) => {
      const retval = { error: false, message: '' }

      await firebase
        .auth()
        .signOut()
        .catch(error => {
          retval.error = true
          retval.message = error
        })

      return retval
    },

    // #region [ Blue ] Queries

    getUserByNickName: async ({ dispatch }, nickname) => {
      const retval = { error: false, message: '', data: null }

      const query = await usersCollection.where('nickname', '==', nickname)

      const getval = await dispatch('getDataByQuery', query, { root: true })

      //
      // Error fetching data ?
      if (getval.error) return getval

      try {
        const user = getval.data.find(user => user.nickname === nickname)

        if (user) {
          retval.data = user
          retval.message = 'Usuario encontrado'
        } else {
          retval.error = true
          retval.message = 'Usuario no encontrado'
        }
      } catch (error) {
        retval.error = true
        retval.message = error.message
      }

      return retval
    },

    getUserByEmail: async ({ dispatch }, email) => {
      const retval = { error: false, message: '', data: null }

      const query = await usersCollection.where('email', '==', email)

      const getval = await dispatch('getDataByQuery', query, { root: true })

      //
      // Error fetching data ?
      if (getval.error) return getval

      try {
        const user = getval.data.find(user => user.email === email)

        if (user) {
          retval.data = user
          retval.message = 'Usuario encontrado'
        } else {
          retval.error = true
          retval.message = 'Usuario no encontrado'
        }
      } catch (error) {
        retval.error = true
        retval.message = error.message
      }

      return retval
    }

    // #endregion
  }
}
