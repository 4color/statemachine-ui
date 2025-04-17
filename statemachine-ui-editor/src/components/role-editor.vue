<template>
  <div style="width: 100%">
    <div style="text-align: right">
      <el-button size="small" @click="showDialog">选择角色 ({{ roleLength }})</el-button>
    </div>
  </div>


  <el-dialog
      v-model="dialogVisible"
      title="角色选择器"
      width="700px"
      draggable>
    <div>
      <el-row>
        <el-col :span="10">
          <el-scrollbar height="300px">
            <el-tree :data="roles"
                     node-key="roleCode"
                     show-checkbox
                     ref="refRoleSource"
            >
              <template #default="{ node, data }">
            <span class="custom-tree-node">
              <span>{{ data.name }} </span>
                <span v-if="data.roleCode">({{ data.roleCode }}) </span>
            </span>
              </template>
            </el-tree>
          </el-scrollbar>
        </el-col>
        <el-col :span="4">
          <div class="btncenter">
            <el-button @click="getRole"> &gt;&gt;</el-button>
            <el-button @click="deleteRole"> &lt;&lt;</el-button>
          </div>
        </el-col>
        <el-col :span="10">
          <el-scrollbar height="300px">
            <el-tree :data="selectedRoles"
                     node-key="roleCode"
                     show-checkbox
                     ref="refRoleTarget"
            >
              <template #default="{ node, data }">
            <span class="custom-tree-node">
               <span>{{ data.name }} </span>
               <span v-if="data.roleCode">({{ data.roleCode }}) </span>
            </span>
              </template>
            </el-tree>
          </el-scrollbar>
        </el-col>
      </el-row>
    </div>

    <template #footer>
      <span class="dialog-footer">
        <el-button type="primary" @click="submit">
          确定
        </el-button>
      </span>
    </template>

  </el-dialog>

</template>


<script setup lang="ts">
import {nextTick, onMounted, ref, watch} from "vue";
import {allRoles} from "../model/role-data.ts";

const model = defineModel({type: String})

const dialogVisible = ref(false)
const refRoleSource = ref();
const refRoleTarget = ref();


//[{"roleCode": "a"}, {"roleCode": "b"}]
const selectedRoles = ref([]);
const roles = ref({});
const roleLength = ref(0);


function initRoles() {
  selectedRoles.value = [];
  if (model.value) {
    const roleCodes = model.value.split(",");
    nextTick(() => {
      refRoleSource.value.setCheckedKeys(roleCodes);
      nextTick(() => {
        selectedRoles.value = refRoleSource.value.getCheckedNodes(true);
      })

    })
  }
}


function showDialog() {

  dialogVisible.value = true;
  roles.value = allRoles;
  initRoles();
}

function submit() {
  dialogVisible.value = false;
}

function getRole() {
  selectedRoles.value = refRoleSource.value.getCheckedNodes(true);
}

function deleteRole() {
  const keys = refRoleTarget.value.getCheckedKeys();

  keys.forEach((key: any) => {
    const index = selectedRoles.value.findIndex((item: any) => item.roleCode === key);
    if (index !== -1) {
      selectedRoles.value.splice(index, 1);
    }
  });
  refRoleTarget.value.setCheckedKeys([]);
}


watch(() => selectedRoles.value, (newValue: any) => {
  model.value = newValue.map((item: any) => item.roleCode).join(",");
})

watch(() => model.value, (newValue: any) => {
  if (newValue) {
    roleLength.value = newValue.split(",").length;
  } else {
    roleLength.value = 0;
  }
}, {immediate: true})

</script>

<style scoped lang="scss">
.el-col {
  padding: 5px;
}

.btncenter {
  display: flex;
  justify-content: center; /* 水平居中 */
  align-items: center; /* 垂直居中 */
  height: 100%; /* 需要定义容器高度 */
}

.btncenter button {
  margin: 0 5px;
}

</style>