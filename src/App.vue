<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'

import FormSchema from './components/FormSchema.vue'

// aqui pillariamos el data de la url

const drawer = ref(false)
const router = useRouter()

const handleCommand = (command: string) => {
  router.push(command)
}
</script>

<template>
  <el-affix :offset="0" class="top-menu">
    <div class="el-page-header__header">
      <div class="el-page-header__left">
        <div class="el-page-header__content">
          <div class="flex items-center">
            <el-text class="mx-1" size="large"> CV Web Builder </el-text>
          </div>
        </div>
      </div>
      <div class="el-page-header__extra">
        <div class="flex items-center">
          <el-dropdown class="template-selector" @command="handleCommand">
            <el-text class="mx-1" size="large">
              Templates
              <el-icon class="el-icon--right"><arrow-down /></el-icon>
            </el-text>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item command="./default">Default</el-dropdown-item>
                <el-dropdown-item command="./hello">Hello</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
          <el-button>Export to PDF</el-button>
          <el-button type="primary" class="ml-2" @click="drawer = true"
            >Edit</el-button
          >
        </div>
      </div>
    </div>
  </el-affix>

  <el-drawer v-model="drawer" direction="rtl" class="form-drawer">
    <form-schema></form-schema>
  </el-drawer>
  <main><RouterView /></main>
</template>

<style lang="scss" scoped>
.top-menu {
  background-color: white;
  padding: 24px;
  border-bottom: 1px solid var(--el-menu-border-color);
  margin: 0 auto;
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
  .template-selector {
    padding: 4px 12px;
  }
}
main {
  margin-top: 24px;
}
</style>
