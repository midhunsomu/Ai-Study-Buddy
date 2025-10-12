# AI-Powered Study Buddy (React)

This repository contains a user-friendly React application that converts study materials (PDFs, notes) into summaries, flashcards, and quizzes using Generative AI (Gemini-2.0-Flash).

---

## Features

- Material Upload (PDF and plain text)
- Automated Summarization per topic
- Digital Flashcard Generation
- Quiz Question Generation (multiple choice + short answer)
- Local persistence (localStorage) and optional Firebase/Netlify deploy
- Simple Node/Express backend proxy to call Gemini-2.0-Flash safely (keeps API key server-side)

---

## Tech Stack

- React (Vite recommended)
- Tailwind CSS for UI
- Node + Express backend (for API proxy)
- pdfjs-dist to extract text from PDFs
- @google/generative-ai or REST fetch to Gemini-2.0-Flash (via backend)

---

## Video

https://drive.google.com/file/d/17mxIDRQ2bSTRk_jfq3AqFeVMzCGft4EJ/view?usp=sharing
