<template>
  <main data-ta="app-main">
    <div>
      <router-view />
    </div>
  </main>
  <EpicTabbar id="app-nav">
    <EpicTabbarItem icon="arrow-left" as="button" @click="handleBackButton"
      >Back</EpicTabbarItem
    >
    <EpicTabbarItem icon="arrow-up" as="router-link" to="/games"
      >Home</EpicTabbarItem
    >
  </EpicTabbar>
  <div class="dev-stuff" v-if="showDevStuff">
    <button @click="handleClick">Log data store</button>
    <button @click="handleSave">Save</button>
    <button @click="handleReset">Reset</button>
  </div>
</template>

<style lang="scss">
.dev-stuff {
  position: absolute;
  top: 0;
}

#app {
  max-width: 480px;
  height: 100%;
}

main {
  height: 100%;
  padding: 0 0.5rem 4rem;

  & > div {
    height: 100%;
    overflow-y: auto;
    padding-bottom: 2rem;
  }
}
</style>
<script>
import { storeInstance } from '@/store/data-store'
import EpicTabbar from '@components/EpicTabbar'
import EpicTabbarItem from '@components/EpicTabbarItem'

export default {
  components: {
    EpicTabbarItem,
    EpicTabbar,
  },
  computed: {
    showDevStuff() {
      return process.env.NODE_ENV === 'development'
    },
  },
  methods: {
    handleBackButton() {
      history.back()
    },
    handleClick() {
      // eslint-disable-next-line no-console
      console.log(storeInstance._referenceStore)
    },
    handleSave() {
      storeInstance.save()
    },
    handleReset() {
      storeInstance.load()
    },
  },
}
</script>
