<script lang="ts" setup>
import { ref } from 'vue'
import countriesList from './countries/countriesList.json'
const flags = ref([])

const keyOptions = Object.keys(countriesList)

const emit = defineEmits(['update:modelValue'])

const send = () => {
  emit('update:modelValue', flags)
}
</script>

<template>
  <el-select
    v-model="flags"
    filterable
    placeholder="Select"
    multiple
    class="locale"
    @change="send"
  >
    <el-option
      v-for="key in keyOptions"
      :key="key"
      :label="countriesList[key].name"
      :value="key"
    />
  </el-select>
</template>
<style scoped lang="scss">
.locale {
  width: 100%;
}
</style>
