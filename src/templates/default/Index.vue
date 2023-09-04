<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useSchema } from '../../stores/schema'
import { useRouter } from 'vue-router'
import { useRoute } from 'vue-router'
import InlineSvg from '../../components/InlineSvg.vue'
import schema from './schema.json'
import { encode } from 'url-safe-base64'
import { JSDOM } from 'jsdom'
import DOMPurify from 'dompurify'
import countriesList from '../../components/FlagSelector/countries/countriesList.json'

const store = useSchema()
const router = useRouter()
const route = useRoute()
const purify = DOMPurify(window)
const clean = (unsafeHtml) => {
  return purify.sanitize(unsafeHtml)
}

store.updateSchema(schema)
store.save = () => {
  let formToBeSaved = Object.assign({}, formData.value)

  if (formToBeSaved.anonymous) {
    formToBeSaved.firstName = ''
    formToBeSaved.lastName = ''
    formToBeSaved.imageProfile = ''
  }

  if (formToBeSaved) {
    let urlNeedsJName = (route.name as string).slice(-1) !== 'j' ? 'j' : ''

    router.push({
      name: (route.name as string) + urlNeedsJName,
      params: { j: `${encode(btoa(JSON.stringify(formToBeSaved)))}` },
    })
  }
}
store.updateSettings({
  exportPdf: true,
  imageUpload: true,
  anonymized: ['firstName', 'lastName', 'imageProfile'],
})
const { formData } = storeToRefs(store)

const bgLogo = new URL('./backgroundLogo.svg', import.meta.url).href
const imgLogo = new URL('./logo.svg', import.meta.url).href
const getImageUrl = (key) => {
  return new URL(`../../assets/flags/${key}-100.png`, import.meta.url).href
}
</script>

<template>
  <article class="page-container">
    <div class="page">
      <div class="page-content">
        <div class="content">
          <span v-if="formData.id" class="id">{{ formData.id }}</span>
          <div class="head">
            <inline-svg :width="300" :src="bgLogo" class="bg-logo" />
            <inline-svg :width="300" :src="imgLogo" class="img-logo" />
          </div>
          <section v-if="formData.summary" class="summary">
            <p>{{ formData.summary }}</p>
          </section>
          <section v-if="formData.technicalKnowledge?.length" class="tech">
            <h2>TECHNICAL KNOWLEDGE</h2>
            <ul>
              <li
                v-for="(tech, index) in formData.technicalKnowledge"
                :key="index"
              >
                <template v-if="tech.enhance">
                  <strong> {{ tech.title }} </strong>
                </template>
                <template v-else>
                  {{ tech.title }}
                </template>
              </li>
            </ul>
          </section>
          <section v-if="formData.roles?.length" class="roles">
            <h2>ROLES</h2>
            <ul>
              <li v-for="(role, index) in formData.roles" :key="index">
                {{ role }}
              </li>
            </ul>
          </section>
          <section
            v-if="
              !formData.workExperience?.newPage &&
              formData.workExperience?.experience?.length
            "
            class="experience"
          >
            <h2>WORK EXPERIENCE</h2>
            <ul>
              <li
                v-for="(exp, index) in formData.workExperience?.experience"
                :key="index"
              >
                <strong>{{ exp.timePeriod }}</strong>
                <span>{{ exp.position }}</span>
                <div v-html="clean(exp.description)" />
              </li>
            </ul>
          </section>
        </div>
        <aside>
          <picture v-if="formData.imageProfile && !formData.anonymous">
            <img :src="formData.imageProfile" />
          </picture>
          <section>
            <strong v-if="!formData.anonymous"
              >{{ formData.firstName }} {{ formData.lastName }}</strong
            >

            <ul v-if="formData.languages" class="locales">
              <li v-for="key in formData.languages" :key="key">
                <img
                  v-if="countriesList[key]"
                  :src="getImageUrl(key)"
                  :alt="countriesList[key].name"
                  :title="countriesList[key].name"
                />
              </li>
            </ul>
            <p>{{ formData.mainPositionRole }}</p>
            <p>{{ formData.secondaryPositionRole }}</p>
            <ul class="tags">
              <li v-for="(tag, index) in formData.hashTags" :key="index">
                #{{ tag }}
              </li>
            </ul>
          </section>
          <section v-if="formData.certificationsAwards?.length">
            <h2>CERTIFICATIONS / AWARDS</h2>
            <ul>
              <li
                v-for="(cert, index) in formData.certificationsAwards"
                :key="index"
              >
                <strong>{{ cert.title }}</strong>
                <p>{{ cert.description }}</p>
              </li>
            </ul>
          </section>
        </aside>
      </div>

      <div
        v-if="
          formData.workExperience?.newPage &&
          formData.workExperience?.experience?.length
        "
        class="page-content"
      >
        <div class="content">
          <section class="experience">
            <h2>WORK EXPERIENCE</h2>
            <ul>
              <li
                v-for="(exp, index) in formData.workExperience?.experience"
                :key="index"
              >
                <strong>{{ exp.timePeriod }}</strong>
                <span>{{ exp.position }}</span>
                <div v-html="clean(exp.description)" />
              </li>
            </ul>
          </section>
        </div>
      </div>
    </div>
  </article>
</template>

<style lang="scss" scoped>
@import './page';
@import '../../assets/color-schema-mixin';

@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@800&display=swap');

:global(#app) {
  --color-black: black;
  --color-white: white;
  --color-logo: #9fddd2;
  --color-aside-bg: #f2f2f2;
  --font-family-title: 'Poppins', sans-serif;

  @include defineAlphas(--color-black, black);
  @include defineAlphas(--color-white, white);
  @include create-color-variants(--color-grey, #bdbdbd);
  @include create-color-variants(--color-primary, #3f1e58);
  @include create-color-variants(--color-secondary, #006452);
  @include create-color-variants(--color-tertiary, #cf3166);
  @include create-color-variants(--color-warning, #ffbb38);
  @include create-color-variants(--color-error, #df1616);
}

.page-container {
  background-color: #f4f3f2;
  padding: 2rem 0;
  min-height: inherit;
  .page {
    margin: 0 auto;
    padding: 0;
    overflow: hidden;
    .page-content {
      display: flex;
      align-items: stretch;
      width: 100%;
      height: 100%;
      min-height: 29.75cm;
      font-family: var(--el-font-family);
      & + .page-content {
        padding-top: 2rem;
        .content {
          width: 100%;
        }
      }
      .id {
        position: absolute;
        right: 0.5rem;
        top: 0.5rem;
        color: var(--el-text-color-secondary);
      }
      aside {
        background-color: var(--color-aside-bg);
        width: 36%;
        picture {
          img {
            width: 100%;
          }
        }
        section {
          padding: 1rem;
          h2 {
            padding-left: 0;
          }
          strong,
          p {
            color: var(--color-tertiary-500);
            font-size: 1.3rem;
            & + p {
              margin-top: 0;
            }
          }
          ul {
            margin-top: 1rem;
            list-style: none;
            &.tags {
              li {
                color: var(--color-secondary-500);
                font-family: var(--font-family-title);
                font-weight: 800;
              }
            }
            li {
              font-size: 1.2rem;

              *:first-letter {
                text-transform: uppercase;
              }

              strong {
                font-size: 1.1rem;
                display: block;
              }
              p {
                color: var(--color-primary-500);
                font-size: 1rem;
                margin-bottom: 1rem;
              }
            }
          }
          .locales {
            display: flex;
            gap: 4px;
            img {
              width: 24px;
            }
          }
        }
      }

      h2 {
        color: var(--color-secondary-500);
        font-family: var(--font-family-title);
        font-weight: 800;
        font-size: 1.5rem;
        padding-bottom: 0.31rem;
        padding-left: 1rem;
        margin-bottom: 0.75rem;
        font-weight: bolder;
        background-repeat: repeat-x;
        background-position: 0 100%;
        background-size: 100% 1px;
        transition: background-size 0.7s ease-in-out;
        background-image: linear-gradient(
          90deg,
          currentColor 0,
          var(--color-logo)
        );
      }
      .content {
        width: 64%;
        height: 100%;
        margin-bottom: 1rem;
        .head {
          position: relative;
          height: 6.5cm;
          .bg-logo {
            position: absolute;
            z-index: 0;
            left: 0;
            top: 0;
            width: 6cm !important;
            opacity: 0.05;
          }
          .img-logo {
            color: var(--color-logo);
            position: absolute;
            left: 0;
            top: 1cm;
            width: 13cm !important;
            z-index: 1;
          }
        }

        section {
          margin: 1rem;
          *:first-letter {
            text-transform: uppercase;
          }

          ul {
            list-style: none;
            padding-left: 0.5rem;
            margin-bottom: 2rem;
            li {
              padding: 0.25rem 0;
            }
          }
          &.tech {
            color: var(--color-tertiary-500);
          }
          &.roles {
            color: var(--color-primary-500);
          }
          &.summary {
            margin: 0 1rem 1rem;
            font-size: 1rem;
            color: var(--color-secondary-700);
          }
          &.experience {
            ul {
              padding-left: 2rem;
              li {
                margin: 0.5rem 0;
                strong {
                  color: var(--color-secondary-500);
                  font-size: 1.1rem;
                  font-family: var(--font-family-title);
                  font-weight: 800;
                }
                span {
                  margin: 0.3rem 0;
                  display: block;
                  color: var(--color-tertiary-500);
                  font-size: 1.3rem;
                  font-weight: bolder;
                }
                p {
                  padding-left: 2rem;
                  white-space: pre;
                }
              }
            }
          }
        }
      }
    }
  }
}
</style>
