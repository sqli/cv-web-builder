<script setup lang="ts">
import { ref, onMounted } from 'vue'
import VueForm from '@lljj/vue3-form-element'
import { storeToRefs } from 'pinia'
import { useSchema } from '../stores/schema'

const store = useSchema()

const { formData, formSchema } = storeToRefs(store)
const formFooter = {
  show: false,
  okBtn: 'ok',
  okBtnProps: {},
  cancelBtn: 'cancel',
}

const imageProfile = ref<string>('')
const imageWidthDesired = 960 //px

onMounted(() => {
  let image = document.location.search.split('?')[1]
  if (image) {
    imageProfile.value = image
  }
})

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
    const dataURL = canvas.toDataURL('image/webp', 35)
    store.updateImage(dataURL)
    console.log(dataURL)
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
</template>
