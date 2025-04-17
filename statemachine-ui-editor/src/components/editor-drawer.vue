<template>
  <div ref="refDiv" class="divCon">
    <editor-panel @export-img="ExportImg"
                  @switch-map="SwitchMap"
                  @download-xml="downloadXml"
                  @upload-xml="uploadXml"></editor-panel>
    <div ref="containerRef" id="graph" class="viewport"></div>
  </div>
</template>

<script setup lang="ts">
import LogicFlow from '@logicflow/core'
import {
  DndPanel,
  SelectionSelect,
  Menu,
  Control,
  Highlight,
  BpmnElement,
  Snapshot,
  MiniMap
} from '@logicflow/extension';
import '@logicflow/extension/lib/style/index.css'
import '@logicflow/core/es/index.css'
import {inject, nextTick, onMounted, provide, reactive, ref, shallowReactive} from "vue";
import EditorPanel from "./editor-panel.vue";
import {getPanels} from "../node-extents/dnd-panels.ts";
import {userTaskExtend} from "../node-extents/user-task-extend.ts";
import {sequenceFlowExtend} from "../node-extents/user-flow-extend.ts";
import {BpmnXmlAdapter} from '../adapter';
import {lfXml2Json} from "@logicflow/extension/src/bpmn-adapter/xml2json.ts";

const refDiv = ref(null)
const height = ref(400);
const lfRef = ref<any>(null)
const containerRef = ref(null)
const flowId = ref('')
const isShowMap = ref(false)


const data = {
  nodes: [
    {
      id: 'custom-node-1',
      text: 'node-1',
      type: 'polygon',
      x: 150,
      y: 94,
    },
  ]
}

LogicFlow.use(DndPanel);
LogicFlow.use(SelectionSelect);
LogicFlow.use(Menu);
LogicFlow.use(Control);
LogicFlow.use(Highlight)
LogicFlow.use(BpmnElement)
LogicFlow.use(BpmnXmlAdapter)
LogicFlow.use(Snapshot);
LogicFlow.use(MiniMap);


// 注入到全局
const {UpdateDrawer} = inject('drawer')
const emits = defineEmits(["nodeClick", "nodeDelete"]);

const miniMapOptions: MiniMap.MiniMapOption = {
  width: 200,
  height: 120
}

onMounted(() => {
  nextTick(() => {
    if (refDiv.value) {
      //@ts-ignore
      height.value = refDiv.value.offsetHeight;
      console.log('Div 的高度是:', height.value);
    }
    if (containerRef.value) {
      const lf = new LogicFlow({
        container: containerRef.value,
        height: height.value,
        multipleSelectKey: 'ctrl',
        disabledTools: ['multipleSelect'],
        autoExpand: true,
        adjustEdgeStartAndEnd: true,
        allowRotate: true,
        edgeTextEdit: true,
        keyboard: {
          enabled: true
        },
        partial: true,
        background: {
          color: '#FFFFFF'
        },
        grid: true,
        edgeTextDraggable: true,
        edgeType: 'bezier',
        style: {
          inputText: {
            background: 'black',
            color: 'white'
          }
        },
        allowResize: true,
        idGenerator(type) {
          return type + '_' + Math.random()
        },
        pluginsOptions: {
          miniMap: miniMapOptions,
        },
        customBpmnEdge: false
      })

      lf.on('graph:rendered', ({graphModel}) => {
        flowId.value = graphModel?.flowId || ''
      })


      //@ts-ignore
      lf.extension.dndPanel.setPatternItems(getPanels(lf));

      //注册扩展节点
      lf.register(userTaskExtend)
      lf.register(sequenceFlowExtend)


      // 渲染数据
      lf.render(data)


      lf.on('node:click,edge:click,node:dnd-add', (node: any) => {
        if (node && node.data) {
          //console.log(node.data);
          let tmpEdge = lfRef.value.extension.bpmnXmlAdapter.getEdgeById(node.data.id);
          if (tmpEdge) {
            node.data["events"] = tmpEdge.events;
            node.data["expression"] = tmpEdge.expression;
          }
          emits("nodeClick", node.data)
        }
      })

      lf.on('node:delete', (node: any) => {
        if (node && node.data) {
          //console.log(node.data);
          emits("nodeDelete", node.data)
        }
      })

      //画布点击
      lf.on('blank:click', () => {
        emits("nodeClick", {
          "type": "blank",
          "properties": lfRef.value.extension.bpmnXmlAdapter.processData.properties,
          "text": {},
          "id": lfRef.value.extension.bpmnXmlAdapter.processData.id
        })
      })

      // //放开后要聚焦到当前节点上
      // lf.on('node:drop', (node: any) => {
      //   if (node) {
      //     lf.selectElementById(node.id);
      //     emits("nodeClick", node.data)
      //   }
      // })

      // lf.on('node:mousedown', (node: any) => {
      //   if (node) {
      //     emits("nodeClick", node.data)
      //   }
      // })


      lfRef.value = lf

      UpdateDrawer(lfRef.value);

    }
  })

})

//导出图片
const ExportImg = () => {
  if (lfRef.value) {
    lfRef.value.getSnapshot();
  }
}

//切换地图
const SwitchMap = () => {
  if (lfRef.value) {
    if (isShowMap.value) {
      lfRef.value.extension.miniMap.hide();
      isShowMap.value = false;
    } else {
      lfRef.value.extension.miniMap.show();
      isShowMap.value = true;
    }
  }
}


const download = (filename: string, text: string) => {
  const element = document.createElement('a');
  element.setAttribute(
      'href',
      'data:text/plain;charset=utf-8,' + encodeURIComponent(text),
  );
  element.setAttribute('download', filename);
  element.style.display = 'none';
  document.body.appendChild(element);
  element.click();
  document.body.removeChild(element);
};

const downloadXml = () => {

  let data = lfRef.value.getGraphRawData()
  if (lfRef.value.adapterOut) {
    data = lfRef.value.adapterOut(data)
  }
  //const data = lfRef.value.getGraphData() as string;
  download('logic-flow.xml', data);
};

const uploadXml = (ev: any) => {
  const file = ev.target.files[0];
  const reader = new FileReader();
  reader.onload = (event: ProgressEvent<FileReader>) => {
    if (event.target) {
      const xml = event.target.result as string;
      lfRef.value.render(xml);
    }
  };
  reader.readAsText(file);
};


/**
 * 更新节点属性
 * @param id
 * @param key
 * @param value
 */
const updateProperty = (id: string, key: string, value: any) => {

  let node = lfRef.value.getNodeModelById(id);
  if (node) {
    node.setProperty(key, value);
  }
}

const updateEdgeProperty = (id: string, key: string, value: any) => {
  let node = lfRef.value.getEdgeModelById(id);
  if (node) {
    node.setProperty(key, value);
  }
}

defineExpose({
  updateProperty,
  updateEdgeProperty
})

</script>

<style scoped>

</style>