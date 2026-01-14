<template>
  <div class="drag-drop-tab">
    <div class="instruction-card">
      <h2>🎮 Praticar com Arrastar & Soltar</h2>
      <p>Arraste as palavras na ordem correta para formar a expressão!</p>
    </div>

    <div class="game-container">
      <div class="drop-zone">
        <div class="drop-label">✨ Monte a expressão aqui</div>
        <div 
          class="drop-area"
          @drop="onDrop"
          @dragover.prevent
          @dragenter.prevent
        >
          <transition-group name="word-slide" tag="div" class="dropped-words">
            <div
              v-for="(word, index) in droppedWords"
              :key="`dropped-${index}`"
              class="dropped-word"
              :class="{ 'correct': isCorrectOrder(index) }"
              draggable="true"
              @dragstart="startDragFromDropped(word, index)"
            >
              {{ word }}
              <button @click="removeWord(index)" class="remove-btn">✕</button>
            </div>
          </transition-group>

          <div v-if="droppedWords.length === 0" class="empty-state">
            👆 Arraste as palavras aqui
          </div>
        </div>
      </div>

      <div class="words-pool">
        <div class="pool-label">🎯 Palavras Disponíveis</div>
        <div class="words-list">
          <div
            v-for="(word, index) in availableWords"
            :key="`available-${index}`"
            class="draggable-word"
            :style="{ '--word-color': getWordColor(index) }"
            draggable="true"
            @dragstart="startDragFromPool(word, index)"
          >
            {{ word }}
          </div>
        </div>
      </div>
    </div>

    <div class="feedback">
      <transition name="fade">
        <div v-if="isComplete" class="success-message">
          <div class="confetti">🎉</div>
          <span>Perfeito! Você acertou!</span>
          <div class="confetti">🎊</div>
        </div>
        <div v-else-if="droppedWords.length > 0" class="progress-message">
          📝 {{ droppedWords.length }} / {{ store.currentExpression.words.length }} palavras
        </div>
      </transition>
    </div>

    <button v-if="!isComplete && droppedWords.length > 0" @click="showHint" class="hint-button">
      💡 Dica
    </button>

    <transition name="slide-up">
      <button
        v-if="isComplete"
        @click="completeAndFinish"
        class="finish-button"
      >
        Finalizar Lição 🏆
      </button>
    </transition>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useLessonStore } from '@/stores/lessonStore'

const store = useLessonStore()

const shuffleArray = (array: string[]) => {
  const shuffled = [...array]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  return shuffled
}

const availableWords = ref<string[]>(shuffleArray([...store.currentExpression.words]))
const droppedWords = ref<string[]>([])
const draggedItem = ref<{ word: string; index: number; source: 'pool' | 'dropped' } | null>(null)

const emit = defineEmits<{
  (e: 'next'): void
}>()

const wordColors = ['#00d4ff', '#b24bf3', '#00ff88', '#ff1744', '#00f5ff']

const getWordColor = (index: number) => wordColors[index % wordColors.length]

const isCorrectOrder = (index: number) => {
  return droppedWords.value[index] === store.currentExpression.words[index]
}

const isComplete = computed(() => {
  if (droppedWords.value.length !== store.currentExpression.words.length) {
    return false
  }
  return droppedWords.value.every((word, index) => 
    word === store.currentExpression.words[index]
  )
})

const startDragFromPool = (word: string, index: number) => {
  draggedItem.value = { word, index, source: 'pool' }
}

const startDragFromDropped = (word: string, index: number) => {
  draggedItem.value = { word, index, source: 'dropped' }
}

const onDrop = (event: DragEvent) => {
  event.preventDefault()
  if (!draggedItem.value) return

  if (draggedItem.value.source === 'pool') {
    droppedWords.value.push(draggedItem.value.word)
    availableWords.value.splice(draggedItem.value.index, 1)
  }

  draggedItem.value = null
}

const removeWord = (index: number) => {
  const word = droppedWords.value[index]
  droppedWords.value.splice(index, 1)
  availableWords.value.push(word)
}

const showHint = () => {
  const firstWrongIndex = droppedWords.value.findIndex((word, index) => 
    word !== store.currentExpression.words[index]
  )

  if (firstWrongIndex !== -1) {
    alert(`💡 Dica: A palavra na posição ${firstWrongIndex + 1} está incorreta. Tente novamente!`)
  }
}

const completeAndFinish = () => {
  store.completeTab(5)
  emit('next')
}
</script>

<style scoped lang="scss">
.drag-drop-tab {
  max-width: 1200px;
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
  backdrop-filter: blur(20px);

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

.game-container {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: $spacing-lg;
  margin-bottom: $spacing-xl;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
}

.drop-zone,
.words-pool {
  background: rgba(26, 29, 46, 0.8);
  border: 2px solid rgba(178, 75, 243, 0.3);
  border-radius: $radius-lg;
  padding: $spacing-lg;
  backdrop-filter: blur(20px);
}

.drop-label,
.pool-label {
  font-size: 1.1rem;
  font-weight: 700;
  color: $lightsaber-blue;
  margin-bottom: $spacing-md;
  text-transform: uppercase;
  letter-spacing: 1px;
  text-align: center;
}

.drop-area {
  min-height: 250px;
  background: rgba(0, 0, 0, 0.3);
  border: 3px dashed rgba(0, 212, 255, 0.4);
  border-radius: $radius-md;
  padding: $spacing-md;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  transition: all $transition-smooth;

  &:hover {
    border-color: rgba(0, 212, 255, 0.7);
    background: rgba(0, 212, 255, 0.05);
  }
}

.dropped-words {
  display: flex;
  flex-wrap: wrap;
  gap: $spacing-md;
  justify-content: center;
  width: 100%;
}

.empty-state {
  width: 100%;
  text-align: center;
  color: rgba(255, 255, 255, 0.4);
  padding: $spacing-xl;
  font-size: 1.3rem;
  animation: pulse-glow 2s ease-in-out infinite;
}

@keyframes pulse-glow {
  0%, 100% { opacity: 0.4; }
  50% { opacity: 0.7; }
}

.dropped-word {
  background: $gradient-ai-1;
  color: #fff;
  padding: $spacing-sm $spacing-md;
  border-radius: $radius-md;
  font-weight: 700;
  font-size: 1.2rem;
  display: flex;
  align-items: center;
  gap: $spacing-xs;
  cursor: move;
  transition: all $transition-smooth;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.3);

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.4);
  }

  &.correct {
    background: linear-gradient(135deg, #00ff88 0%, #00d4ff 100%);
    box-shadow: 0 0 20px rgba(0, 255, 136, 0.5);
    animation: correct-pulse 0.6s ease-in-out;
  }
}

@keyframes correct-pulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.1); }
}

.word-slide-enter-active,
.word-slide-leave-active {
  transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.word-slide-enter-from {
  opacity: 0;
  transform: translateY(-30px) scale(0.8);
}

.word-slide-leave-to {
  opacity: 0;
  transform: translateY(30px) scale(0.8);
}

.remove-btn {
  background: rgba(0, 0, 0, 0.3);
  border: none;
  color: #fff;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all $transition-fast;
  font-size: 14px;

  &:hover {
    background: rgba(255, 0, 0, 0.6);
    transform: rotate(90deg);
  }
}

.words-list {
  display: flex;
  flex-wrap: wrap;
  gap: $spacing-md;
  justify-content: center;
  min-height: 200px;
}

.draggable-word {
  background: var(--word-color);
  color: #fff;
  padding: $spacing-md $spacing-lg;
  border-radius: $radius-md;
  font-weight: 700;
  font-size: 1.2rem;
  cursor: move;
  transition: all $transition-smooth;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.3);

  &:hover {
    transform: translateY(-4px) rotate(2deg);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.5);
  }

  &:active {
    opacity: 0.7;
    transform: scale(0.95);
  }
}

.feedback {
  text-align: center;
  margin-bottom: $spacing-lg;
  min-height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.success-message {
  font-size: 1.8rem;
  font-weight: 700;
  background: $gradient-ai-2;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  animation: success-bounce 0.8s ease-in-out;
  display: flex;
  align-items: center;
  gap: $spacing-md;
}

@keyframes success-bounce {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.15); }
}

.confetti {
  font-size: 2.5rem;
  animation: confetti-spin 1s ease-in-out infinite;
}

@keyframes confetti-spin {
  0%, 100% { transform: rotate(0deg); }
  50% { transform: rotate(20deg); }
}

.progress-message {
  color: $lightsaber-blue;
  font-size: 1.2rem;
  font-weight: 600;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.4s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.hint-button {
  width: 100%;
  padding: $spacing-md;
  background: rgba(255, 255, 255, 0.1);
  border: 2px solid rgba(255, 193, 7, 0.5);
  border-radius: $radius-md;
  font-size: 1.1rem;
  font-weight: 700;
  color: #ffc107;
  cursor: pointer;
  transition: all $transition-smooth;
  margin-bottom: $spacing-md;

  &:hover {
    background: rgba(255, 193, 7, 0.2);
    border-color: #ffc107;
    transform: translateY(-2px);
  }
}

.finish-button {
  width: 100%;
  padding: $spacing-lg;
  background: $gradient-button;
  border: none;
  border-radius: $radius-md;
  font-size: 1.5rem;
  font-weight: 700;
  color: #fff;
  cursor: pointer;
  transition: all $transition-smooth;
  box-shadow: 0 8px 32px rgba(255, 0, 110, 0.4);

  &:hover {
    transform: translateY(-6px) scale(1.03);
    box-shadow: 0 16px 56px rgba(255, 0, 110, 0.6);
  }
}

.slide-up-enter-active,
.slide-up-leave-active {
  transition: all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.slide-up-enter-from {
  opacity: 0;
  transform: translateY(50px);
}

.slide-up-leave-to {
  opacity: 0;
  transform: translateY(-50px);
}
</style>
