import Vue from 'vue'
import Router from 'vue-router'

//懒加载
const Home = () => import('@/components/home/home')
const Goods = () => import('@/components/goods/goods')
const Ratings = () => import('@/components/ratings/ratings')
const Seller = () => import('@/components/seller/seller')


Vue.use(Router)

const routes = [
  {
    path:'',
    redirect:'/goods'
  },
  {
      path:'/home',
      component:Home,
      children:[
        {
          path: '/goods',
			    component: Goods
        },
        {
          path: '/ratings',
			    component: Ratings
        },
        {
          path: '/seller',
			    component: Seller
        }
      ]
  }
]

export default new Router({
  routes,
  mode:'history'
})
