<template>
  <main>
    <router-view />
  </main>
  <div id="nav">
    <router-link to="/">Home</router-link>
    <router-link to="/games">Games</router-link>
    <router-link to="/playground">Playground</router-link>
  </div>
</template>

<style lang="scss">
#app {
  display: grid;
  grid-template-rows: 1fr auto;
  max-width: 480px;
  height: 100%;
  margin: 0 auto;
  text-align: center;
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
