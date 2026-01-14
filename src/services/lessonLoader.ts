export async function loadLesson(lessonId: string) {
  const lessonUrl = `/src/data/${lessonId}.json`

  try {
    const response = await fetch(lessonUrl)
    if (!response.ok) throw new Error(`Lesson not found: ${lessonId}`)
    const data = await response.json()

    return {
      id: data.id,
      text: data.expression.text,
      words: data.expression.words,
      whenToUse: {
        title: `${data.whenToUse.titlePT} / ${data.whenToUse.titleEN}`,
        description: data.whenToUse.description,
        images: data.whenToUse.images || []
      },
      situations: data.situations
    }
  } catch (error) {
    console.error("Failed to load lesson:", error)
    throw error
  }
}
