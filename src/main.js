import Vue from 'vue'
import './plugins/vuetify'
import App from './App.vue'
import router from './router'
import VueResource from 'vue-resource';
import VueFire from 'vuefire'


Vue.config.productionTip = false
Vue.use(VueResource)
Vue.use(VueFire)

new Vue({
  router,
  VueResource,
  render: h => h(App),
}).$mount('#app')
