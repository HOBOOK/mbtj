import Vue from 'vue'
import Vuex from 'vuex';
Vue.use(Vuex)

//엄격모드 비활성화
export const strict = false

const store = () => new Vuex.Store({
  state: {
    theme: 'dark',
    locale: 'ko',
  },
  mutations: {
    
    setTheme: (state, theme) => {
      state.theme = theme
    },
    setLocale: (state, locale) => {
      state.locale = locale
    },
   
  },
  actions: {

  },
  getters: {
   
  }
})

export default store