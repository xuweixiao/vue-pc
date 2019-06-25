import Vue from 'vue'
import Router from 'vue-router'
import User from '@/modules/user/list'
import Login from '@/common/components/Login'
import ModifyPass from '@/modules/user/modifyPass'
import Tag from '@/modules/tag/tag'
// const ImgTag = () => import('@/modules/tag/imgTag')

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'home',
      component: Login
    },
    {
      path: '/user',
      name: 'user',
      component: User
    },
    {
      path: '/login',
      name: 'login',
      component: Login
    },
    {
      path: '/modifyPass',
      name: 'modifyPass',
      component: ModifyPass
    },
    {
      path: '/tag',
      name: 'tag',
      component: Tag
    }
  ]
})
