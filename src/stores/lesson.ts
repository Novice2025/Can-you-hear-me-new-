    import { defineStore } from 'pinia'
    import { ref, computed } from 'vue'
    import { Lesson, Expression } from '@/types/lesson'

    // Helper function to load lesson data from JSON files
    async function loadLessonData(lessonId: string): Promise<Lesson | null> {
      try {
        const module = await import(`../../public/data/${lessonId}.json`)
        return module.default as Lesson
      } catch (error) {
        console.error(`Failed to load lesson data for ${lessonId}:`, error)
        return null
      }
    }

    // Helper function to save images to localStorage
    function saveImageToLocalStorage(lessonId: string, expressionId: string, imageData: string) {
      localStorage.setItem(`lesson-${lessonId}-expression-${expressionId}-image`, imageData)
    }

    // Helper function to load images from localStorage
    function loadImageFromLocalStorage(lessonId: string, expressionId: string): string | null {
      return localStorage.getItem(`lesson-${lessonId}-expression-${expressionId}-image`)
    }

    // Helper function to delete images from localStorage
    function deleteImageFromLocalStorage(lessonId: string, expressionId: string) {
      localStorage.removeItem(`lesson-${lessonId}-expression-${expressionId}-image`)
    }

    export const useLessonStore = defineStore('lesson', () => {
      const initLesson = 'lesson-loud-and-clear' // THIS IS NOW CORRECTLY SET TO 'loud-and-clear'

      const currentLesson = ref<Lesson | null>(null)
      const currentExpression = ref<Expression | null>(null)
      const lessonImage = ref<string | null>(null)
      const expressionImages = ref<Record<string, string | null>>({})

      async function loadLesson(lessonId: string) {
        const data = await loadLessonData(lessonId)
        if (data) {
          currentLesson.value = data
          if (data.expressions && data.expressions.length > 0) {
            setCurrentExpression(data.expressions[0].id)
          }
          data.expressions.forEach(exp => {
            const savedImage = loadImageFromLocalStorage(lessonId, exp.id)
            if (savedImage) {
              expressionImages.value[exp.id] = savedImage
            }
          })
        } else {
          currentLesson.value = null
          currentExpression.value = null
          expressionImages.value = {}
        }
      }

      function setCurrentExpression(expressionId: string) {
        if (currentLesson.value) {
          const found = currentLesson.value.expressions.find(exp => exp.id === expressionId)
          if (found) {
            currentExpression.value = found
          } else {
            console.warn(`Expression with ID ${expressionId} not found in current lesson.`)
            currentExpression.value = null
          }
        }
      }

      function uploadExpressionImage(expressionId: string, imageData: string) {
        if (currentLesson.value) {
          expressionImages.value[expressionId] = imageData
          saveImageToLocalStorage(currentLesson.value.id, expressionId, imageData)
        }
      }

      function deleteExpressionImage(expressionId: string) {
        if (currentLesson.value && expressionImages.value[expressionId]) {
          delete expressionImages.value[expressionId]
          deleteImageFromLocalStorage(currentLesson.value.id, expressionId)
        }
      }

      const currentExpressionImage = computed(() => {
        if (currentExpression.value && currentLesson.value) {
          return expressionImages.value[currentExpression.value.id] || null
        }
        return null
      })

      loadLesson(initLesson)

      return {
        currentLesson,
        currentExpression,
        lessonImage,
        expressionImages,
        currentExpressionImage,
        loadLesson,
        setCurrentExpression,
        uploadExpressionImage,
        deleteExpressionImage,
      }
    })
