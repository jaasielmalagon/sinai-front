import Vue from 'vue'
import './plugins/vuetify'
import App from './App.vue'
import router from './router'
import VueResource from 'vue-resource';
import VueFire from 'vuefire'


Vue.config.productionTip = false
Vue.use(VueResource)
Vue.use(VueFire)
Vue.filter('uppercase', function (value) {
  if (!value) return ''
  value = value.toString()
  return value.toUpperCase()
});
new Vue({
  router,
  VueResource,
  render: h => h(App),
}).$mount('#app')
