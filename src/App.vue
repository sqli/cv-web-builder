<script setup lang="ts">
import { routeLocationKey, routerKey, RouterLink, RouterView } from 'vue-router'
import { ref } from 'vue'
import { ElMessageBox } from 'element-plus'
import { useRouter, useRoute } from 'vue-router'
import FormSchema from './components/FormSchema.vue'
import { useSchema } from './stores/schema'
import jsPDF from 'jspdf'
import html2canvas from 'html2canvas'

const store = useSchema()

// aqui pillariamos el data de la url
store.updateData({
  firstName: 'Perico',
  lastName: 'Palotes',
  age: 80,
  email: 'perico@palote.com',
  telephone: '669696969',
})

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

const router = useRouter()
const route = useRoute()

const handleCommand = (command: string) => {
  router.push(command)
}

const print = () => {
  const filename = 'Resume.pdf'
  const a4Width = 210 // paper Standard Width
  const a4Height = 297 // paper Standard Height
  const paper = document.querySelector('.page')

  html2canvas(paper, {
    scale: 5,
    allowTaint: true,
    useCORS: true,
    logging: false,
  }).then((canvas) => {
    let pdf = new jsPDF('p', 'mm', 'a4')
    pdf.addImage(
      canvas.toDataURL('image/jpeg'),
      'JPEG',
      -2,
      0,
      a4Width,
      a4Height,
    )

    pdf.save(filename)
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
                <el-dropdown-item command="./default">Default</el-dropdown-item>
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

  <el-drawer
    v-model="drawer"
    direction="rtl"
    :before-close="handleClose"
    class="form-drawer"
  >
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
  @media print {
    display: none;
  }
}
main {
  margin-top: 24px;
}
</style>
