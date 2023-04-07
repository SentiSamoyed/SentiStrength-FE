import 'element-plus/dist/index.css'
import { createApp } from 'vue'
import App from './App.vue'
import { ElMessage } from 'element-plus'
import router from './router'

import './assets/main.css'
/* import the fontawesome core */
import { library } from '@fortawesome/fontawesome-svg-core'

/* import font awesome icon component */
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

/* import specific icons */
import { faHouseUser, faMagnifyingGlassChart, faSliders, faFileLines, faTable } from '@fortawesome/free-solid-svg-icons'

const app = createApp(App)

/* add icons to the library */
library.add(faHouseUser, faMagnifyingGlassChart, faSliders, faFileLines, faTable)


app.use(router)
app.use(ElMessage)

app
  .component('font-awesome-icon', FontAwesomeIcon)
  .mount('#app')
