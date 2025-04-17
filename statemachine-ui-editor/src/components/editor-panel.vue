<template>
  <div class="editor-panel">

    <el-button-group size="small">
      <el-button @click="downloadXml" :icon="Download">导出XML</el-button>
      <el-button @click="showUpload" :icon="Upload">导入XML</el-button>
      <el-button @click="exportImg" :icon="View">导出图片</el-button>
      <el-button @click="switchMap" :icon="MapLocation">切换小地图</el-button>
    </el-button-group>

    <input ref="refUpload" type="file" id="fileInput" accept=".xml" @change="handleFileChange" style="display:none">
  </div>
</template>

<script setup lang="ts">


import {ref} from "vue";
import {ElMessageBox} from "element-plus";
import {MapLocation, View, Download, Upload} from '@element-plus/icons-vue'

const refUpload = ref()


const emits = defineEmits(['exportImg', 'switchMap', 'downloadXml', 'uploadXml'])
const exportImg = () => {
  emits('exportImg')
}

const switchMap = () => {
  emits('switchMap')
}

const downloadXml = () => {
  emits('downloadXml')
}

const showUpload = () => {

  ElMessageBox.confirm(
      '是否选择一个XML? 选择后会覆盖你的设计。',
      '警告',
      {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning',
      }
  )
      .then(() => {
        refUpload.value.click()
      })

}

// 处理文件选择
const handleFileChange = (e: any) => {
  emits('uploadXml', e)
}


</script>

<style scoped lang="scss">

.editor-panel {
  position: fixed;
  bottom: 15px;
  background-color: #EFEFEF;
  z-index: 999;
  left: 20px;
}

</style>