<template>
  <div class="write-sequence-tab">
    <div class="instruction-card">
      <h2>✍️ Escreva a Expressão</h2>
      <p>Clique para revelar cada palavra. Escreva em seu caderno antes de clicar na próxima!</p>
    </div>

    <div class="word-display">
      <transition-group name="word-drop" tag="div" class="words-container">
        <div
          v-for="(word, index) in revealedWords"
          :key="index"
          class="word-box"
          :style="{ '--color': getWordColor(index) }"
        >
          {{ word }}
        </div>
      </transition-group>
    </div>

    <div class="controls">
      <button
        v-if="currentWordIndex < totalWords"
        @click="revealNextWord"
        class="reveal-button"
      >
        {{ currentWordIndex === 0 ? 'Começar ✍️' : 'Próxima Palavra 📝' }}
      </button>
      <button
        v-else
        @click="completeAndNext"
        class="complete-button"
      >
        Completar & Continuar 🎉
      </button>
    </div>

    <div class="progress-dots">
      <span
        v-for="n in totalWords"
        :key="n"
        class="dot"
        :class="{ active: n <= currentWordIndex }"
      ></span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useLessonStore } from '@/stores/lessonStore'

const store = useLessonStore()
const currentWordIndex = ref(0)
const revealedWords = ref<string[]>([])

const emit = defineEmits<{
  (e: 'next'): void
}>()

const totalWords = computed(() => store.currentExpression.words.length)

const wordColors = ['#ff1744', '#00d4ff', '#00ff88', '#b24bf3', '#00f5ff']

const getWordColor = (index: number) => wordColors[index % wordColors.length]

const revealNextWord = () => {
  if (currentWordIndex.value < totalWords.value) {
    revealedWords.value.push(store.currentExpression.words[currentWordIndex.value])
    currentWordIndex.value++
    store.nextWord()
  }
}

const completeAndNext = () => {
  store.completeTab(4)
  emit('next')
}
</script>

<style scoped lang="scss">
.write-sequence-tab {
  max-width: 900px;
  margin: 0 auto;
  padding: $spacing-xl;
}

.instruction-card {
  background: rgba(26, 29, 46, 0.8);
  border: 2px solid rgba(0, 212, 255, 0.3);
  border-radius: $radius-lg;
  padding: $spacing-lg;
  text-align: center;
  margin-bottom: $spacing-xl;

  h2 {
    font-family: $font-display;
    font-size: 2rem;
    background: $gradient-ai-3;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    margin-bottom: $spacing-sm;
  }

  p {
    color: rgba(255, 255, 255, 0.8);
    font-size: 1.1rem;
  }
}

.word-display {
  min-height: 300px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: $spacing-xl;
}

.words-container {
  display: flex;
  flex-wrap: wrap;
  gap: $spacing-md;
  justify-content: center;
}

.word-box {
  background: var(--color);
  color: #fff;
  padding: $spacing-md $spacing-lg;
  border-radius: $radius-md;
  font-size: 2rem;
  font-weight: 700;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);
  animation: word-drop 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);
}

@keyframes word-drop {
  from {
    opacity: 0;
    transform: translateY(-100px) rotate(-10deg);
  }
  to {
    opacity: 1;
    transform: translateY(0) rotate(0deg);
  }
}

.controls {
  display: flex;
  justify-content: center;
  margin-bottom: $spacing-lg;
}

.reveal-button,
.complete-button {
  background: $gradient-button;
  border: none;
  padding: $spacing-md $spacing-xl;
  border-radius: $radius-md;
  font-size: 1.2rem;
  font-weight: 700;
  color: #fff;
  cursor: pointer;
  transition: all $transition-smooth;
  box-shadow: 0 8px 32px rgba(255, 0, 110, 0.4);

  &:hover {
    transform: translateY(-4px) scale(1.05);
    box-shadow: 0 12px 48px rgba(255, 0, 110, 0.6);
  }
}

.progress-dots {
  display: flex;
  gap: $spacing-sm;
  justify-content: center;
}

.dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.2);
  transition: all $transition-smooth;

  &.active {
    background: $jedi-green;
    box-shadow: 0 0 20px $jedi-green;
  }
}
</style>
