//http://logicflow.cn/tutorial/extension/bpmn-element#%E8%8A%82%E7%82%B9%E6%89%A9%E5%B1%95


import {TaskNodeFactory} from '@logicflow/extension';

const icon = "M655.807326 287.35973m-223.989415 0a218.879 218.879 0 1 0 447.978829 0 218.879 218.879 0 1 0-447.978829 0ZM1039.955839 895.482975c-0.490184-212.177424-172.287821-384.030443-384.148513-384.030443-211.862739 0-383.660376 171.85302-384.15056 384.030443L1039.955839 895.482975z";
const props = {"value":""};
export const userTaskExtend = TaskNodeFactory('bpmn:userTask', icon,props)
