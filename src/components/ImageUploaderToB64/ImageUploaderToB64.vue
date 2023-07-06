<script setup lang="ts">
import { ref, computed } from 'vue'
import { Cropper, CircleStencil } from 'vue-advanced-cropper'
import 'vue-advanced-cropper/dist/style.css'
import { storeToRefs } from 'pinia'
import { useSchema } from '../../stores/schema'
import { ElMessage } from 'element-plus'
import { encode } from 'url-safe-base64'

const store = useSchema()
const { formData } = storeToRefs(store)
const croppedImage = ref(null)
const props = defineProps({
  id: String,
  imageHeight: Number,
  imageWidth: Number,
  characterLimit: Number,
})

formData.value.temporal = formData.value.temporal ? formData.value.temporal : {}

formData.value.temporal[props.id] = {
  originalImage: '',
}

const uploadedImage = ref(null)

const handleFileSelect = (file: File) => {
  if (file) {
    uploadedImage.value = URL.createObjectURL(file)
  }
  return false
}
const change = ({ canvas }) => {
  croppedImage.value = canvas
}
const finalizar = () => {
  compressImage(0.7)
  formData.value.temporal[props.id] = {
    originalImage: '',
  }
}
const compressImage = async (qualityImage) => {
  formData.value.temporal[props.id].originalImage = ''

  const canvas = document.createElement('canvas')
  const context = canvas.getContext('2d')
  const img = new Image()
  img.src = croppedImage.value.toDataURL()
  img.onload = async function () {
    formData.value.temporal[props.id] = {
      originalImage: img.src,
    }
    canvas.width = props.imageWidth
    canvas.height = (img.height * props.imageWidth) / img.width
    context!.drawImage(
      img,
      0,
      0,
      img.width,
      img.height,
      0,
      0,
      canvas.width,
      canvas.height,
    )
    const imageCompressed = canvas.toDataURL('image/webp', qualityImage)
    return await new Promise((resolve) => {
      if (encode(btoa(imageCompressed)).length < props.characterLimit) {
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
}
</script>

<template>
  <div class="image-uploader-tob64">
    <el-upload
      v-if="store.settings.imageUpload"
      :before-upload="handleFileSelect"
      class="upload-demo"
    >
      <el-button type="primary">Click to upload</el-button>
    </el-upload>
    <cropper
      class="upload-example-cropper"
      :src="uploadedImage"
      :stencil-size="{
        width: props.imageWidth,
        height: props.imageHeight,
      }"
      :stencil-props="{
        handlers: {},
        movable: false,
        resizable: false,
        aspectRatio: 1,
      }"
      image-restriction="stencil"
      @change="change"
    />
    <el-button v-if="uploadedImage" @click="finalizar">
      Actualizar imagen</el-button
    >
  </div>
</template>

<style lang="scss" scoped>
#fileInput {
  margin-bottom: 1rem;
}
.image-uploader-tob64 {
  max-width: 100%;
}
.upload-example-cropper {
  max-width: 100%;
  max-height: 500px;
}
</style>
