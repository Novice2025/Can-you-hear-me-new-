<template>
  <div id="app">
    <Header />
    <main class="main-content">
      <router-view />
    </main>
    <Footer />
  </div>
</template>

<script setup lang="ts">
import Header from '@/components/Header.vue'
import Footer from '@/components/Footer.vue'
</script>

<style lang="scss">
.main-content {
  flex: 1;
  padding: $spacing-lg;
  max-width: 1400px;
  margin: 0 auto;
  width: 100%;
}
</style>
