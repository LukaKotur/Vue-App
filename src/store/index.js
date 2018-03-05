import Vue from 'vue'
import Vuex from 'vuex'
import * as firebase from 'firebase'

Vue.use(Vuex)

export const store = new Vuex.Store({
  state: {
    loadedMeetups:
      [
        {
          imageUrl:
            "https://lonelyplanetimages.imgix.net/mastheads/GettyImages-538096543_medium.jpg?sharp=10&vib=20&w=1200",
          id: "htrsujnhmprsnphrs",
          date: new Date(),
          title: "Meetup in NY",
          location: "NY",
          description: "Meetup in NY ma boj"
        },
        {
          imageUrl:
            "https://en.parisinfo.com/var/otcp/sites/images/node_43/node_51/node_233/seine-nuit-%7C-740x380-%7C-%C2%A9-thinkstock/12354-3-fre-FR/Seine-nuit-%7C-740x380-%7C-%C2%A9-Thinkstock.jpg",
          id: "2",
          date: new Date(),
          title: "Meetup in Paris",
          location: "PARIS",
          description: "Meetup in PARIS ma boj"
        }
      ],
    user: null,
    loading: false,
    error: null
  },
  mutations: {
    createMeetup(state, payload) {
      state.loadedMeetups.push(payload)
    },
    setUser(state, payload) {
      state.user = payload
    },
    setLoading(state, payload) {
      state.loading = payload
    },
    setError(state, payload) {
      state.error = payload
    },
    clearError(state) {
      state.error = null
    },
    setLoadedMeetups(state, payload) {
      state.loadedMeetups = payload
    }
  },
  actions: {
    createMeetup({commit, getters}, payload) {
      const meetup = {
        title: payload.title,
        location: payload.location,
        description: payload.description,
        date: payload.date.toISOString(),
        creatorId: getters.user.id
      };
      // Get to Firebase And store it
      let imageUrl;
      let key;
      firebase.database().ref('meetups').push(meetup)
        .then((data) => {
          key = data.key;
          return key
        })
        .then(key => {
          const filename = payload.image.name
          const ext = filename.slice(filename.lastIndexOf('.'))
          return firebase.storage().ref('meetups/' + key + ext).put(payload.image)

        })
        .then(fileData => {
          imageUrl = fileData.metadata.downloadURLs[0]
          return firebase.database().ref('meetups').child(key).update({imageUrl: imageUrl})
        })
        .then(() => {
          console.log(key)
          console.log(imageUrl)
          commit('createMeetup', {
            ...meetup,
            imageUrl: imageUrl,
            id: key
          })
        })
        .catch((err) => {
          console.log(err)
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
            registeredMeetups: []
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
            registeredMeetups: []
          };
          commit('setUser', newUser)
        }).catch(err => {
        commit('setLoading', false);
        commit('setError', err);
        console.log(err)
      })
    },
    autoSignIn({commit}, payload) {
      commit('setUser', {id: payload.uid, registeredMeetups: []})
    },
    logout({commit}) {
      firebase.auth().signOut();
      commit('setUser', null)
    },
    clearError({commit}) {
      commit('clearError')
    },
    loadMeetups({commit}) {
      commit('setLoading', true);
      firebase.database().ref('meetups').once('value')
        .then((data) => {
          const meetups = [];
          const obj = data.val();
          for (let key in obj) {
            meetups.push({
              id: key,
              title: obj[key].title,
              description: obj[key].description,
              imageUrl: obj[key].imageUrl,
              date: obj[key].date,
              creatorId: obj[key].creatorId
            })
          }
          commit('setLoadedMeetups', meetups)
          commit('setLoading', false);
        })
        .catch(err => {
          commit('setLoading', false);
          console.log(err)
        })
    }
  },
  getters: {
    loadedMeetups(state) {
      return state.loadedMeetups.sort((meetupA, meetupB) => {
        return meetupA.date > meetupB.date
      })
    },
    loadedMeetup(state) {
      return (meetupId) => {
        return state.loadedMeetups.find((meetup) => {
          return meetup.id == meetupId
        })
      }
    },
    featuredMeetups(state, getters) {
      return getters.loadedMeetups.slice(0, 5);
    },
    user(state) {
      return state.user;
    },
    loading(state) {
      return state.loading
    },
    error(state) {
      return state.error
    }
  }
})
