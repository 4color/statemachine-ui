<template>
  <div class="divTool">
    <el-row>
      <el-col :span="12" class="toolTitle">
        标题：
      </el-col>
      <el-col :span="12" class="toolRight">
        <el-button :icon="QuestionFilled">帮助</el-button>
        <el-button :icon="Check" type="primary">保存</el-button>
        <el-button :icon="Promotion" type="success">保存且发布</el-button>
      </el-col>
    </el-row>
  </div>
  <div class="divDrawer">
    <splitpanes class="default-theme">
      <Pane>
        <editor-drawer @node-click="nodeClick" @node-delete="nodeDelete" ref="refDrawer"></editor-drawer>
      </Pane>
      <Pane :min-size="20" :size="20" style="display: flow">
        <editor-conf v-model:node-data="nodeData"
                     @update-property="updateProperty"
                     @update-edge-property="updateEdgeProperty"></editor-conf>
      </Pane>
    </splitpanes>
  </div>
</template>

<script setup lang="ts">
import {Pane, Splitpanes} from 'splitpanes'
import EditorConf from "./components/editor-conf.vue";
import EditorDrawer from "./components/editor-drawer.vue";
import {Check, Promotion, QuestionFilled} from "@element-plus/icons-vue";
import {provide, ref} from "vue";
import type {NodeData} from "./model/node-data.model.ts";

const drawerRef = ref(null);

function UpdateDrawer(comRef: any) {
  drawerRef.value = comRef;
}

// 提供模型绘制器
provide('drawer', {drawerRef, UpdateDrawer});

const refDrawer = ref();

const nodeData = ref<NodeData>({id: "", text: {}, properties: {auth: ""}});
const nodeClick = (data: any) => {
  console.log(data);
  if (!data.text) {
    data.text = {};
  }
  nodeData.value = data;
};

const nodeDelete = () => {
  nodeData.value = {id: "", text: {}} as NodeData
};


function updateProperty(id: string, key: string, newValue: any) {
  refDrawer.value.updateProperty(id, key, newValue);
}

function updateEdgeProperty(id: string, key: string, newValue: any) {
  refDrawer.value.updateEdgeProperty(id, key, newValue);
}


</script>


<style scoped lang="scss">
.divDrawer {
  height: calc(100% - 40px);
}

.divTool {
  height: 36px;
  padding-top: 3px;
  padding-right: 3px;
  border-bottom-style: solid;
  border-bottom-width: 1px;
  border-bottom-color: rgb(230, 230, 230);
}

.toolTitle {
  font-size: 18px;
  padding-left: 10px;
}

.toolRight {
  text-align: right;
}
</style>
