import { ref } from 'vue'
import { defineStore } from 'pinia'
import type { Settings } from '../types/common/settings'

// export const useSchema = defineStore('schema', {
//   state: () => ({
//     formSchema: ref({} as any),
//     formData: ref({} as any),
//     settings: ref({} as Settings),
//   }),
//   actions: {
//     save() {
//       //to be overwritten
//     },
//     updateImage(base64Img: string) {
//       this.formData.imageProfile = base64Img
//     },
//     updateData(data: any) {
//       this.formData = Object.assign({}, this.formData,data);
//     },
//     updateSchema(schema: any) {
//       this.formSchema = schema
//     },
//     updateSettings(settings: Settings) {
//       this.settings = settings
//     },
//   },
// })

export const useSchema = defineStore('schema', () => {

  const formSchema =  ref({} as any)
  const formData =  ref({} as any)
  const settings =  ref({} as Settings)
  

  function save () {
      //to be overwritten
  }
  function updateImage(base64Img: string) {
    formData.value.imageProfile = base64Img
  }
  function updateData(data: any) {
    formData.value = Object.assign({}, formData.value,data);
  }
  function updateSchema(schema: any) {
    formSchema.value = schema
  }
  function updateSettings(settings: Settings) {
    settings.value = settings
  }
  return { formSchema,
    formData,
    settings,
    save,
    updateImage,
    updateData,
    updateSchema,
    updateSettings
  }
})