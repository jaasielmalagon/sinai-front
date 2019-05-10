import Vue from 'vue'
import Router from 'vue-router'
import Login from './views/Login'
import NotFound from './views/NotFound'
import Home from './views/Home'
import Prestamos from './views/Prestamos'

Vue.use(Router);

export default new Router({
    mode: 'history',
    routes: [
        {
            path: '/login',
            name: 'login',
            component: Login,
            // beforeEnter: guestUser
        },
        {
            path: '/',
            name: 'home',
            component: Home
        },
        {
            path: '/prestamos',
            name: 'prestamos',
            component: Prestamos
        },
        { path: '*', component: NotFound }
    ]
})