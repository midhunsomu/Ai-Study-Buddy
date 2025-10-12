# AI Study Buddy 

An intelligent learning platform designed to transform study materials into interactive learning experiences.  
This project was built for the **AI Learnify Hackathon** to solve the problem of disorganized and passive learning.

<img width="1917" height="671" alt="image" src="https://github.com/user-attachments/assets/6c1dd478-605b-4567-9e2e-5c56bf9a0ae6" />




## Problem Statement
Students often struggle with scattered study materials like PDFs, lecture notes, and spreadsheets.  
It is challenging to extract key information, revise efficiently, and test knowledge.  

**AI Study Buddy** addresses this by providing a centralized platform to automatically process and convert documents into powerful study tools.

---

## Core Features
- **Multi-Format File Upload**: Supports PDF, Excel (.xlsx, .xls, .csv), and plain text (.txt, .md).  
- **AI-Powered Summaries**: Automatically generates concise, topic-wise summaries highlighting key concepts.  
- **Instant Flashcards**: Creates digital flashcards with questions and answers for quick revision and memorization.  
- **Automated Quizzes**: Generates multiple-choice quizzes based on uploaded material for active learning and self-assessment.  

---

## 🛠️ Technology Stack
- **Frontend**: React.js  
- **Generative AI**: Google Gemini API (`gemini-1.5-flash-latest`)  
- **File Processing**:  
  - `pdfjs-dist` for PDF text extraction  
  - `xlsx` for Excel and CSV processing  

---

## Getting Started

### Prerequisites
- Node.js and npm (or yarn) installed on your system  
- A valid **Google Gemini API Key** ([Google AI Studio](https://ai.google/studio))

### Installation & Setup

1. Clone the repository:

```bash
git clone https://github.com/YourUsername/ai-study-buddy.git
cd ai-study-buddy
```

2.Install dependencies:

```bash
npm install
```

3. Set up environment variables:

 - Create a .env file in the project root
 - Add your Gemini API key:
   ```bash
   REACT_APP_GEMINI_API_KEY="YOUR_API_KEY_HERE"
   ```
4. Run the Application
   ```bash
   npm start
   ```
- The app will be available at http://localhost:3000

## Usage
- Open the web application in your browser.
- Click Choose File to upload your study material (PDF, Excel, TXT).
- Wait for the file to process; the action buttons will become active.
- Click Create Summary, Make Flashcards, or Generate Quiz to get AI-powered results.

## Video

https://drive.google.com/file/d/17mxIDRQ2bSTRk_jfq3AqFeVMzCGft4EJ/view?usp=sharing
