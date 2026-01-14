<template>
  <div class="when-to-use-tab">
    <div class="when-to-use-card">
      <h2 class="when-to-use-title">🍏 Quando Usar</h2>
      <p class="when-to-use-subtitle">
        Adicione duas imagens que representam situações onde você usaria esta expressão.
      </p>

      <div class="image-upload-grid">
        <!-- Image Slot 1 -->
        <div class="upload-box">
          <div v-if="images[0]" class="uploaded-image">
            <img :src="images[0]" alt="Situation 1" />
            <button @click="removeImage(0)" class="remove-btn">🗑️ Remove</button>
          </div>
          <label v-else for="image1" class="upload-label">
            <div class="upload-icon">📸</div>
            <p>Clique para adicionar imagem 1</p>
            <input
              id="image1"
              type="file"
              accept="image/*"
              @change="handleImageUpload(0, $event)"
              style="display: none"
            />
          </label>
        </div>

        <!-- Image Slot 2 -->
        <div class="upload-box">
          <div v-if="images[1]" class="uploaded-image">
            <img :src="images[1]" alt="Situation 2" />
            <button @click="removeImage(1)" class="remove-btn">🗑️ Remove</button>
          </div>
          <label v-else for="image2" class="upload-label">
            <div class="upload-icon">📸</div>
            <p>Clique para adicionar imagem 2</p>
            <input
              id="image2"
              type="file"
              accept="image/*"
              @change="handleImageUpload(1, $event)"
              style="display: none"
            />
          </label>
        </div>
      </div>

      <div class="button-row">
        <button class="cta-button" @click="nextTab">
          Continuar 🚀
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useLessonStore } from '@/stores/lessonStore'
import gsap from 'gsap'

const store = useLessonStore()

const emit = defineEmits<{
  (e: 'next'): void
}>()

// ✅ Get images from store (reactive)
const images = computed(() => store.currentExpression?.whenToUse?.images || [])

// ✅ Handle image upload
const handleImageUpload = (index: number, event: Event) => {
  const input = event.target as HTMLInputElement
  const file = input.files?.[0]

  if (file) {
    const reader = new FileReader()
    reader.onload = (e) => {
      const imageUrl = e.target?.result as string

      // 🔥 Save to store (which also saves to localStorage)
      store.uploadImage(imageUrl)
    }
    reader.readAsDataURL(file)
  }
}

// ✅ Remove image
const removeImage = (index: number) => {
  store.removeImage(index)
}

// ✅ Go to next tab
const nextTab = () => {
  store.completeTab(2)
  emit('next')
}

// ✅ Animation on mount
onMounted(() => {
  gsap.from('.when-to-use-card', {
    opacity: 0,
    y: 30,
    duration: 0.6,
    ease: 'power2.out'
  })
})
</script>

<style scoped lang="scss">
.when-to-use-tab {
  min-height: 60vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: $spacing-xl;
}

.when-to-use-card {
  background: rgba(26, 29, 46, 0.8);
  border-radius: $radius-lg;
  border: 2px solid rgba(178, 75, 243, 0.3);
  padding: $spacing-xl;
  max-width: 900px;
  width: 100%;
  text-align: center;
  backdrop-filter: blur(20px);
}

.when-to-use-title {
  font-family: $font-display;
  font-size: 2rem;
  background: $gradient-ai-3;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  margin-bottom: $spacing-sm;
}

.when-to-use-subtitle {
  color: rgba(255, 255, 255, 0.7);
  margin-bottom: $spacing-xl;
  font-size: 1.1rem;
}

.image-upload-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: $spacing-lg;
  margin-bottom: $spacing-xl;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
}

.upload-box {
  border: 2px dashed rgba(178, 75, 243, 0.5);
  border-radius: $radius-md;
  padding: $spacing-lg;
  background: rgba(0, 0, 0, 0.3);
  min-height: 250px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all $transition-smooth;

  &:hover {
    border-color: rgba(178, 75, 243, 0.8);
    background: rgba(0, 0, 0, 0.4);
  }
}

.upload-label {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  width: 100%;
  height: 100%;
  color: rgba(255, 255, 255, 0.7);
  transition: all $transition-smooth;

  &:hover {
    color: #fff;
    transform: scale(1.02);
  }

  .upload-icon {
    font-size: 3rem;
    margin-bottom: $spacing-md;
  }

  p {
    font-size: 1rem;
    margin: 0;
  }
}

.uploaded-image {
  position: relative;
  width: 100%;
  height: 100%;
  border-radius: $radius-md;
  overflow: hidden;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: $radius-md;
  }

  .remove-btn {
    position: absolute;
    top: 12px;
    right: 12px;
    background: rgba(255, 0, 0, 0.9);
    color: white;
    border: none;
    padding: 10px 16px;
    border-radius: $radius-sm;
    cursor: pointer;
    font-size: 0.9rem;
    font-weight: 600;
    transition: all $transition-smooth;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);

    &:hover {
      background: rgba(255, 0, 0, 1);
      transform: scale(1.05);
      box-shadow: 0 6px 16px rgba(255, 0, 0, 0.4);
    }
  }
}

.button-row {
  display: flex;
  justify-content: center;
  margin-top: $spacing-lg;
}

.cta-button {
  padding: $spacing-md $spacing-xl;
  border-radius: $radius-md;
  font-size: 1.2rem;
  font-weight: 700;
  color: #fff;
  cursor: pointer;
  transition: all $transition-smooth;
  border: none;
  background: $gradient-button;
  box-shadow: 0 8px 32px rgba(255, 0, 110, 0.4);

  &:hover {
    transform: translateY(-4px) scale(1.05);
    box-shadow: 0 12px 48px rgba(255, 0, 110, 0.6);
  }
}
</style>
