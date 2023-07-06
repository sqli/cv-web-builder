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
const loadingForm = ref(false)

const clear = () => {
  formData.value = {}
}

const SaveUrlForm = async () => {
  loadingForm.value = true

  let formToBeSaved = Object.assign({}, formData.value)

  if (formToBeSaved.anonymous) {
    formToBeSaved.firstName = ''
    formToBeSaved.lastName = ''
    formToBeSaved.imageProfile = ''
  }

  if (formToBeSaved) {
    let urlNeedsJName = (route.name as string).slice(-1) !== 'j' ? 'j' : ''

    router.push({
      name: (route.name as string) + urlNeedsJName,
      params: { j: `${encode(btoa(JSON.stringify(formToBeSaved)))}` },
    })
  }
  loadingForm.value = false
}
</script>

<template>
  <VueForm
    v-model="formData"
    v-loading="loadingForm"
    :schema="formSchema"
    :form-footer="formFooter"
  >
  </VueForm>
  <el-button type="primary" @click="SaveUrlForm">Save Page in URL</el-button>
  <el-button @click="clear">Clear data</el-button>
</template>

<style lang="scss" scoped>
#fileInput {
  margin-bottom: 1rem;
}
</style>
