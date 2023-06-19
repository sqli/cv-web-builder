<template>
  <div>
    <img class="image-profile" :src="formData.imageProfile || imageProfile" />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { useSchema } from '../stores/schema.ts'

const store = useSchema()

const { formData } = storeToRefs(store)

const imageProfile = ref<string>('')
onMounted(() => {
  let image = document.location.search.split('?')[1]
  if (image) {
    imageProfile.value = image
  }
})
</script>

<style scoped>
.image-profile {
  max-width: 300px;
  object-fit: cover;
  margin-right: 30px;
}
</style>
