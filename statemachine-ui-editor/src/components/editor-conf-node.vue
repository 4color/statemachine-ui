<template>

  <template v-if="nodeData.type!='bpmn:startEvent'&&nodeData.type!='bpmn:endEvent'">
    <div class="title">节点数据</div>
    <el-form label-width="90px" label-suffix=":">
      <el-form-item>
        <template #label>
          节点值:
          <el-popover
              placement="top-start"
              title=""
              :width="200"
              trigger="hover"
              content="用于控制业务数据的值状态"
          >
            <template #reference>
              <el-button type="warning" :icon="QuestionFilled" circle size="small" style="width: 12px; height: 12px"/>
            </template>
          </el-popover>
        </template>
        <el-input style="width: 90%" v-model="nodeData.properties.value"/>
      </el-form-item>
    </el-form>
  </template>

</template>


<script setup lang="ts">

import {Edit, QuestionFilled} from "@element-plus/icons-vue";
import type {NodeData} from "../model/node-data.model.ts";
import {watch} from "vue";


const nodeData = defineModel<NodeData>("nodeData", {default: {id: ""}});

const emits = defineEmits(["updateProperty"]);

watch(() => nodeData.value.properties?.value, (newValue) => {
  emits("updateProperty", nodeData.value.id, "value", newValue);
})

</script>