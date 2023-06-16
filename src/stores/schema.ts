import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

export const useSchema = defineStore('schema', {
  state: () => ({
    formSchema: ref({}),
    formData: ref({}),
  }),
  actions: {
    updateData(data) {
      this.formData = data
    },
    updateSchema(schema) {
      this.formSchema = schema
    },
  },
})
