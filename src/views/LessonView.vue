<template>
  <div class="lesson-view">
    <TabNavigation @tab-change="currentTab = $event" />

    <transition name="tab-fade" mode="out-in">
      <component
        :is="currentTabComponent"
        :key="currentTab"
        @next="goToNextTab"
      />
    </transition>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useLessonStore } from '@/stores/lessonStore'
import TabNavigation from '@/components/TabNavigation.vue'
import Tab2Expression from '@/components/tabs/Tab2Expression.vue'
import Tab3WhenToUse from '@/components/tabs/Tab3WhenToUse.vue'
import Tab3Situations from '@/components/tabs/Tab3Situations.vue'
import Tab4WriteSequence from '@/components/tabs/Tab4WriteSequence.vue'
import Tab5DragDrop from '@/components/tabs/Tab5DragDrop.vue'

const lessonStore = useLessonStore()
const currentTab = ref(1)

const tabComponents: Record<number, any> = {
  1: Tab2Expression,
  2: Tab3WhenToUse,
  3: Tab3Situations,
  4: Tab4WriteSequence,
  5: Tab5DragDrop
}

const currentTabComponent = computed(() => tabComponents[currentTab.value])

const goToNextTab = () => {
  if (currentTab.value < 5) {
    currentTab.value++
  } else {
    // Lesson complete
    alert('🎉 Parabéns! Você completou a lição!')
  }
}

// 🔥 THIS IS THE CRITICAL LINE THAT WAS MISSING
onMounted(() => {
  lessonStore.initLesson() // Loads 'lesson-can-you-hear-me' by default
})
</script>

<style scoped lang="scss">
.lesson-view {
  padding: $spacing-lg;
}

.tab-fade-enter-active,
.tab-fade-leave-active {
  transition: opacity $transition-smooth;
}

.tab-fade-enter-from,
.tab-fade-leave-to {
  opacity: 0;
}
</style>
