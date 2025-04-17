<template>
  <div class="title">操作权限</div>
  <el-form label-width="90px" label-suffix=":">
    <el-form-item label="权限控制">
      <el-radio value="no" v-model="nodeData.properties.auth">无需权限</el-radio>
      <el-radio value="yes" v-model="nodeData.properties.auth">权限控制</el-radio>
    </el-form-item>
    <el-form-item label="选择角色" v-if="nodeData.properties.auth=='yes'">

      <role-editor v-model="nodeData.properties.candidateGroups"></role-editor>

    </el-form-item>
    <el-form-item label="控制显示">
      <expression-editor v-model="nodeData.expression"></expression-editor>
    </el-form-item>
    <div style="text-align: right; width: 100%">
      <el-button size="small" :icon="Plus" @click="addEvent('beforeComplete')">执行前事件</el-button>
      <el-button size="small" :icon="Plus" @click="addEvent('complete')">执行后事件</el-button>
    </div>
    <template v-for="(event1,index) in nodeData.events" :key="index">
      <el-form-item :label="event1.event!='complete'?'前事件':'后事件'">
        <event-editor v-model="nodeData.events[index]"></event-editor>
      </el-form-item>
    </template>
  </el-form>
</template>


<script setup lang="ts">

import type {NodeData} from "../model/node-data.model.ts";
import {ref, watch} from "vue";
import {Edit, Plus} from "@element-plus/icons-vue";
import EventEditor from "./event-editor.vue";
import type {EdgeEventConfig} from "../adapter";
import {ElMessage} from "element-plus";
import ExpressionEditor from "./expression-editor.vue";
import RoleEditor from "./role-editor.vue";

const nodeData = defineModel<NodeData>("nodeData", {default: {id: "", properties: {auth: ""}}});

const emits = defineEmits(["updateEdgeProperty", "updateEdgeEvent", "updateExpression"]);



watch(() => nodeData.value.properties?.auth, (newValue: any) => {
  emits("updateEdgeProperty", nodeData.value.id, "auth", newValue)
})

watch(() => nodeData.value.properties?.candidateGroups, (newValue: any) => {
  emits("updateEdgeProperty", nodeData.value.id, "candidateGroups", newValue)
})

watch(() => nodeData.value.expression, (newValue: any) => {
  emits("updateExpression", nodeData.value.id, newValue)
})

watch(() => nodeData.value.events, (newValue: any) => {
  emits("updateEdgeEvent", nodeData.value.id, newValue)
}, {
  deep: true
})

function addEvent(type: string) {

  const event: EdgeEventConfig = {
    event: type,
    type: "api"
  }
  if (!nodeData.value.events) {
    nodeData.value.events = [];
  }

  let beforeCompleteEvents = nodeData.value.events.filter(item => item.event === type);
  if (beforeCompleteEvents.length == 0) {
    nodeData.value.events.push(event);
  } else {
    ElMessage.error("事件已存在");
  }
}


</script>

<style scoped lang="scss">
:deep(.el-table .el-table__cell) {
  padding: 4px 0;
}
</style>