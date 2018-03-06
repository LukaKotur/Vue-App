import Vue from 'vue'
import Vuex from 'vuex'
import meetup from './Meetup'
import user from './User'
import shared from './Shared'

Vue.use(Vuex)

export const store = new Vuex.Store({
  modules: {
    meetup: meetup,
    user: user,
    shared: shared
  }
});
