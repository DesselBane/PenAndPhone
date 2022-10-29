<template>
  <header>
    <router-link to="/">Home</router-link>
    <router-link to="/splittermond">Splittermond</router-link>
  </header>
  <router-view></router-view>
</template>

<style scoped>
header {
  display: flex;
  justify-content: center;
  gap: 1rem;
}
</style>
