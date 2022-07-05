import { createApp } from 'vue'
import App from './App.vue'

import router from '@/router/index'

// element plus message 样式
import "element-plus/es/components/message/style/index"
// element plus loading 样式
import "element-plus/es/components/loading/style/index"

createApp(App).use(router).mount('#app')


