<template>
  <el-button @click="visible = true"> Import from Linkedin </el-button>
  <el-dialog v-model="visible" :show-close="true" center>
    <template #header>
      <div class="linkedin-modal-header">
        <h4>Import from Linkeding</h4>
      </div>
    </template>

    <ol>
      <li>
        <a
          href="https://www.linkedin.com/mypreferences/d/download-my-data"
          target="_blank"
          >click here</a
        >
      </li>
      <li>login with your credentials</li>
      <li>select the first option</li>
      <li>click on request file</li>
      <li>
        Wait for the email in your inbox (it can takes more than 10 minutes)
      </li>
      <li>click and download the file</li>
      <li>use the button below to upload the zip file</li>
      <li>check that everything has been uploaded correctly</li>
    </ol>

    <el-upload
      class="linkedin-upload"
      :on-change="handleFileChange"
      :before-upload="readCSVFiles"
      :show-file-list="false"
    >
      <el-button type="primary">Click to upload</el-button>
    </el-upload>
    <el-alert
      v-if="zipRead === 'error'"
      title="Something went wrong"
      type="error"
      show-icon
    />
  </el-dialog>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import JSZip from 'jszip'

import { h } from 'vue'
import { ElMessage } from 'element-plus'

import { useSchema } from './../stores/schema'
import countriesList from './FlagSelector/countries/countriesList.json'

const store = useSchema()
const zipRead = ref('')
const zipFile = ref(null)
const csvData = ref(null)

const visible = ref(false)
const handleFileChange = (event) => {
  zipFile.value = event.raw
  return false
}
const readCSVFiles = async () => {
  zipRead.value = ''
  try {
    if (!zipFile.value) {
      return false
    }

    const zip = new JSZip()
    const zipData = await zip.loadAsync(zipFile.value)

    const csvFiles = [
      'Profile.csv',
      'Languages.csv',
      'Education.csv',
      'Skills.csv',
      'Positions.csv',
    ] // Nombres de los archivos que queremos leer, si añadimos alguno más, ponerlo al final (no cambiar el orden)

    const results = []

    for (const fileName of csvFiles) {
      const fileData = await zipData.file(fileName).async('string')

      const lines = fileData.trim().split('\n')
      const headers = lines[0].split(',')

      const data = []
      for (let i = 1; i < lines.length; i++) {
        const values = parseCSVLine(lines[i])
        const entry = {}
        for (let j = 0; j < headers.length; j++) {
          entry[formatString(headers[j])] = values[j]
        }
        data.push(entry)
      }
      results.push({ fileName: fileName.split('.')[0], data })
    }

    csvData.value = results
    saveDataInStore()
    visible.value = false
    ElMessage({
      showClose: true,
      message: h('p', null, [
        h('span', null, 'File '),
        h('span', { style: 'font-weight:bold' }, 'uploaded successfully.'),
        h('span', null, ' Please, '),
        h('span', { style: 'color: teal' }, 'review'),
        h('span', null, ' that every data are correct  '),
      ]),
      type: 'success',
    })

    return false
  } catch (error) {
    zipRead.value = 'error'
  }
}

function parseCSVLine(line) {
  const values = []
  let current = ''
  let insideQuotes = false

  for (const char of line) {
    if (char === ',' && !insideQuotes) {
      values.push(current)
      current = ''
    } else if (char === '"') {
      insideQuotes = !insideQuotes
    } else {
      current += char
    }
  }

  values.push(current) // Add the last value
  return values
}

function saveDataInStore() {
  store.updateData({
    ...formatProfile(),
    ...formatLanguages(),
    ...formatKnowledgeTags(),
    ...formatWorkExperience(),
  })
}

function formatString(str) {
  const formattedStr = str.charAt(0).toLowerCase() + str.slice(1)

  const trimmedStr = formattedStr.replace(/\s+/g, '')

  return trimmedStr
}
function formatProfile() {
  return {
    ...csvData.value[0].data[0],
    mainPositionRole: csvData.value[0].data[0].headline,
    summary: csvData.value[0].data[0].summary,
  }
}

function formatLanguages() {
  return {
    languages: csvData.value[1].data
      .map((el) => (countriesList[el.name] ? el.name : false))
      .filter((el) => el),
  }
}
function formatKnowledgeTags() {
  return {
    hashTags: csvData.value[3].data.map((el) => {
      return el.name
    }),
  }
}

function formatWorkExperience() {
  return {
    workExperience: {
      newPage: true,
      experience: csvData.value[4].data.map((el) => {
        return {
          position: `${el.companyName} ${el.title}`,
          timePeriod: `${el.startedOn} - ${el.finishedOn}`,
          description: el.description,
        }
      }),
    },
  }
}
</script>

<style scoped lang="scss">
.el-dialog__header {
  padding-bottom: 0px;
  .linkedin-modal-header {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    h4 {
      font-size: 1.5rem;
      color: var(--el-text-color-primary);
    }
  }
}
.linkedin-upload,
.el-collapse,
.el-alert {
  margin-top: 2rem;
}
</style>
