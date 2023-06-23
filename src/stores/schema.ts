import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useSchema = defineStore('schema', {
  state: () => ({
    formSchema: ref({} as any),
    formData: ref({} as any),
  }),
  actions: {
    updateImage(base64Img: string) {
      this.formData.imageProfile = base64Img
    },
    updateData(data: any) {
      this.formData = data
    },
    updateSchema(schema: any) {
      this.formSchema = schema
    },
  },
})
