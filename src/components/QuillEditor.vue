<script setup lang="ts">
import { ref } from 'vue'
import { QuillEditor } from '@vueup/vue-quill'
import '@vueup/vue-quill/dist/vue-quill.snow.css'

const quillEditor = ref(null)
const emit = defineEmits(['update:modelValue'])

const send = (data) => {
  emit('update:modelValue', quillEditor.value.getHTML())
}
</script>
<template>
  <QuillEditor @update:content="send" theme="snow" ref="quillEditor" />
</template>
