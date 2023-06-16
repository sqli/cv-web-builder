<script setup>
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
</script>

<template>
  <VueForm v-model="formData" :schema="formSchema" :form-footer="formFooter">
  </VueForm>
</template>
