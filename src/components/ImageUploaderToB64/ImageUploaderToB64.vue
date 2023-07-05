<script setup lang="ts">
import { ref, computed } from 'vue'
import { Cropper } from 'vue-advanced-cropper'
import 'vue-advanced-cropper/dist/style.css'
import { storeToRefs } from 'pinia'
import { useSchema } from '../../stores/schema'
import { ElMessage } from 'element-plus'
import { encode } from 'url-safe-base64'

const store = useSchema()
const { formData } = storeToRefs(store)

formData.value.temporal = formData.value.temporal ? formData.value.temporal : {}
const croppedImage = ref(null)
const props = defineProps({
  id: String,
})

const handleFileSelect = (file: File) => {
  if (file) {
    const reader = new FileReader()
    reader.onload = (event) => {
      loadNewImageAsB64(event, 0.7)
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

    formData.value.temporal[props.id] = {
      originalImage: dataURL,
    }
    return false
  }
}
const imageComputed = computed(() => {
  return formData.value.temporal[props.id]?.originalImage
})
const change = ({ canvas }) => {
  croppedImage.value = canvas
}
const finalizar = () => {
  compressImage(0.7)
}
const compressImage = async (qualityImage) => {
  formData.value.temporal[props.id].originalImage = ''
  const imageCompressed = croppedImage.value.toDataURL(
    'image/webp',
    qualityImage,
  )
  console.log(imageCompressed.length)
  return await new Promise((resolve) => {
    if (encode(btoa(imageCompressed)).length < 5000) {
      store.updateImage(imageCompressed)
      resolve(true)
    } else {
      if (qualityImage < 0) {
        store.updateImage('')
        ElMessage.error('size of CV too big for sharing by URL.')
        resolve(false)
      } else {
        resolve(compressImage(qualityImage - 0.01))
      }
    }
  })
}
</script>

<template>
  <div>
    <el-upload
      v-if="store.settings.imageUpload"
      :before-upload="handleFileSelect"
      class="upload-demo"
    >
      <el-button type="primary">Click to upload</el-button>
    </el-upload>
    <cropper
      :src="imageComputed"
      :stencil-props="{
        aspectRatio: 1,
      }"
      @change="change"
    />
    <el-button v-if="imageComputed" @click="finalizar">
      Actualizar imagen</el-button
    >
  </div>
</template>

<style lang="scss" scoped>
#fileInput {
  margin-bottom: 1rem;
}
</style>
