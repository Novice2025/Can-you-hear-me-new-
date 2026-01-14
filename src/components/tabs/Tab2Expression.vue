<template>
  <div class="expression-tab">
    <div class="expression-card">
      <h2 class="expression-title">Today's Expression</h2>
      <div class="expression-display">
        <input
          v-if="!store.isLocked"
          v-model="localExpression"
          @input="updateExpression"
          class="expression-input"
          placeholder="Enter expression..."
        />
        <p v-else class="expression-text">{{ store.currentExpression?.text || '' }}</p>
      </div>
      <div class="button-group">
        <button v-if="!store.isLocked" @click="lockExpression" class="lock-button">
          🔒 Lock & Save
        </button>
        <button v-else @click="unlockExpression" class="unlock-button">
          🔓 Unlock to Edit
        </button>
        <button @click="nextTab" class="cta-button">
          Continue 🚀
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { useLessonStore } from '@/stores/lessonStore'
import gsap from 'gsap'

const store = useLessonStore()

// ✅ FIX: Use optional chaining and default to empty string
const localExpression = ref(store.currentExpression?.text || '')

// ✅ FIX: Watch for when currentExpression loads
watch(
  () => store.currentExpression,
  (newExpression) => {
    if (newExpression) {
      localExpression.value = newExpression.text
    }
  },
  { immediate: true }
)

const emit = defineEmits<{
  (e: 'next'): void
}>()

const updateExpression = () => {
  const words = localExpression.value.trim().split(/\s+/)
  store.updateExpression({
    text: localExpression.value,
    words: words
  })
}

const lockExpression = () => {
  store.lockExpression()
}

const unlockExpression = () => {
  store.unlockExpression()
}

const nextTab = () => {
  store.completeTab(1)
  emit('next')
}

onMounted(() => {
  gsap.from('.expression-display', {
    scale: 0.8,
    opacity: 0,
    duration: 0.8,
    ease: 'back.out(1.7)'
  })
})
</script>

<style scoped lang="scss">
.expression-tab {
  min-height: 60vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: $spacing-xl;
}

.expression-card {
  background: rgba(26, 29, 46, 0.8);
  border: 2px solid rgba(178, 75, 243, 0.3);
  border-radius: $radius-lg;
  padding: $spacing-xl;
  max-width: 700px;
  width: 100%;
  text-align: center;
  backdrop-filter: blur(20px);
}

.expression-title {
  font-family: $font-display;
  font-size: 2rem;
  background: $gradient-ai-3;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  margin-bottom: $spacing-lg;
}

.expression-display {
  background: rgba(0, 0, 0, 0.4);
  border-radius: $radius-md;
  padding: $spacing-xl;
  margin: $spacing-lg 0;
  position: relative;
  overflow: hidden;
  min-height: 120px;
  display: flex;
  align-items: center;
  justify-content: center;

  &::before {
    content: '';
    position: absolute;
    top: -50%;
    left: -50%;
    width: 200%;
    height: 200%;
    background: conic-gradient(
      from 0deg,
      transparent,
      rgba(178, 75, 243, 0.2),
      transparent 30%
    );
    animation: rotate 4s linear infinite;
  }
}

@keyframes rotate {
  100% { transform: rotate(360deg); }
}

.expression-input {
  font-size: 2.5rem;
  font-weight: 700;
  background: transparent;
  border: none;
  color: #fff;
  text-align: center;
  width: 100%;
  position: relative;
  z-index: 1;
  outline: none;

  &::placeholder {
    color: rgba(255, 255, 255, 0.3);
  }
}

.expression-text {
  font-size: 3rem;
  font-weight: 700;
  background: $gradient-starwars;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  position: relative;
  z-index: 1;
}

.button-group {
  display: flex;
  gap: $spacing-md;
  justify-content: center;
  flex-wrap: wrap;
}

.lock-button,
.unlock-button,
.cta-button {
  padding: $spacing-md $spacing-xl;
  border-radius: $radius-md;
  font-size: 1.2rem;
  font-weight: 700;
  color: #fff;
  cursor: pointer;
  transition: all $transition-smooth;
  border: none;
}

.lock-button {
  background: $gradient-ai-2;
  box-shadow: 0 8px 32px rgba(240, 147, 251, 0.4);
}

.unlock-button {
  background: $gradient-ai-1;
  box-shadow: 0 8px 32px rgba(102, 126, 234, 0.4);
}

.cta-button {
  background: $gradient-button;
  box-shadow: 0 8px 32px rgba(255, 0, 110, 0.4);
}

.lock-button:hover,
.unlock-button:hover,
.cta-button:hover {
  transform: translateY(-4px) scale(1.05);
  box-shadow: 0 12px 48px rgba(255, 0, 110, 0.6);
}
</style>
