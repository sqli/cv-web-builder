import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useSchema = defineStore('schema', {
  state: () => ({
    formSchema: ref({}),
    formData: ref({}),
  }),
  actions: {
    updateImage(base64Img){
      this.formData.imageProfile = base64Img
    },
    updateData(data) {
      this.formData = data
    },
    updateSchema(schema) {
      this.formSchema = schema
    },
  },
})