<template>
  <div class="title">全局属性</div>
  <el-form label-width="90px" label-suffix=":">
    <div style="width: 100%">
      <el-row style="margin-bottom: 5px">
        <el-col :span="16">
          参数:
          <el-popover
              placement="top-start"
              title=""
              :width="200"
              trigger="hover"
              content="用于控制分支或按钮等操作需要"
          >
            <template #reference>
              <el-button type="warning" :icon="QuestionFilled" circle size="small" style="width: 12px; height: 12px"/>
            </template>
          </el-popover>

        </el-col>
        <el-col :span="8">
          <div style="text-align: right">
            <el-button size="small" @click="addVar">添加</el-button>
          </div>
        </el-col>
      </el-row>

      <el-table :data="vars" border empty-text="无参数">
        <el-table-column prop="name" label="参数名">
          <template #default="scope">
            <el-input size="small" v-model="scope.row.name" autocomplete="no"></el-input>
          </template>
        </el-table-column>
        <el-table-column prop="value" label="参数说明">
          <template #default="scope">
            <el-input size="small" v-model="scope.row.value"></el-input>
          </template>
        </el-table-column>
        <el-table-column label="-" width="40" align="center">
          <template #default="scope">
            <el-popconfirm title="是否删除?" @confirm="removeVar(scope.$index)">
              <template #reference>
                <el-button class="btn" size="small" :icon="Close" circle type="danger"></el-button>
              </template>
            </el-popconfirm>
          </template>
        </el-table-column>
      </el-table>
    </div>

  </el-form>


</template>


<script setup lang="ts">

import {Close, Edit, QuestionFilled} from "@element-plus/icons-vue";
import type {NodeData} from "../model/node-data.model.ts";
import {onMounted, ref, watch} from "vue";
import type {KeyValue} from "../model/KeyValue.ts";


const nodeData = defineModel<NodeData>("nodeData", {default: {id: ""}, properties: {}});

const emits = defineEmits(["updateProcess"]);

const vars = ref<KeyValue[]>([]);

watch(() => nodeData.value.properties, (newValue) => {
  initVars(newValue);
})

watch(() => vars.value, (newValue: KeyValue[]) => {

  let props = {};
  newValue.forEach((item: KeyValue) => {
    if (item.name) {
      props[item.name] = item.value;
    }
  })
  emits("updateProcess", props);
}, {deep: true, immediate: true})

const initVars = (newValue: any) => {
  vars.value = [];
  if (newValue) {
    Object.keys(newValue).forEach((key: any) => {
      let itemv: KeyValue = {
        name: key,
        value: newValue[key]
      }
      vars.value.push(itemv);
    })
    console.log(newValue)
  }
}

onMounted(() => {
  initVars(nodeData.value.properties);
})

function addVar() {
  vars.value.push({
    name: "",
    value: ""
  })
}

function removeVar(index: number) {
  vars.value.splice(index, 1);
}

</script>

<style scoped lang="scss">
:deep(.el-table .el-table__cell) {
  padding: 4px 0;
}

.btn {
  width: 14px !important;
  height: 14px;
}
</style>