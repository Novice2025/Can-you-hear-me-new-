<template>
  <nav class="tab-navigation">
    <button
      v-for="tab in tabs"
      :key="tab.id"
      @click="selectTab(tab.id)"
      class="tab-button"
      :class="{ 'active': currentTab === tab.id, 'completed': isCompleted(tab.id) }"
    >
      <span class="tab-icon">{{ tab.icon }}</span>
      <span class="tab-label">{{ tab.label }}</span>
    </button>
  </nav>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useLessonStore } from '@/stores/lessonStore'

const store = useLessonStore()
const currentTab = ref(1)

const tabs = [
  { id: 1, label: 'Expression', icon: '💬' },
  { id: 2, label: 'When to Use', icon: '🎯' },
  { id: 3, label: 'Situations', icon: '🎭' },
  { id: 4, label: 'Write', icon: '✍️' },
  { id: 5, label: 'Practice', icon: '🎮' }
]

const emit = defineEmits<{
  (e: 'tabChange', tabId: number): void
}>()

const selectTab = (tabId: number) => {
  currentTab.value = tabId
  emit('tabChange', tabId)
}

const isCompleted = (tabId: number) => 
  store.userProgress.completedTabs.includes(tabId)
</script>

<style scoped lang="scss">
.tab-navigation {
  display: flex;
  gap: $spacing-sm;
  padding: $spacing-md;
  background: rgba(26, 29, 46, 0.6);
  border-radius: $radius-lg;
  margin: $spacing-lg 0;
  overflow-x: auto;
}

.tab-button {
  flex: 1;
  min-width: 120px;
  padding: $spacing-md;
  background: rgba(255, 255, 255, 0.05);
  border: 2px solid transparent;
  border-radius: $radius-md;
  color: rgba(255, 255, 255, 0.7);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: $spacing-xs;
  transition: all $transition-smooth;
  position: relative;
  overflow: hidden;
  cursor: pointer;
  font-weight: 600;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: $gradient-ai-1;
    opacity: 0;
    transition: all $transition-smooth;
  }

  &:hover {
    border-color: rgba(178, 75, 243, 0.5);
    transform: translateY(-4px);

    &::before {
      left: 0;
      opacity: 0.1;
    }
  }

  &.active {
    background: $gradient-ai-1;
    color: #fff;
    border-color: $ai-cyan;
    box-shadow: 0 8px 32px rgba(178, 75, 243, 0.4);
  }

  &.completed::after {
    content: '✓';
    position: absolute;
    top: 8px;
    right: 8px;
    width: 20px;
    height: 20px;
    background: $jedi-green;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 12px;
    font-weight: bold;
  }
}

.tab-icon {
  font-size: 2rem;
}

.tab-label {
  font-size: 0.9rem;
}
</style>
