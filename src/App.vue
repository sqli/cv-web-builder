<script setup lang="ts">
import { ref, watch, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { storeToRefs } from 'pinia'
import { encode } from 'url-safe-base64'

import { ElMessage, ElMessageBox } from 'element-plus'
import { h } from 'vue'
import { decode } from 'url-safe-base64'

import FormSchema from './components/FormSchema.vue'
import flagSelector from './components/FlagSelector/FlagSelector.vue'
import ImportFromLinkedin from './components/ImportFromLinkedin.vue'
import { useSchema } from './stores/schema'
import jsPDF from 'jspdf'
import html2canvas from 'html2canvas'
import { ElLoading } from 'element-plus'

import { onBeforeUnmount, onMounted } from 'vue'

onBeforeUnmount(() => {
  window.removeEventListener('beforeunload', confirmClose)
})
onMounted(() => {
  window.addEventListener('beforeunload', confirmClose)
})
const confirmClose = (event) => {
  event.preventDefault()
  event.returnValue = ''
  return '¿Estás seguro de que deseas salir? Los cambios no guardados se perderán.' // confirmation message, doesnt work in all browsers
}

const store = useSchema()
const { formData } = storeToRefs(store)

// aqui pillariamos el data de la url
const drawer = ref(false)
const router = useRouter()
const route = useRoute()

watch(
  () => route.params,
  () => {
    try {
      if (route.params.j) {
        const jsonString = Array.isArray(route.params.j)
          ? route.params.j[0]
          : route.params.j
        const jsonSchema = JSON.parse(atob(decode(jsonString)))
        store.updateData(jsonSchema)
      }
    } catch (error: any) {
      ElMessage.error('CV is corrupted.', error)
    }
  },
)

const handleCommand = (command: string) => {
  if (route.params.j) router.push({ name: `${command}j`, params: route.params })
  else router.push({ name: command })
}

const print = () => {
  const filename = `${formData.value.id || 'document'}.pdf`
  const paper = <HTMLScriptElement>document.querySelector('.page')

  const loading = ElLoading.service({
    lock: true,
    text: 'Building PDF',
    background: 'rgba(255, 255, 255, 1)',
  })

  const container = <HTMLScriptElement>document.querySelector('#app')
  if (container) container.classList.add('html2canvas')

  if (paper) {
    html2canvas(paper, {
      scale: 2,
      allowTaint: true,
      useCORS: true,
      logging: false,
    }).then((canvas: HTMLCanvasElement) => {
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
        doc.addImage(
          canvas,
          'PNG',
          0,
          position,
          imgWidth,
          imgHeight,
          '',
          'FAST',
        )
        heightLeft -= pageHeight
      }
      doc.save(filename)
      container.classList.remove('html2canvas')
      console.log(paper)
      loading.close()
    })
  }
}

const share = (isReadOnly) => {
  let formDatatemp = { ...formData.value, readOnly: isReadOnly }
  const mypath = router.currentRoute.value.href.substring(
    0,
    router.currentRoute.value.href.lastIndexOf('/'),
  )
  let path =
    window.location.origin +
    mypath +
    '/' +
    encode(btoa(JSON.stringify(formDatatemp)))
  navigator.clipboard.writeText(path)
  ElMessage({
    message: h('p', null, [
      h('span', null, 'The '),
      h(
        'span',
        { style: 'font-weight:bold' },
        isReadOnly ? 'read only ' : 'editable',
      ),
      h('span', null, ' share link is now '),
      h('span', { style: 'color: teal' }, 'copied to the clipboard'),
    ]),
  })
}
const saveAndClose = async () => {
  const loading = ElLoading.service({
    lock: true,
    text: 'Building PDF',
    background: 'rgba(255, 255, 255, 1)',
  })
  store.save()
  loading.close()
  drawer.value = false
}
const expired = computed(() => {
  const expirationDate = new Date(formData.value.expiresOn)
  const dateToday = new Date()
  return (
    typeof formData.value.expiresOn === 'string' && dateToday > expirationDate
  )
})

const hasParam = computed(() => {
  return route.params.j
})
</script>

<template>
  <el-affix v-if="!formData.readOnly" :offset="0" class="top-menu">
    <div class="el-page-header__header">
      <div class="el-page-header__left">
        <div class="el-page-header__content">
          <div class="flex items-center">
            <el-text class="mx-1" size="large"> CV Web Builder </el-text>
          </div>
        </div>
      </div>
      <!--pre>
         {{ formData }}
      </pre-->
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
                <el-dropdown-item command="Landing">Landing</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
          <el-button type="info" @click="share(true)" v-if="hasParam"
            >Share Read-Only page
          </el-button>
          <el-button type="info" @click="share(false)" v-if="hasParam"
            >Share Editable Page</el-button
          >
          <el-button v-if="store.settings.exportPdf && hasParam" @click="print"
            >Export to PDF</el-button
          >
          <el-button type="primary" class="ml-2" @click="drawer = true"
            >Edit</el-button
          >
        </div>
      </div>
    </div>
  </el-affix>
  <el-drawer v-model="drawer" direction="rtl" class="form-drawer">
    <template #header>
      <div>
        <el-button type="primary" @click="saveAndClose">
          Save and close
        </el-button>
        <ImportFromLinkedin />
      </div>
    </template>
    <form-schema></form-schema>
  </el-drawer>
  <main v-if="!(formData.readOnly && expired)"><RouterView /></main>
  <main class="expired" v-else><p>This document has expired</p></main>
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
  & ~ main {
    min-height: calc(100vh - 81px);
  }
}
main {
  min-height: 100vh;
}
.expired {
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 2.5rem;
}
.summary {
  margin: 0 1rem 1rem;
  font-size: 1rem;
}
</style>
