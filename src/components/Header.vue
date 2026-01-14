<template>
  <header class="app-header">
    <div class="header-content">
      <h1 class="logo">
        <span class="logo-icon">🧱</span>
        Daby Blockchain Method
      </h1>
      <div class="progress-bar-container">
        <div 
          class="progress-bar" 
          :style="{ width: `${progressPercentage}%` }"
        ></div>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useLessonStore } from '@/stores/lessonStore'

const store = useLessonStore()

const progressPercentage = computed(() => {
  return (store.userProgress.completedTabs.length / 5) * 100
})
</script>

<style scoped lang="scss">
.app-header {
  background: rgba(26, 29, 46, 0.8);
  backdrop-filter: blur(20px);
  border-bottom: 2px solid rgba(178, 75, 243, 0.3);
  padding: $spacing-md $spacing-lg;
  position: sticky;
  top: 0;
  z-index: 100;
}

.header-content {
  max-width: 1400px;
  margin: 0 auto;
}

.logo {
  font-family: $font-display;
  font-size: 2rem;
  background: $gradient-ai-3;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  display: flex;
  align-items: center;
  gap: $spacing-sm;
  margin-bottom: $spacing-sm;
}

.logo-icon {
  font-size: 2.5rem;
  filter: drop-shadow(0 0 20px rgba(178, 75, 243, 0.6));
}

.progress-bar-container {
  height: 6px;
  background: $empire-gray;
  border-radius: 3px;
  overflow: hidden;
}

.progress-bar {
  height: 100%;
  background: $gradient-button;
  transition: width 0.6s cubic-bezier(0.4, 0, 0.2, 1);
}
</style>
