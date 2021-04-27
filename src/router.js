import Vue from 'vue'
import Router from 'vue-router'

import locations from './views/locations.vue'
import detail from './views/detail.vue'

Vue.use(Router)

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  scrollBehavior() {
    return { x: 0, y: 0 };
  },
  routes: [
    {
      path: '/',
      name: 'locations',
      component: locations,
    },
    {
      path: '/detail',
      name: 'detail',
      component: detail,
    }
  ]
})