<script setup lang="ts">
import { ref } from 'vue'
import { QuillEditor } from '@vueup/vue-quill'
import '@vueup/vue-quill/dist/vue-quill.snow.css'
import { onMounted } from 'vue'

const props = defineProps({ modelValue: String })
const quillEditor = ref(null)

const emit = defineEmits(['update:modelValue'])

const send = () => {
  emit('update:modelValue', quillEditor.value.getHTML())
}

onMounted(() => {
  quillEditor.value.setHTML(props.modelValue)
})
</script>
<template>
  <QuillEditor @update:content="send" ref="quillEditor" toolbar="minimal" />
</template>

<style lang="scss">
.el-form-item__content {
  background-color: white;
  .ql-toolbar,
  .ql-container {
    width: 100%;
  }
}
</style>
