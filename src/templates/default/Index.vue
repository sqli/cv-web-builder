<script setup>
import { storeToRefs } from 'pinia'
import { useSchema } from '../../stores/schema'
import InlineSvg from '../../components/InlineSvg.vue'
import schema from './schema.json'
const store = useSchema()
store.updateSchema(schema)
const { formData } = storeToRefs(store)
const bgLogo = new URL('./backgroundLogo.svg', import.meta.url).href
const imgLogo = new URL('./logo.svg', import.meta.url).href
</script>

<template>
  <article class="page">
    <div class="page-content">
      <div class="content">
        <div class="head">
          <inline-svg width="300" :src="bgLogo" class="bg-logo" />
          <inline-svg width="300" :src="imgLogo" class="img-logo" />
        </div>
        <section class="tech">
          <h2>TECHNICAL KNOWLEDGE</h2>
          <ul>
            <li
              v-for="(tech, index) in formData.technicalKnowledge"
              :key="index"
            >
              {{ tech }}
            </li>
          </ul>
        </section>
        <section class="roles">
          <h2>ROLES</h2>
          <ul>
            <li v-for="(role, index) in formData.roles" :key="index">
              {{ role }}
            </li>
          </ul>
        </section>
        <section>
          <h2>WORK EXPERIENCE</h2>
          <ul>
            <li v-for="(exp, index) in formData.workExperience" :key="index">
              <span>{{ exp.timePeriod }}</span>
              <span>{{ exp.position }}</span>
              <p>{{ exp.description }}</p>
            </li>
          </ul>
        </section>
      </div>
      <aside>
        <picture>
          <img :src="formData.imageProfile" />
        </picture>
      </aside>
    </div>
  </article>
  <pre>{{ formData }}</pre>
</template>

<style lang="scss" scoped>
@import './page';
@import '../../assets/color-schema-mixin';

:global(#app) {
  background-color: #f4f3f2;
  width: 100%;
  height: 100%;
  min-height: 100vh;

  --color-black: black;
  --color-white: white;
  --color-logo: #9fddd2;
  --color-aside-bg: #f2f2f2;

  @include defineAlphas(--color-black, black);
  @include defineAlphas(--color-white, white);
  @include create-color-variants(--color-grey, #bdbdbd);
  @include create-color-variants(--color-primary, #3f1e58);
  @include create-color-variants(--color-secondary, #006452);
  @include create-color-variants(--color-tertiary, #cf3166);
  @include create-color-variants(--color-warning, #ffbb38);
  @include create-color-variants(--color-error, #df1616);
}

.page-content {
  display: flex;
  align-items: stretch;
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  font-family: var(--el-font-family);

  aside {
    background-color: var(--color-aside-bg);
    width: 36%;
  }

  .content {
    width: 64%;
    height: 100%;
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
      h2 {
        color: var(--color-secondary-500);
        font-size: 1.5rem;
        font-weight: bolder;
        border-bottom: 1px solid currentColor;
        margin-bottom: 1rem;
        padding-left: 0.5rem;
      }
      ul {
        list-style: none;
        padding-left: 0.5rem;
      }
      &.tech {
        color: var(--color-tertiary-500);
      }
      &.roles {
        color: var(--color-primary-500);
      }
    }
  }
}
</style>
