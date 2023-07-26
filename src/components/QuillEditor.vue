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
const toolbarOptions = [
  [{ header: [1, 2, 3, 4, 5, 6, false] }],
  ['bold', 'italic', 'underline'], // toggled buttons
  [{ list: 'ordered' }, { list: 'bullet' }],
  [{ color: [] }], // dropdown with defaults from theme
  [{ align: [] }],
]
</script>
<template>
  <QuillEditor
    ref="quillEditor"
    :toolbar="toolbarOptions"
    @update:content="send"
  />
</template>

<style lang="scss">
.el-form-item__content {
  background-color: white;
  .ql-toolbar,
  .ql-container {
    width: 100%;
  }
  .ql-container {
    min-height: 5rem;
  }
}
</style>
