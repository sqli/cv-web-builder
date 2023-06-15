<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
import { ref } from 'vue'
import { ElMessageBox } from 'element-plus'

const drawer = ref(false)
const handleClose = (done: () => void) => {
  ElMessageBox.confirm('Are you sure you want to close this?')
    .then(() => {
      done()
    })
    .catch(() => {
      // catch error
    })
}
</script>

<template>
  <el-affix :offset="0">
    <div class="el-page-header__header top-menu">
      <div class="el-page-header__left">
        <div class="el-page-header__content">
          <div class="flex items-center">
            <el-dropdown>
              <el-text class="mx-1" size="large"> Title </el-text>
            </el-dropdown>
            <el-dropdown>
              <el-text class="mx-1" size="large">
                Templates
                <el-icon class="el-icon--right"><arrow-down /></el-icon>
              </el-text>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item :icon="Plus">Action 1</el-dropdown-item>
                  <el-dropdown-item :icon="CirclePlusFilled">
                    Action 2
                  </el-dropdown-item>
                  <el-dropdown-item :icon="CirclePlus"
                    >Action 3</el-dropdown-item
                  >
                  <el-dropdown-item :icon="Check">Action 4</el-dropdown-item>
                  <el-dropdown-item :icon="CircleCheck"
                    >Action 5</el-dropdown-item
                  >
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </div>
        </div>
      </div>
      <div class="el-page-header__extra">
        <div class="flex items-center">
          <el-button>Export to PDF</el-button>
          <el-button type="primary" class="ml-2" @click="drawer = true"
            >Edit</el-button
          >
        </div>
      </div>
    </div>
  </el-affix>

  <el-drawer v-model="drawer" direction="rtl" :before-close="handleClose">
    <template #header="{ close, titleId, titleClass }">
      <h4 :id="titleId" :class="titleClass">This is a custom header!</h4>
      <el-button type="danger" @click="close">
        <el-icon class="el-icon--left"><CircleCloseFilled /></el-icon>
        Close
      </el-button>
    </template>
    <span>Hi, there!</span>
  </el-drawer>
  <main><RouterView /></main>
</template>

<style lang="scss" scoped>
.top-menu {
  background-color: white;
  padding: 24px 0;
  border-bottom: 1px solid var(--el-menu-border-color);
  .el-dropdown + .el-dropdown {
    margin-left: 12px;
  }
  .el-dropdown-link {
    cursor: pointer;
    color: var(--el-color-primary);
    display: flex;
    align-items: center;
  }
  .el-text {
    outline: none;
  }
}
main {
  margin-top: 24px;
}
</style>
