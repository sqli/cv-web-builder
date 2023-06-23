<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { useSchema } from '../stores/schema.ts'
import { useRoute } from 'vue-router'
import { decode } from 'url-safe-base64'

const route = useRoute()
const store = useSchema()
const { formData } = storeToRefs(store)

const imageProfile = ref<string>('')
onMounted(() => {
  if (route.params.j) {
    const imageProfileTemp = JSON.parse(
      atob(decode(route.params.j)),
    ).imageProfile
    if (imageProfileTemp) {
      imageProfile.value = imageProfileTemp
    }
  }
})
</script>

<template>
  <div>
    <img
      class="image-profile"
      :src="
        (formData.imageProfile && decode(formData.imageProfile)) || imageProfile
      "
    />
  </div>
</template>

<style scoped>
.image-profile {
  max-width: 300px;
  object-fit: cover;
  margin-right: 30px;
}
</style>
