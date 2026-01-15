export async function loadLesson(lessonId: string) {
  // Corrected path: looks for data/lessonId.json at the root of the deployed site
  // Since you moved your files to public/data, they will be accessible at /data/ in the deployed site.
  const lessonUrl = `./data/${lessonId}.json` // <--- THIS LINE IS CHANGED

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
