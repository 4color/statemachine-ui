<template>
  <el-row style="width: 100%">
    <el-col :span="20">{{ model }}</el-col>
    <el-col :span="4" style="text-align: right; padding-right: 5px">
      <el-button size="small" :icon="Edit" circle @click="showDialog"></el-button>
    </el-col>
  </el-row>


  <el-dialog
      v-model="dialogVisible"
      title="表达式编辑器"
      width="500px"
      draggable
  >
    <div>
      <el-form label-suffix=":" label-width="90px">
        <el-form-item label="表达式">
          <el-input v-model="model" type="textarea" :rows="4" placeholder="${var}>1"></el-input>
          <div>
            可选的参数：<br>
            <li v-for="(value, key) in properties" :key="key">
              <span @click="fillText(key)" style="cursor: pointer">{{ key }} : {{ value }}</span>
            </li>
          </div>
          <div>
            根据 全局的参数名来进行对比。 <br>
            ${参数名}==true 或 ${参数名} > 1 && ${参数名2} > 2 或 ${参数名} > 1 || ${参数名2} > 2
          </div>
        </el-form-item>
      </el-form>
    </div>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="submit">
          确定
        </el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">

import {Edit} from "@element-plus/icons-vue";
import {inject, ref, watch} from "vue";

const {drawerRef} = inject('drawer')
const dialogVisible = ref(false)
const model = defineModel({type: String})
const properties = ref({})

function showDialog() {
  dialogVisible.value = true;
}

watch(drawerRef, (newValue) => {
  properties.value = newValue.extension.bpmnXmlAdapter.processData.properties;
}, {deep: true, immediate: true})

function submit() {
  dialogVisible.value = false;
}

function fillText(key: string) {

  if(model.value) {
    model.value = model.value + "${" + key + "}";
  }else{
    model.value = "${" + key + "}";
  }
}

</script>


<style scoped lang="scss">

</style>