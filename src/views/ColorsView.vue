<template>
  <main>
    <h2>Theme Color Alpha</h2>
    <div class="colors chessboard">
      <em>Alpha percentage</em>
      <span class="hint" v-for="i in 9">{{ i * 10 }} </span>
      <div class="color" v-for="color in defaultColors">
        <em>{{ color }}</em>
        <span
          v-for="i in 9"
          v-bind:style="{
            backgroundColor: `var(--color-${color}-alpha${i * 10})`,
          }"
        >
        </span>
      </div>
      <div class="color" v-for="color in colors">
        <em>{{ color }}</em>
        <span
          v-for="i in 9"
          v-bind:style="{
            backgroundColor: `var(--color-${color}-alpha${i * 10})`,
          }"
        >
        </span>
      </div>
    </div>

    <h2>Theme Color Lightness Variations</h2>
    <div class="colors">
      <em>Color Step</em><span class="hint" v-for="i in 9">{{ i * 100 }} </span>
      <div class="color" v-for="color in colors">
        <em>{{ color }}</em>
        <span
          v-for="i in 9"
          v-bind:style="{ backgroundColor: `var(--color-${color}-${i * 100})` }"
        >
        </span>
      </div>
    </div>
  </main>
</template>

<script>
export default {
  name: 'KiColors',
  setup() {
    const defaultColors = ['black', 'white']
    const colors = [
      'grey',
      'primary',
      'secondary',
      'success',
      'warning',
      'error',
    ]
    return {
      colors,
      defaultColors,
    }
  },
}
</script>

<style lang="scss" scoped>
* {
  font-family: var(--font-family);
}

h2 {
  font-size: 2em;
  margin-top: 2em;
  margin-bottom: 0.5em;
}
em {
  font-weight: bolder;
  width: 6em;
  text-transform: capitalize;
  display: inline-block;
}

main {
  display: flex;
  flex-direction: column;
}
.colors {
  display: table;
  padding: 2em;
  &.chessboard {
    --color-chess: var(--color-grey-100);
    background-image: linear-gradient(
        45deg,
        var(--color-chess) 25%,
        transparent 25%
      ),
      linear-gradient(-45deg, var(--color-chess) 25%, transparent 25%),
      linear-gradient(45deg, transparent 75%, var(--color-chess) 75%),
      linear-gradient(-45deg, transparent 75%, var(--color-chess) 75%);
    background-size: 20px 20px;
    background-position: 0 0, 0 10px, 10px -10px, -10px 0px;
    background-repeat: repeat;
    .color {
      border-bottom: 1px solid var(--color-grey-500);
      border-top: 1px solid var(--color-grey-500);
      margin-top: -1px;
    }
  }

  .hint {
    display: inline-block;
    text-align: center;
    width: 2em;
    height: 2em;
    margin: 0.5em;
  }
  .color {
    display: flex;
    position: relative;
    align-items: center;
    border-bottom: 1px solid var(--color-grey-100);
    border-top: 1px solid var(--color-grey-100);
    margin-top: -1px;
    span {
      display: flex;
      justify-content: center;
      align-items: center;
      width: 2em;
      height: 2em;
      margin: 0.5em;
    }
  }
}
</style>
