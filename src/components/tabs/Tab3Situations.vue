<template>
  <div class="situations-tab">
    <!-- Language Toggle -->
    <div class="language-toggle">
      <button
        v-for="lang in languages"
        :key="lang.code"
        @click="store.setLanguage(lang.code)"
        class="lang-button"
        :class="{ active: store.currentLanguage === lang.code }"
        :style="{ '--lang-gradient': lang.gradient }"
      >
        {{ lang.label }}
      </button>
    </div>

    <div class="content-card">
      <h2 class="section-title">🎭 Situações / Situations</h2>
      <p class="subtitle">Veja quando usar "{{ store.currentExpression.text }}" em contextos reais</p>

      <div class="situations-container">
        <div
          v-for="(situation, index) in store.currentExpression.situations"
          :key="situation.id"
          class="situation-card"
          :class="{ revealed: revealedAnswers[index] }"
        >
          <!-- Situation Header -->
          <div class="situation-header">
            <div class="situation-number">Situação {{ index + 1 }}</div>
            <div class="progress-indicator">{{ index + 1 }}/{{ store.currentExpression.situations.length }}</div>
          </div>

          <!-- Portuguese Section -->
          <div v-if="showPT" class="language-section pt-section">
            <div class="section-label">🇧🇷 Português</div>
            <h3 class="situation-title">{{ situation.titlePT }}</h3>
            <div class="description-box">
              <p class="description-text">{{ situation.descriptionPT }}</p>
            </div>
            <div class="context-box">
              <p class="context-text">{{ situation.contextPT }}</p>
            </div>
          </div>

          <!-- English Section -->
          <div v-if="showEN" class="language-section en-section">
            <div class="section-label">🇺🇸 English</div>
            <h3 class="situation-title">{{ situation.titleEN }}</h3>
            <div class="description-box">
              <p class="description-text">{{ situation.descriptionEN }}</p>
            </div>
            <div class="context-box">
              <p class="context-text">{{ situation.contextEN }}</p>
            </div>
          </div>

          <!-- Reveal Button -->
          <button @click="toggleAnswer(index)" class="reveal-button">
            <span class="button-icon">{{ revealedAnswers[index] ? '🔒' : '🔓' }}</span>
            {{ revealedAnswers[index] ? 'Ocultar Resposta' : 'Revelar Resposta' }}
          </button>

          <!-- Answer Container with Animation -->
          <transition name="answer-reveal">
            <div v-if="revealedAnswers[index]" class="answer-container">
              <div class="answer-label">✨ A expressão completa:</div>
              <div class="answer-boxes">
                <div
                  v-for="(word, wordIndex) in situation.answer"
                  :key="wordIndex"
                  class="answer-box"
                  :style="{ 
                    backgroundColor: situation.answerColors[wordIndex],
                    animationDelay: `${wordIndex * 0.1}s`
                  }"
                >
                  {{ word }}
                </div>
              </div>
              <div class="pronunciation-tip">
                💬 Pronuncia: /kæn juː hɪər miː/
              </div>
            </div>
          </transition>

          <!-- 3D Particles Background -->
          <div class="particles-bg">
            <div class="particle" v-for="n in 5" :key="n" :style="{ '--particle-delay': `${n * 0.3}s` }"></div>
          </div>
        </div>
      </div>

      <!-- Progress Tracker -->
      <div class="progress-tracker">
        <div class="tracker-label">Situações Reveladas</div>
        <div class="tracker-dots">
          <div
            v-for="(situation, index) in store.currentExpression.situations"
            :key="index"
            class="tracker-dot"
            :class="{ active: revealedAnswers[index] }"
          ></div>
        </div>
      </div>

      <button @click="nextTab" class="continue-button">
        Continuar para Prática ✍️
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useLessonStore } from '@/stores/lessonStore'

const store = useLessonStore()
const revealedAnswers = ref<boolean[]>([])

const languages = [
  { code: 'both', label: '🌐 PT + EN', gradient: 'linear-gradient(135deg, #00ff88 0%, #ff1744 100%)' },
  { code: 'pt', label: '🇧🇷 PT', gradient: 'linear-gradient(135deg, #00ff88 0%, #00d4ff 100%)' },
  { code: 'en', label: '🇺🇸 EN', gradient: 'linear-gradient(135deg, #ff1744 0%, #b24bf3 100%)' }
]

const showPT = computed(() => store.currentLanguage === 'both' || store.currentLanguage === 'pt')
const showEN = computed(() => store.currentLanguage === 'both' || store.currentLanguage === 'en')

const emit = defineEmits<{
  (e: 'next'): void
}>()

const toggleAnswer = (index: number) => {
  revealedAnswers.value[index] = !revealedAnswers.value[index]
}

const nextTab = () => {
  store.completeTab(3)
  emit('next')
}
</script>

<style scoped lang="scss">
.situations-tab {
  padding: $spacing-xl;
  max-width: 1400px;
  margin: 0 auto;
}

.language-toggle {
  display: flex;
  gap: $spacing-sm;
  justify-content: center;
  margin-bottom: $spacing-lg;
}

.lang-button {
  padding: $spacing-sm $spacing-lg;
  background: rgba(255, 255, 255, 0.05);
  border: 2px solid rgba(255, 255, 255, 0.1);
  border-radius: $radius-md;
  color: #fff;
  font-weight: 700;
  cursor: pointer;
  transition: all $transition-smooth;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: var(--lang-gradient);
    opacity: 0;
    transition: opacity $transition-smooth;
  }

  &:hover::before {
    opacity: 0.2;
  }

  &.active {
    background: var(--lang-gradient);
    border-color: transparent;
    box-shadow: 0 8px 24px rgba(0, 255, 136, 0.4);
  }
}

.content-card {
  background: rgba(26, 29, 46, 0.8);
  border: 2px solid rgba(178, 75, 243, 0.3);
  border-radius: $radius-lg;
  padding: $spacing-xl;
  backdrop-filter: blur(20px);
  position: relative;
  overflow: hidden;
}

.section-title {
  font-family: $font-display;
  font-size: 2.5rem;
  background: $gradient-starwars;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  margin-bottom: $spacing-sm;
  text-align: center;
}

.subtitle {
  text-align: center;
  color: rgba(255, 255, 255, 0.7);
  font-size: 1.1rem;
  margin-bottom: $spacing-xl;
}

.situations-container {
  display: grid;
  gap: $spacing-xl;
  margin-bottom: $spacing-xl;
}

.situation-card {
  background: rgba(26, 29, 46, 0.9);
  border: 2px solid rgba(0, 212, 255, 0.2);
  border-radius: $radius-lg;
  padding: $spacing-lg;
  transition: all $transition-smooth;
  position: relative;
  overflow: hidden;

  &:hover {
    border-color: rgba(0, 212, 255, 0.5);
    box-shadow: 0 8px 32px rgba(0, 212, 255, 0.2);
    transform: translateY(-4px);
  }

  &.revealed {
    border-color: $jedi-green;
    box-shadow: 0 12px 48px rgba(0, 255, 136, 0.4);
  }
}

.situation-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: $spacing-md;
}

.situation-number {
  font-size: 0.9rem;
  color: $jedi-green;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.progress-indicator {
  font-size: 0.85rem;
  color: rgba(255, 255, 255, 0.5);
  background: rgba(0, 0, 0, 0.3);
  padding: $spacing-xs $spacing-sm;
  border-radius: $radius-sm;
}

.language-section {
  margin-bottom: $spacing-lg;
  padding: $spacing-md;
  border-radius: $radius-md;
  position: relative;

  &.pt-section {
    background: linear-gradient(135deg, rgba(0, 255, 136, 0.05) 0%, rgba(0, 212, 255, 0.05) 100%);
    border-left: 4px solid $jedi-green;
  }

  &.en-section {
    background: linear-gradient(135deg, rgba(255, 23, 68, 0.05) 0%, rgba(178, 75, 243, 0.05) 100%);
    border-left: 4px solid $empire-red;
  }
}

.section-label {
  font-size: 0.85rem;
  font-weight: 700;
  margin-bottom: $spacing-xs;
  opacity: 0.8;
}

.situation-title {
  font-size: 1.3rem;
  font-weight: 700;
  margin-bottom: $spacing-sm;
  color: #fff;
}

.description-box,
.context-box {
  background: rgba(0, 0, 0, 0.2);
  padding: $spacing-md;
  border-radius: $radius-sm;
  margin-bottom: $spacing-sm;
}

.description-text,
.context-text {
  font-size: 1.05rem;
  line-height: 1.7;
  color: rgba(255, 255, 255, 0.9);
}

.reveal-button {
  width: 100%;
  padding: $spacing-md;
  background: $gradient-ai-2;
  border: none;
  border-radius: $radius-md;
  font-size: 1.1rem;
  font-weight: 700;
  color: #fff;
  cursor: pointer;
  transition: all $transition-smooth;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: $spacing-sm;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 12px 32px rgba(240, 147, 251, 0.5);
  }
}

.button-icon {
  font-size: 1.3rem;
}

.answer-container {
  margin-top: $spacing-lg;
  padding: $spacing-lg;
  background: rgba(0, 0, 0, 0.4);
  border-radius: $radius-md;
  border: 2px solid $jedi-green;
}

.answer-label {
  text-align: center;
  font-size: 1rem;
  color: $jedi-green;
  margin-bottom: $spacing-md;
  font-weight: 600;
}

.answer-boxes {
  display: flex;
  flex-wrap: wrap;
  gap: $spacing-md;
  justify-content: center;
  margin-bottom: $spacing-md;
}

.answer-box {
  padding: $spacing-md $spacing-lg;
  border-radius: $radius-md;
  color: #fff;
  font-weight: 700;
  font-size: 1.5rem;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
  animation: box-pop 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) both;
}

@keyframes box-pop {
  from {
    transform: scale(0) rotate(-15deg);
    opacity: 0;
  }
  to {
    transform: scale(1) rotate(0);
    opacity: 1;
  }
}

.pronunciation-tip {
  text-align: center;
  font-size: 1.1rem;
  color: $lightsaber-blue;
  font-style: italic;
  padding: $spacing-sm;
  background: rgba(0, 212, 255, 0.1);
  border-radius: $radius-sm;
}

.answer-reveal-enter-active,
.answer-reveal-leave-active {
  transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
}

.answer-reveal-enter-from {
  opacity: 0;
  transform: translateY(-30px) scale(0.9);
}

.answer-reveal-leave-to {
  opacity: 0;
  transform: translateY(30px) scale(0.9);
}

.particles-bg {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  overflow: hidden;
}

.particle {
  position: absolute;
  width: 4px;
  height: 4px;
  background: rgba(178, 75, 243, 0.6);
  border-radius: 50%;
  animation: particle-float 3s infinite ease-in-out;
  animation-delay: var(--particle-delay);
  opacity: 0.6;
  box-shadow: 0 0 10px rgba(178, 75, 243, 0.6);
}

@keyframes particle-float {
  0%, 100% {
    transform: translate(0, 0);
  }
  50% {
    transform: translate(20px, -20px);
  }
}

.progress-tracker {
  text-align: center;
  margin-bottom: $spacing-lg;
}

.tracker-label {
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.6);
  margin-bottom: $spacing-sm;
}

.tracker-dots {
  display: flex;
  gap: $spacing-sm;
  justify-content: center;
}

.tracker-dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.2);
  transition: all $transition-smooth;

  &.active {
    background: $jedi-green;
    box-shadow: 0 0 20px $jedi-green;
    transform: scale(1.3);
  }
}

.continue-button {
  width: 100%;
  padding: $spacing-lg;
  background: $gradient-button;
  border: none;
  border-radius: $radius-md;
  font-size: 1.4rem;
  font-weight: 700;
  color: #fff;
  cursor: pointer;
  transition: all $transition-smooth;
  box-shadow: 0 8px 32px rgba(255, 0, 110, 0.4);

  &:hover {
    transform: translateY(-6px) scale(1.02);
    box-shadow: 0 16px 56px rgba(255, 0, 110, 0.6);
  }
}
</style>
