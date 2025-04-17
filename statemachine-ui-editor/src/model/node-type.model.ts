export enum NodeType {
    startEvent = "开始节点",
    endEvent = "结束节点",
    serviceTask = "系统任务",
    subProcess = "子流程节点",
    exclusiveGateway = "条件判断",
    userTask = "用户任务",
    sequenceFlow = "连接线",
    blank = "画布",
}