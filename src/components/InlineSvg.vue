<template>
  <div
    ref="innerSvg"
    class="inline-svg"
    :class="className"
    :style="containerStyle"
  />
</template>

<script setup lang="ts">
import { ref, watch, onMounted, computed } from 'vue'

const props = defineProps({
  src: {
    type: String,
    default: '',
  },
  ariaLabel: {
    type: String,
    default: '',
  },
  ariaHidden: {
    type: Boolean,
  },
  focusable: {
    type: Boolean,
  },
  width: {
    type: Number,
    default: 0,
  },
  className: {
    type: [String, Object],
    default: '',
  },
})

const innerSvg = ref<HTMLDivElement | null>(null)
const isSvg = computed(() => {
  return props.src?.endsWith('.svg')
})

const containerStyle = {
  width: `${props.width}px`,
}

const convertImageToSvg = async () => {
  try {
    const res = await fetch(props.src)
    const svgText = (await res.text()) as String
    writeSvg(svgText)
  } catch (error) {
    console.error(error)
  }
}

const writeSvg = (svgText: String) => {
  if (!innerSvg.value) return

  innerSvg.value.innerHTML = getSvgElement(svgText)

  const svg = innerSvg.value.firstChild as HTMLElement

  if (!svg || svg.tagName !== 'svg') return

  const attribs = {
    'aria-label': props.ariaLabel,
    role: props.ariaLabel && 'img',
    'aria-hidden': props.ariaHidden?.toString(),
    focusable: props.focusable?.toString(),
    viewBox: '',
  }

  const width = (svg as Element).getAttribute('width')
  const height = (svg as Element).getAttribute('height')
  const viewBox = (svg as Element).getAttribute('viewBox')
  if (width && height && !viewBox) {
    attribs.viewBox = `0 0 ${width} ${height}`
  }

  setAttributes(svg, attribs)
}

const setAttributes = (el: HTMLElement, attrs: any) => {
  Object.keys(attrs).forEach((key) => {
    if (attrs[key]) {
      el.setAttribute(key, attrs[key])
    }
  })
}

const getSvgElement = (svgText: String) => {
  const svgPattern = /<\s*svg[^>]*>(.*?)<\/svg>/g
  const lineBreaksPattern = /(\r\n|\n|\r)/gm
  const matchResult = svgText.replace(lineBreaksPattern, '').match(svgPattern)
  return matchResult ? matchResult[0] : ''
}

watch(
  () => props.src,
  async () => {
    await convertImageToSvg()
  },
)

onMounted(() => {
  isSvg.value && convertImageToSvg()
})
</script>

<style lang="scss" scoped>
.inline-svg {
  display: flex;

  svg {
    width: inherit;
    height: auto;

    path {
      fill: currentColor;
    }

    rect {
      stroke: currentColor;
    }
  }
}
</style>
