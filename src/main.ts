import { createApp, defineComponent } from 'vue'
import { createPinia } from 'pinia'

import ImageUploaderToB64 from './components/ImageUploaderToB64.vue'

import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'

import QuillEditor from './components/QuillEditor.vue'
import '@vueup/vue-quill/dist/vue-quill.snow.css'

import FlagSelector from './components/FlagSelector/FlagSelector.vue'

import './assets/main.scss'

import App from './App.vue'
import router from './router'

const app = createApp(App)

for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}
app.component('ImageUploaderToB64', ImageUploaderToB64)
app.component('QuillEditor', QuillEditor)
app.component('FlagSelector', FlagSelector)
app.use(createPinia())
app.use(router)
app.use(ElementPlus)

app.mount('#app')
