import Vue from 'vue'

const components = require.context(
  '../components', // 타겟 디렉토리
  true, // 하위 디렉토리 포함
  /^(?!.*(?:deprecated|test)).*\.vue$/i // vue 파일 패턴
)

const controlsComponents = []
const controlPrefixes = ['effector', 'target', 'robot', 'joint', 'link']

components.keys().forEach(file => {
  var component = file
  .split('/')
  .pop()
  .replace('.vue', '')
  .split(/(?=[A-Z])/)
  .map(str => str.toLowerCase())
  .join('-');


  if (controlPrefixes.some(prefix => component.startsWith(prefix))) {
    controlsComponents.push(component)
  }

  Vue.component(component, components(file).default)
})

Vue.prototype.$controlsComponents = controlsComponents
