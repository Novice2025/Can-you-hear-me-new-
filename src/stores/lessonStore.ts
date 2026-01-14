import { defineStore } from 'pinia'
import type { Expression, UserProgress } from '@/types/lesson'
import { loadLesson } from '@/services/lessonLoader'

export const useLessonStore = defineStore('lesson', {
  state: () => ({
    currentExpression: null as Expression | null,
    currentLanguage: 'both' as 'pt' | 'en' | 'both',
    userProgress: {
      currentTab: 1,
      completedTabs: [] as number[],
      writeProgress: 0,
      dragDropAttempts: 0
    } as UserProgress
  }),

  getters: {
    isTabCompleted: (state) => (tabNumber: number) => {
      return state.userProgress.completedTabs.includes(tabNumber)
    },

    canAccessTab: (state) => (tabNumber: number) => {
      if (tabNumber === 1) return true
      return state.userProgress.completedTabs.includes(tabNumber - 1)
    },

    totalProgress: (state) => {
      return (state.userProgress.completedTabs.length / 5) * 100
    }
  },

  actions: {
    async initLesson(lessonId: string = 'lesson-can-you-hear-me') {
      try {
        this.currentExpression = await loadLesson(lessonId)

        // 🔥 NEW: Load saved images from localStorage
        this.loadImagesFromStorage()
      } catch (error) {
        console.error('Failed to load lesson:', error)
      }
    },

    completeTab(tabNumber: number) {
      if (!this.userProgress.completedTabs.includes(tabNumber)) {
        this.userProgress.completedTabs.push(tabNumber)
      }
    },

    setCurrentTab(tabNumber: number) {
      if (this.canAccessTab(tabNumber)) {
        this.userProgress.currentTab = tabNumber
      }
    },

    nextWord() {
      this.userProgress.writeProgress++
    },

    resetProgress() {
      this.userProgress = {
        currentTab: 1,
        completedTabs: [],
        writeProgress: 0,
        dragDropAttempts: 0
      }
    },

    // 🔥 UPDATED: Upload image and save to localStorage
    uploadImage(imageUrl: string) {
      if (this.currentExpression && this.currentExpression.whenToUse) {
        // Initialize images array if it doesn't exist
        if (!this.currentExpression.whenToUse.images) {
          this.currentExpression.whenToUse.images = []
        }

        // Only allow max 2 images
        if (this.currentExpression.whenToUse.images.length < 2) {
          this.currentExpression.whenToUse.images.push(imageUrl)

          // Save to localStorage for persistence
          this.saveImagesToStorage()
        }
      }
    },

    // 🔥 NEW: Remove image and update localStorage
    removeImage(index: number) {
      if (this.currentExpression && this.currentExpression.whenToUse) {
        this.currentExpression.whenToUse.images.splice(index, 1)
        this.saveImagesToStorage()
      }
    },

    // 🔥 NEW: Save images to localStorage
    saveImagesToStorage() {
      if (this.currentExpression) {
        const lessonId = this.currentExpression.id
        const images = this.currentExpression.whenToUse?.images || []
        localStorage.setItem(`lesson-images-${lessonId}`, JSON.stringify(images))
      }
    },

    // 🔥 NEW: Load images from localStorage
    loadImagesFromStorage() {
      if (this.currentExpression) {
        const lessonId = this.currentExpression.id
        const savedImages = localStorage.getItem(`lesson-images-${lessonId}`)

        if (savedImages && this.currentExpression.whenToUse) {
          try {
            this.currentExpression.whenToUse.images = JSON.parse(savedImages)
          } catch (error) {
            console.error('Failed to load saved images:', error)
          }
        }
      }
    },

    setLanguage(lang: 'pt' | 'en' | 'both') {
      this.currentLanguage = lang
    }
  }
})
