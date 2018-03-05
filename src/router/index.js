import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/components/Home'
import Meetups from '@/components/Meetup/Meetups'
import CreateMeetup from '@/components/Meetup/CreateMeetup'
import UserProfile from '@/components/User/Profile'
import UserSignUp from '@/components/User/SignUp'
import UserSignIn from '@/components/User/SignIn'
import Meetup from '@/components/Meetup/Meetup'
import AuthGuard from './auth-guard'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Home',
      component: Home
    },
    {
      path: '/meetups',
      component: Meetups
    },
    {
      path: '/meetups/new',
      component: CreateMeetup,
      beforeEnter: AuthGuard
    },
    {
      path: '/meetups/:id',
      props: true,
      component: Meetup
    },
    {
      path: '/profile',
      component: UserProfile,
      beforeEnter: AuthGuard
    },
    {
      path: '/signin',
      component: UserSignIn
    },
    {
      path: '/signup',
      component: UserSignUp
    },
  ],
  mode: 'history'
})
