
<template>
    <div>
      <img id="miImagen" :src="imageProfile" width="50" height="50"/>
      <input id="fileInput" type="file" @change="handleFileSelect">
    </div>
  </template>
  
  <script setup>
  import { ref,onMounted } from 'vue';
  
  const imageProfile = ref('') 
  onMounted(()=> {
    let image = document.location.search.split('?')[1];
    if(image){
        imageProfile.value = image;
    }
  })
  
  function handleFileSelect(event) {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onload = function (event) {
      imageProfile.value = event.target.result;
      console.log(event.target.result)
    };
    reader.readAsDataURL(file);
  }
  
  </script>
  