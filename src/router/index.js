import Vue from "vue";
import VueRouter from "vue-router";
import Home from '@/views/Home'
import Index from '@/views/Index.vue'
import Login from '@/views/Login'
import Thanks from '@/views/Thanks'
import Goods from '@/views/Goods'

Vue.use(VueRouter);

const routes = [{
    path: '/',
    redirect: '/home',
    name: 'home',
    component: Index,
    children: [{
        path: 'home',
        component: Home
      },
      {
        path: '/thanks',
        name: 'thanks',
        component: Thanks
      },
      {
        path: '/goods',
        name: 'goods',
        component: Goods
      }
    ]
  },
  {
    path: '/login',
    name: 'login',
    component: Login
  },

];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes
});

export default router;