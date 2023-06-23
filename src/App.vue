<script setup lang="ts">
import { ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'

import FormSchema from './components/FormSchema.vue'
import { useSchema } from './stores/schema'
import jsPDF from 'jspdf'
import html2canvas from 'html2canvas'
import { ElLoading } from 'element-plus'

const store = useSchema()

// aqui pillariamos el data de la url

const drawer = ref(false)
const router = useRouter()
const route = useRoute()

const handleCommand = (command: string) => {
  if (route.params.j)
    router.push({ name: `${command}Sdf`, params: route.params })
  else router.push({ name: command })
}

const print = () => {
  const filename = 'Resume.pdf'
  const a4Width = 210 // paper Standard Width
  const a4Height = 297 // paper Standard Height
  const paper = document.querySelector('.page')

  const loading = ElLoading.service({
    lock: true,
    text: 'Building PDF',
    background: 'rgba(255, 255, 255, 1)',
  })
  document.querySelector('#app').classList.add('html2canvas')

  html2canvas(paper, {
    scale: 2,
    allowTaint: true,
    useCORS: true,
    logging: false,
  }).then((canvas: any) => {
    const imgWidth = 209.5
    const pageHeight = 297.5
    const imgHeight = (canvas.height * imgWidth) / canvas.width
    let heightLeft = imgHeight
    let position = 0
    heightLeft -= pageHeight
    const doc = new jsPDF('p', 'mm')
    doc.addImage(canvas, 'PNG', 0, position, imgWidth, imgHeight, '', 'FAST')
    while (heightLeft >= 0) {
      position = heightLeft - imgHeight
      doc.addPage()
      doc.addImage(canvas, 'PNG', 0, position, imgWidth, imgHeight, '', 'FAST')
      heightLeft -= pageHeight
    }
    doc.save('Downld.pdf')
    document.querySelector('#app').classList.remove('html2canvas')
    loading.close()
  })
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
                <el-dropdown-item command="Default">Default</el-dropdown-item>
                <el-dropdown-item command="Hello">Hello</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
          <el-button @click="print">Export to PDF</el-button>
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
  .el-page-header__header {
    background-color: white;
    padding: 24px;
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
    .template-selector {
      padding: 4px 12px;
    }
    @media print {
      display: none;
    }
  }
}
main {
  padding-top: 24px;
}
</style>
