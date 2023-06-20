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

onMounted(() => {
  if (route.params.j) {
    const jsonSchema = JSON.parse(atob(route.params.j))
    if (jsonSchema) {
      store.updateData(jsonSchema)
    }
  }
})

const submitea = () => {
  router.push(`/hello/${encode(btoa(JSON.stringify(formData.value)))}`)
}
const imageWidthDesired = 600 //px

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
    const magicNumberWidth = imageWidthDesired / img.width
    canvas.width = img.width * magicNumberWidth
    canvas.height = img.height * magicNumberWidth
    context!.drawImage(
      img,
      0,
      0,
      img.width * magicNumberWidth,
      img.height * magicNumberWidth,
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
  <button @click="submitea">Submitea loc</button>
</template>
