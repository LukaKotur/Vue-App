import Vue from 'vue'
import App from './App'
import * as firebase from 'firebase'
import router from './router'
import Vuetify from 'vuetify'
import 'vuetify/dist/vuetify.min.css'
import {store} from './store'
import DateFilter from './filters/date'
import AlertComponent from './components/shared/Alert.vue'
import EditMeetupDetailsDialog from './components/Meetup/Edit/EditMeetupDetailsDialog'
import EditMeetupDateDialog from './components/Meetup/Edit/EditMeetupDateDialog'
import EditMeetupTimeDialog from './components/Meetup/Edit/EditMeetupTimeDialog'
import RegisterDialog from './components/Meetup/Registration/RegisterDialog'

Vue.use(Vuetify);

Vue.config.productionTip = false;

Vue.filter('date', DateFilter);
Vue.component('app-alert', AlertComponent);
Vue.component('app-edit-meetup-details-dialog', EditMeetupDetailsDialog);
Vue.component('app-edit-meetup-date-dialog', EditMeetupDateDialog);
Vue.component('app-edit-meetup-time-dialog', EditMeetupTimeDialog);
Vue.component('app-register-dialog', RegisterDialog);
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App),
  created() {
    firebase.initializeApp({
      apiKey: "AIzaSyBiEShc7qzPloVx_0L6L_kZiN1nfI8g8o0",
      authDomain: "turing-booster-178614.firebaseapp.com",
      databaseURL: "https://turing-booster-178614.firebaseio.com",
      projectId: "turing-booster-178614",
      storageBucket: "turing-booster-178614.appspot.com",
    })

    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        this.$store.dispatch('autoSignIn', user)
        this.$store.dispatch('fetchUserData')
      }
    });

    this.$store.dispatch('loadMeetups')
  }
});
