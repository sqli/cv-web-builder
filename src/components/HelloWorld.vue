<script setup lang="ts">
import ComponenteImagen from './ComponenteImagen.vue'
import { routeLocationKey, routerKey, RouterLink, RouterView } from 'vue-router'
import { useSchema } from '../stores/schema'
import schema from '../templates/default/schema.json'

const store = useSchema()

store.updateSchema(schema)
</script>

<template>
  <ComponenteImagen />
</template>

<style scoped>
h1 {
  font-weight: 500;
  font-size: 2.6rem;
  position: relative;
  top: -10px;
}

h3 {
  font-size: 1.2rem;
}

.greetings h1,
.greetings h3 {
  text-align: center;
}

@media (min-width: 1024px) {
  .greetings h1,
  .greetings h3 {
    text-align: left;
  }
}
</style>
