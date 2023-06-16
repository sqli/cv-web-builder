<script setup>
import { storeToRefs } from 'pinia'
import { useSchema } from '../../stores/schema'
import { computed } from 'vue'
import schema from './schema.json'

const store = useSchema()
const { formData, formSchema } = storeToRefs(store)
store.updateSchema(schema)
</script>

<template>
  <div>
    <pre>{{ formData }}</pre>
  </div>
</template>
