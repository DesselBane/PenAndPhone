<template>
  <main>
    <router-view />
  </main>
  <div id="nav">
    <router-link to="/">Home</router-link>
    <router-link to="/edit-char">Edit</router-link>
  </div>
</template>

<style lang="scss">
#body {
  height: 100%;
}

#app {
  height: 100%;
  display: grid;
  grid-template-rows: 1fr auto;
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
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
