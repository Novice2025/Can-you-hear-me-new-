# 🎓 How to Add New Lessons to NEXTATION

## Step 1: Copy the Template
cp src/data/lesson-template.json src/data/lesson-YOUR-EXPRESSION-NAME.json

## Step 2: Edit the JSON File
Open the new file in VS Code or any text editor and change:
- id: "lesson-002", "lesson-003", etc.
- expression.text: Your new expression
- expression.words: Break it into words
- situations: Write 2-3 real scenarios

## Step 3: Update the Store (ONE LINE)
Open src/stores/lessonStore.ts and change the lesson ID

## Step 4: Test Locally
npm run dev
Open http://localhost:5173 and verify everything works.

## Step 5: Deploy to GitHub
git add .
git commit -m "Add lesson: YOUR EXPRESSION"
git push

Netlify will auto-deploy in 1-2 minutes!

## Color Codes for Words
- Blue: #00d4ff
- Purple: #b24bf3
- Green: #00ff88
- Red: #ff1744
- Cyan: #00f5ff

## File Structure
src/data/
- lesson-template.json (Master template)
- lesson-can-you-hear-me.json (Lesson 1)
- lesson-break-the-ice.json (Lesson 2)
- lesson-YOUR-NEW-LESSON.json (Lesson 3+)

## What NEVER Changes
- All Vue components
- All styles
- Tab system
- Animations
- Colors

## What Changes Per Lesson
- Only the JSON file
- One line in lessonStore.ts
- Images (optional)
