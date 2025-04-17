import { createApp } from 'vue'
import './style.css'
import EditorApp from './editor-app.vue'

import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import 'splitpanes/dist/splitpanes.css'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import zhCn from 'element-plus/dist/locale/zh-cn.mjs'
// 解决非被动事件监听警告，提升滚动性能
//import "default-passive-events";


const app = createApp(EditorApp)

for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component)
}
app.use(ElementPlus, {
    locale: zhCn,
})

app.use(ElementPlus)
app.mount('#app')