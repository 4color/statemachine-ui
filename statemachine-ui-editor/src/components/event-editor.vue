<template>
  <el-row style="width: 100%">
    <el-col :span="20">
      {{ getTypeName(modelValue.type) }}
      <span v-if="modelValue.type">:</span>
      <span v-if="modelValue.type=='api'">{{modelValue.url}}</span>
      <span v-if="modelValue.type=='java'">{{modelValue.className}}</span>
      <span v-if="modelValue.type=='page'">{{modelValue.page}}</span>
    </el-col>
    <el-col :span="4" style="text-align: right; padding-right: 5px">
      <el-button size="small" :icon="Edit" circle @click="showDialog"></el-button>
    </el-col>
  </el-row>


  <el-dialog
      v-model="dialogVisible"
      title="事件编辑器"
      width="500px"
      draggable
  >
    <div>
      <el-form label-suffix=":" label-width="90px">
        <el-form-item label="事件类型">
          <el-select v-model="modelValue.type">
            <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label+(item.value?'('+item.value+')':'')"
                :value="item.value"
            >
              <template #default>{{ item.label }} {{item.value?'('+item.value+')':''}}</template>
            </el-option>
          </el-select>
        </el-form-item>

        <template v-if="modelValue.type === 'api'">

          <el-form-item label="请求方式">
            <el-select style="width: 150px" v-model="modelValue.action">
              <el-option value="POST"></el-option>
              <el-option value="GET"></el-option>
              <el-option value="DELETE"></el-option>
              <el-option value="PUT"></el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="请求地址">
            <el-input v-model="modelValue.url" placeholder="http://地址"></el-input>
            <div>
              可以用参数：${url},需要用户自己解析。<br>携带的url参数 ：flowConfId:流程配置ID; flowInstId:流程实例ID;
              <br>
              nodeConfId:当前节点配置ID; nodeInstId:节点实例ID; nodeConfValue:节点配置值;
              <br>
              edgeConfId:操作配置ID;
              edgeInstId:操作实例ID;
              edgeConfCode:操作配置代码;
            </div>
          </el-form-item>
        </template>

        <template v-if="modelValue.type === 'java'">

          <el-form-item label="接口方式">
            <el-select style="width: 150px" v-model="modelValue.classType">
              <el-option label="指定类" value="byClass"></el-option>
              <el-option label="根据类名" value="byFixClass"></el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="指定类" v-if="modelValue.classType === 'byClass'">
            <el-input v-model="modelValue.className" placeholder="完整包名.类名"></el-input>
            <div>
              写法为：包名.类名。请继承接口：com.example.flow.event.EventHandler
            </div>
          </el-form-item>

          <el-form-item label="根据类名" v-if="modelValue.classType === 'byFixClass'">
            <div>
              会自动查询 Java包里 流程编码+操作代码+EventHandler 的类名。请继承接口：com.example.flow.event.EventHandler
            </div>
          </el-form-item>

          <el-form-item label="参数">
            接口的参数为：flowConfId:流程配置ID; flowInstId:流程实例ID;
          </el-form-item>
        </template>

        <template v-if="modelValue.type === 'page'">

          <el-form-item label="页面地址">
            <el-input v-model="modelValue.page"></el-input>
            <div>
              是路由打开还是弹窗,由用户程序自己控制。用于审核环节
            </div>
          </el-form-item>

        </template>

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
import {computed, type PropType, ref} from "vue";
import type {EdgeEventConfig} from "../adapter";

//let props = defineProps<{ event: EdgeEventConfig }>()

// 接收父组件的 v-model 值
const props = defineProps({
  modelValue: {type: Object as PropType<EdgeEventConfig>, required: true}
});
const emit = defineEmits(['update:modelValue']);

const dialogVisible = ref(false)
//const formData = ref<NodeEvnts>({type: 'api', action: "", url: "", classType: ""})

const options = [
  {
    value: 'api',
    label: '服务调用'
  },
  {
    value: 'java',
    label: 'Java接口类'
  },
  {
    value: 'page',
    label: '打开页面'
  },
  {
    value: 'audit',
    label: '打开默认审核界面'
  },
  {
    value: '',
    label: '不选择'
  },
]

function getTypeName(type) {

  if (!type) {
    return "";
  }
  let opt = options.find((item) => {
    return item.value === type;
  })

  return opt.label;
}

function showDialog() {
  dialogVisible.value = true;
}

function submit() {
  emit('update:modelValue', props.modelValue)
  dialogVisible.value = false;
}
</script>


<style scoped lang="scss">

</style>