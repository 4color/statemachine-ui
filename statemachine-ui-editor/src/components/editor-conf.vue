<template>
  <div class="parent">
    <div class="title">节点属性</div>
    <el-form label-width="90px" label-suffix=":">
      <el-form-item label="节点类型">
        <el-input disabled v-bind:value="getNodeType(nodeData.type)"/>
      </el-form-item>
      <el-form-item label="节点ID">
        <el-input disabled v-model:model-value="nodeData.id"/>
      </el-form-item>

      <el-form-item label="节点文本" v-if="nodeData.type!='blank'">
        <el-input disabled v-model:model-value="nodeData.text.value"/>
      </el-form-item>

      <el-form-item label="" v-if="nodeData.type=='bpmn:sequenceFlow'">
        <template #label>
          节点代码:
          <el-popover
              placement="top-start"
              title=""
              :width="200"
              trigger="hover"
              content="一般填写操作代码,以后用于业务控制,比如 上报：shangbao"
          >
            <template #reference>
              <el-button type="warning" :icon="QuestionFilled" circle size="small" style="width: 12px; height: 12px"/>
            </template>
          </el-popover>
        </template>
        <el-input v-model="nodeData.properties.code"/>
      </el-form-item>

    </el-form>
    <editor-conf-node v-model:node-data="nodeData" v-if="nodeData.type!='bpmn:sequenceFlow'&&nodeData.type!='blank'"
                      @update-property="updateProperty"></editor-conf-node>

    <editor-conf-edge v-if="nodeData.type=='bpmn:sequenceFlow'"
                      v-model:node-data="nodeData"
                      @update-edge-property="updateEdgeProperty"
                      @update-expression="updateExpression"
                      @update-edge-event="updateEdgeEvent"></editor-conf-edge>

    <editor-conf-blank v-if="nodeData.type=='blank'" :node-data="nodeData"
                       @update-process="UpdateProcess"></editor-conf-blank>
  </div>
</template>

<script setup lang="ts">

import EditorConfEdge from "./editor-conf-edge.vue";
import EditorConfNode from "./editor-conf-node.vue";
import type {NodeData} from "../model/node-data.model.ts";
import {NodeType} from "../model/node-type.model.ts";
import {inject, watch} from "vue";
import {QuestionFilled} from "@element-plus/icons-vue";
import EditorConfBlank from "./editor-conf-blank.vue";

const {drawerRef} = inject('drawer')

function getNodeType(type: string) {
  if (type) {
    let subType = type.replace("bpmn:", "");
    if (subType === "startEvent") {
      return NodeType.startEvent;
    } else if (subType === "endEvent") {
      return NodeType.endEvent;
    } else if (subType === "serviceTask") {
      return NodeType.serviceTask;
    } else if (subType === "exclusiveGateway") {
      return NodeType.exclusiveGateway;
    } else if (subType === "subProcess") {
      return NodeType.subProcess;
    } else if (subType === "userTask") {
      return NodeType.userTask;
    } else if (subType === "sequenceFlow") {
      return NodeType.sequenceFlow;
    } else if (subType === "blank") {
      return NodeType.blank;
    }
  } else {
    return "";
  }
}

const nodeData = defineModel<NodeData>("nodeData", {default: {id: ""}});

const emits = defineEmits(["updateProperty", "updateEdgeProperty"]);

function updateProperty(id: string, key: string, newValue: any) {
  emits("updateProperty", id, key, newValue);
}

function updateEdgeProperty(id: string, key: string, newValue: any) {
  emits("updateEdgeProperty", id, key, newValue);
}

//更新事件
function updateEdgeEvent(id: string, newValue: any) {
  drawerRef.value.extension.bpmnXmlAdapter.setEdgeEvent(id, newValue);
}

function updateExpression(id: string, newValue: any) {
  drawerRef.value.extension.bpmnXmlAdapter.setExpression(id, newValue);
}


function UpdateProcess(newValue: any) {
  drawerRef.value.extension.bpmnXmlAdapter.setProcessProperties(newValue);
}

watch(() => nodeData.value.properties?.code, (newValue) => {
  emits("updateEdgeProperty", nodeData.value.id, "code", newValue);
})


</script>


<style scoped lang="scss">

.parent :deep(.title) {
  font-size: 14px;
  font-weight: bold;
  height: 25px;
  margin: 5px;
  border-bottom-style: solid;
  border-bottom-width: 1px;
  border-bottom-color: #ccc;
}

.parent :deep(.el-form-item) {
  margin-bottom: 2px;
}


.parent :deep(.el-form-item__label > button) {
  margin-top: 10px;
  margin-left: 2px;
}

.parent :deep(.el-radio) {
  margin-right: 8px;
}

</style>