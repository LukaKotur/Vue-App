import * as firebase from 'firebase'

export default {
  state: {
    user: null,
  },
  mutations: {
    registerUserForMeetup(state, payload) {
      const id = payload.id
      if (state.user.registeredMeetups.findIndex(meetup => meetup.id === id) >= 0) {
        return
      }
      state.user.registeredMeetups.push(id)
      state.user.firebaseKeys[id] = payload.firebaseKey
    },
    unregisterUserFromMeetup(state, payload) {
      const registeredMeetups = state.user.registeredMeetups;
      registeredMeetups.splice(registeredMeetups.findIndex(meetup => meetup.id === payload), 1);
      Reflect.deleteProperty(state.user.firebaseKeys, payload)
    },

    setUser(state, payload) {
      state.user = payload
    },
  },
  actions: {
    registerUserForMeetup({commit, getters}, payload) {
      commit('setLoading', true)
      const user = getters.user;
      firebase.database().ref('/users/' + user.id).child('/registration/')
        .push(payload)
        .then(data => {
          commit('setLoading', false)
          commit('registerUserForMeetup', {id: payload, firebaseKey: data.key})
        }).catch(err => {
        console.log(err)
        commit('setLoading', false)
      })
    },
    unregisterUserFromMeetup({commit, getters}, payload) {
      commit('setLoading', true)
      const user = getters.user
      if (!user.firebaseKeys) {
        return
      }
      const firebaseKey = user.firebaseKeys[payload]
      firebase.database().ref('/users/' + user.id + '/registration/').child(firebaseKey).remove()
        .then(() => {
          commit('setLoading', false)
          commit('unregisterUserFromMeetup', payload)
        }).catch(err => {
        console.log(err)
        commit('setLoading', false)
      })
    },
    signUserUp({commit}, payload) {
      commit('setLoading', true);
      commit('clearError');
      firebase.auth().createUserWithEmailAndPassword(payload.email, payload.password)
        .then(user => {
          commit('setLoading', false);
          const newUser = {
            id: user.uid,
            registeredMeetups: [],
            firebaseKeys: {}
          };
          commit('setUser', newUser)
        }).catch(err => {
        commit('setLoading', false);
        commit('setError', err);
        console.log(err)
      })
    },
    signUserIn({commit}, payload) {
      commit('setLoading', true);
      commit('clearError');
      firebase.auth().signInWithEmailAndPassword(payload.email, payload.password)
        .then(user => {
          commit('setLoading', false);
          const newUser = {
            id: user.uid,
            registeredMeetups: [],
            firebaseKeys: {}
          };
          commit('setUser', newUser)
        }).catch(err => {
        commit('setLoading', false);
        commit('setError', err);
        console.log(err)
      })
    },
    autoSignIn({commit}, payload) {
      commit('setUser', {
        id: payload.uid,
        registeredMeetups: [],
        firebaseKeys: {}
      })
    },
    fetchUserData({commit, getters}) {
      commit('setLoading', true)
      firebase.database().ref('/users/' + getters.user.id + '/registration/').once('value')
        .then(data => {
          const values = data.val();
          let registeredMeetups = [];
          let swappedPairs = {};
          for (let key in values) {
            registeredMeetups.push(values[key])
            swappedPairs[values[key]] = key
          }
          const updatedUser = {
            id: getters.user.id,
            registeredMeetups: registeredMeetups,
            firebaseKeys: swappedPairs
          }
          commit('setLoading', false)
          commit('setUser', updatedUser)
        })
        .catch(err => {
          console.log(err)
          commit('setLoading', false)
        })
    },
    logout({commit}) {
      firebase.auth().signOut();
      commit('setUser', null)
    },
  },
  getters: {
    user(state) {
      return state.user;
    },
  }
};
