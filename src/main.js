import 'element-plus/dist/index.css'
import { createApp } from 'vue'
import App from './App.vue'
import { ElMessage, ElMessageBox, ElNotification } from 'element-plus'
import router from './router'

import './assets/main.css'
/* import the fontawesome core */
import { library } from '@fortawesome/fontawesome-svg-core'

/* import font awesome icon component */
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

/* import specific icons */
import {
  faClock,
  faCodeCompare,
  faFileLines,
  faHouseUser,
  faMagnifyingGlassChart,
  faPercent,
  faSearch,
  faSliders,
  faTable
} from '@fortawesome/free-solid-svg-icons'

import { faGithub } from '@fortawesome/free-brands-svg-icons/faGithub'

import VueLogger from 'vuejs3-logger'

const isProduction = import.meta.env.PROD;

const options = {
  isEnabled: true,
  logLevel : isProduction ? 'error' : 'debug',
  stringifyArguments : false,
  showLogLevel : true,
  showMethodName : true,
  separator: '|',
  showConsoleColors: true
};

const app = createApp(App)

/* add icons to the library */
library.add(faHouseUser, faMagnifyingGlassChart, faSliders, faFileLines, faTable, faGithub, faSearch, faCodeCompare, faClock, faPercent)


app.use(router)
app.use(ElMessage)
app.use(ElMessageBox)
app.use(ElNotification)
app.use(VueLogger, options)

app
  .component('font-awesome-icon', FontAwesomeIcon)
  .mount('#app')
