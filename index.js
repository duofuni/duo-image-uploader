import uploader from './src/index.vue'
import duoImageViewer from 'duo-image-viewer'

const duoImageUploader = {
  install: Vue => {
    Vue.use(duoImageViewer)
    Vue.component('duo-image-uploader', uploader)
  }
}

export default duoImageUploader