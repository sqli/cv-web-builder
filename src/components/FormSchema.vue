<script setup lang="ts">
import { onMounted } from 'vue'
import VueForm from '@lljj/vue3-form-element'
import { storeToRefs } from 'pinia'
import { useSchema } from '../stores/schema'
import { useRouter, useRoute } from 'vue-router'

import { encode } from 'url-safe-base64'

const router = useRouter()
const route = useRoute()
const store = useSchema()
const { formData, formSchema } = storeToRefs(store)
const formFooter = {
  show: false,
  okBtn: 'ok',
  okBtnProps: {},
  cancelBtn: 'cancel',
}

const SaveUrlForm = () => {
  if (formData.value) {
    router.push({
      name: `DefaultSdf`,
      params: { j: `${encode(btoa(JSON.stringify(formData.value)))}` },
    })
  }
}

const handleFileSelect = (event: Event) => {
  const file = (event.target as HTMLInputElement).files?.[0]
  if (file) {
    const reader = new FileReader()
    reader.onload = (event) => {
      loadNewImageAsB64(event)
    }
    reader.readAsDataURL(file)
  }
}

const loadNewImageAsB64 = (event: ProgressEvent<FileReader>) => {
  const canvas = document.createElement('canvas')
  const context = canvas.getContext('2d')
  const img = new Image()
  img.src = event.target?.result as string

  img.onload = function () {
    const imageResolution = 600

    const aspectRatio = img.width / img.height
    let targetWidth = img.width
    let targetHeight = img.height
    let offsetX = 0
    let offsetY = 0

    if (aspectRatio > 1) {
      targetWidth = img.height
      offsetX = (img.width - targetWidth) / 2
    } else if (aspectRatio < 1) {
      targetHeight = img.width
      offsetY = (img.height - targetHeight) / 2
    }

    canvas.width = imageResolution
    canvas.height = imageResolution

    context!.drawImage(
      img,
      offsetX,
      offsetY,
      targetWidth,
      targetHeight,
      0,
      0,
      imageResolution,
      imageResolution,
    )

    const dataURL = canvas.toDataURL('image/webp', 0.3)
    store.updateImage(dataURL)
  }
}
</script>

<template>
  <div
    class="el-form el-form--default el-form--label-top genFromComponent layoutColumn layoutColumn-1"
  >
    <div class="fieldGroupWrap objectField fieldItem __pathRoot">
      <h3 class="fieldGroupWrap_title">CV Data form</h3>
      <p class="fieldGroupWrap_des">Please add your data</p>
    </div>
  </div>
  <input id="fileInput" type="file" @change="handleFileSelect" />
  <VueForm v-model="formData" :schema="formSchema" :form-footer="formFooter">
  </VueForm>
  <button @click="SaveUrlForm">Save CV in URL</button>
</template>
