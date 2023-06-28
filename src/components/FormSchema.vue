<script setup lang="ts">
import { ref } from 'vue'
import VueForm from '@lljj/vue3-form-element'
import { storeToRefs } from 'pinia'
import { useSchema } from '../stores/schema'
import { useRouter } from 'vue-router'
import { useRoute } from 'vue-router'
import { ElMessage } from 'element-plus'
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
const loadingImage = ref(false)
const loadingForm = ref(false)

const SaveUrlForm = async () => {
  loadingForm.value = true
  const imageUploaded = await loadNewImageAsB64(
    formData.value.imageProfile,
    0.9,
  )
  if (formData.value && imageUploaded) {
    router.push({
      params: { j: `${encode(btoa(JSON.stringify(formData.value)))}` },
    })
  }
  loadingForm.value = false
}

const handleFileSelect = (file: File) => {
  if (file) {
    loadingImage.value = true
    const reader = new FileReader()
    reader.onload = (event) => {
      loadNewImageAsB64(event, 0.9)
    }
    reader.readAsDataURL(file)
  }
  return false
}

const loadNewImageAsB64 = async (
  event: ProgressEvent<FileReader> | string,
  qualityImage: number,
): Promise<boolean> => {
  const canvas = document.createElement('canvas')
  const context = canvas.getContext('2d')
  const img = new Image()
  if (!event) return true
  if (typeof event === 'string') {
    img.src = event
  } else {
    img.src = event?.target?.result as string
  }

  return await new Promise((resolve) => {
    img.onload = function () {
      const imageResolution = 300

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

      const dataURL = canvas.toDataURL('image/webp', qualityImage)
      if (
        encode(
          btoa(JSON.stringify({ ...formData.value, imageProfile: dataURL })),
        ).length < 8000
      ) {
        store.updateImage(dataURL)
        loadingImage.value = false
        resolve(true)
      } else {
        if (qualityImage < 0) {
          loadingImage.value = false
          store.updateImage('')
          ElMessage.error('size of CV too big for sharing by URL.')
          resolve(false)
        } else {
          resolve(loadNewImageAsB64(event, qualityImage - 0.01))
        }
      }
    }
  })
}
</script>

<template>
  <div
    class="el-form el-form--default el-form--label-top genFromComponent layoutColumn layoutColumn-1"
  >
    <div class="fieldGroupWrap objectField fieldItem __pathRoot">
      <h3 class="fieldGroupWrap_title">CV Data form</h3>
      <p class="fieldGroupWrap_des">Please add your picture</p>
    </div>
  </div>

  <el-upload
    v-if="store.settings.imageUpload"
    v-loading="loadingImage"
    :before-upload="handleFileSelect"
    class="upload-demo"
  >
    <el-button type="primary">Click to upload</el-button>
  </el-upload>
  <VueForm
    v-model="formData"
    v-loading="loadingForm"
    :schema="formSchema"
    :form-footer="formFooter"
  >
  </VueForm>
  <el-button type="primary" @click="SaveUrlForm">Save Page in URL</el-button>
</template>

<style lang="scss" scoped>
#fileInput {
  margin-bottom: 1rem;
}
</style>
