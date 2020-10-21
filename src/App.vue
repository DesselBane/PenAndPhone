<template>
  <main data-ta="app-main">
    <router-view />
  </main>
  <div id="nav">
    <router-link to="/">Home</router-link>
    <router-link to="/games">Games</router-link>
    <router-link to="/playground">Playground</router-link>
    <button @click="handleClick">Log data store</button>
  </div>
</template>

<style lang="scss">
#app {
  display: grid;
  grid-template-rows: 1fr auto;
  max-width: 480px;
  padding: 0 0.5rem;
  margin: 0 auto;
  height: 100%;
}

#main {
  height: 100%;
}

#nav {
  padding: 30px;

  a {
    font-weight: bold;
    color: #2c3e50;

    &.router-link-exact-active {
      color: #42b983;
    }
  }
}
</style>
<script>
import { storeInstance } from '@/store/data-store'

export default {
  methods: {
    handleClick() {
      // eslint-disable-next-line no-console
      console.log(storeInstance._referenceStore)
    },
  },
}
</script>
