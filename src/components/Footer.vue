<template>
  <footer class="app-footer">
    <p class="footer-text">
      Created and projected by <span class="highlight">Daby</span> 🚀
    </p>
  </footer>
</template>

<style scoped lang="scss">
.app-footer {
  background: rgba(26, 29, 46, 0.8);
  backdrop-filter: blur(20px);
  border-top: 2px solid rgba(0, 245, 255, 0.3);
  padding: $spacing-lg;
  text-align: center;
  margin-top: auto;
}

.footer-text {
  font-size: 1rem;
  color: rgba(255, 255, 255, 0.7);
}

.highlight {
  background: $gradient-starwars;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  font-weight: 700;
}
</style>
