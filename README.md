# 状态流编辑器

基于 logicflow 的状态流编辑器

代码在 statemachine-ui-editor 目录下

采用Vue3+TypeScript+Element Plus编写

演示 Demo 地址： https://4color.github.io/statemachine-ui/



与工作流不同的地方就是把Node当作一个状态，所以每个Node有一个值配置

把Edge当作一个操作，所以有角色与权限配置



但是生成的Xml的内容还是工作流的XML，后期可以生成JSON.
