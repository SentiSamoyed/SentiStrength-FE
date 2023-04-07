import 'element-plus/dist/index.css'
import { createApp } from 'vue'
import App from './App.vue'
import { ElMessage } from 'element-plus'
import router from './router'

import './assets/main.css'

const app = createApp(App)

app.use(router)
app.use(ElMessage)

app.mount('#app')
