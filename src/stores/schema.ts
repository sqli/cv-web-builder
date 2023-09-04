import { ref } from 'vue'
import { defineStore } from 'pinia'
import type { Settings } from '../types/common/settings'

export const useSchema = defineStore('schema', {
  state: () => ({
    formSchema: ref({} as any),
    formData: ref({} as any),
    settings: ref({} as Settings),
  }),
  actions: {
    save() {

    },
    updateImage(base64Img: string) {
      this.formData.imageProfile = base64Img
    },
    updateData(data: any) {
      this.formData = Object.assign({}, this.formData,data);
    },
    updateSchema(schema: any) {
      this.formSchema = schema
    },
    updateSettings(settings: Settings) {
      this.settings = settings
    },
  },
})
