import React, { useState } from 'react';
import { GoogleGenerativeAI } from '@google/generative-ai';
import * as pdfjsLib from 'pdfjs-dist/build/pdf';
import * as XLSX from 'xlsx';
import './App.css';

// Correctly load the worker from the public folder
pdfjsLib.GlobalWorkerOptions.workerSrc = `/pdf.worker.mjs`;

const API_KEY = "your-api-key";
const genAI = new GoogleGenerativeAI(API_KEY);

// <-- 1. CORRECTED MODEL NAME HERE -->
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

export default function App() {
  const [file, setFile] = useState(null);
  const [fileContent, setFileContent] = useState('');
  const [summary, setSummary] = useState('');
  const [flashcards, setFlashcards] = useState([]);
  const [quiz, setQuiz] = useState([]);
  const [loading, setLoading] = useState('');
  const [error, setError] = useState('');
  const [extractionStatus, setExtractionStatus] = useState('idle');

  const handleFileChange = async (e) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    // Reset all states for the new file
    setFile(selectedFile);
    setError('');
    setFileContent('');
    setSummary('');
    setFlashcards([]);
    setQuiz([]);
    setExtractionStatus('processing');

    try {
      let text = '';
      const fileExtension = selectedFile.name.split('.').pop().toLowerCase();

      if (fileExtension === 'pdf') {
        const arrayBuffer = await selectedFile.arrayBuffer();
        const pdf = await pdfjsLib.getDocument(arrayBuffer).promise;
        for (let i = 1; i <= pdf.numPages; i++) {
          const page = await pdf.getPage(i);
          const textContent = await page.getTextContent();
          text += textContent.items.map(item => item.str).join(' ');
        }
      } else if (['xlsx', 'xls', 'csv'].includes(fileExtension)) {
        const arrayBuffer = await selectedFile.arrayBuffer();
        const workbook = XLSX.read(arrayBuffer, { type: 'buffer' });
        workbook.SheetNames.forEach(sheetName => {
          const worksheet = workbook.Sheets[sheetName];
          text += XLSX.utils.sheet_to_csv(worksheet) + '\n';
        });
      } else {
        text = await selectedFile.text();
      }
      
      if (!text || text.trim().length < 20) {
        setError('The uploaded file contained little or no readable text.');
        setExtractionStatus('error');
      } else {
        setFileContent(text);
        setExtractionStatus('done');
      }
    } catch (err) {
      console.error('Error processing file:', err);
      setError('Failed to read or process the file. It might be corrupted or in an unsupported format.');
      setExtractionStatus('error');
    }
  };

  // <-- 2. SIMPLIFIED AND MORE ROBUST API CALLER -->
  const callGeminiAPI = async (prompt) => {
    try {
      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      return text;
    } catch (err) {
      console.error('Gemini API call error:', err);
      // Pass a user-friendly error message back
      throw new Error(`Error from AI: ${err.message}`);
    }
  };

  const handleGenerate = async (type) => {
    if (!fileContent) {
      alert('Please upload a file first!');
      return;
    }

    setLoading(type);
    setError('');

    // <-- 3. IMPROVED ERROR HANDLING LOGIC -->
    try {
      if (type === 'summary') {
        const prompt = `Please provide a concise, topic-wise summary of the following text:\n\n${fileContent}`;
        const apiResponse = await callGeminiAPI(prompt);
        if (apiResponse) setSummary(apiResponse);
      } 
      
      else if (type === 'flashcards') {
        const prompt = `Based on the following text, generate 5-10 flashcards for quick revision. Format the output as a valid JSON array of objects, where each object has a "q" (question) key and an "a" (answer) key. Example: [{"q": "Q1", "a": "A1"}]. Do not include any text, formatting, or markdown like \`\`\`json outside of the JSON array.\n\nText:\n${fileContent}`;
        const apiResponse = await callGeminiAPI(prompt);
        if (apiResponse) {
          try {
            const cleanedJson = apiResponse.replace(/```json/g, '').replace(/```/g, '').trim();
            setFlashcards(JSON.parse(cleanedJson));
          } catch (e) {
            console.error('JSON Parse (flashcards) error:', e, "\nRaw Response:", apiResponse);
            setError("AI returned flashcards in a format I couldn't parse.");
          }
        }
      } 
      
      else if (type === 'quiz') {
        const prompt = `Create a multiple-choice quiz with 5 questions based on the text below. Format as a valid JSON array of objects. Each object should have a "question" string, an "options" array of 4 strings, and an "answer" string. Example: [{"question": "Q1?", "options": ["A", "B", "C", "D"], "answer": "C"}]. Do not include any text, formatting, or markdown like \`\`\`json outside the JSON array.\n\nText:\n${fileContent}`;
        const apiResponse = await callGeminiAPI(prompt);
        if (apiResponse) {
          try {
            const cleanedJson = apiResponse.replace(/```json/g, '').replace(/```/g, '').trim();
            setQuiz(JSON.parse(cleanedJson));
          } catch (e) {
            console.error('JSON Parse (quiz) error:', e, "\nRaw Response:", apiResponse);
            setError("AI returned the quiz in a format I couldn't parse.");
          }
        }
      }
    } catch (err) {
        // This will catch errors from callGeminiAPI
        setError(err.message);
    } finally {
      setLoading('');
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>AI Study Buddy 🧠</h1>
        <p>Upload your study material to get started.</p>
      </header>

      <main className="container">
        <section className="upload-section">
          <h2>1. Upload Your Notes (PDF, Excel, TXT, etc.)</h2>
          <input
            type="file"
            onChange={handleFileChange}
            accept=".pdf,.xlsx,.xls,.csv,.txt,.md"
          />
          {file && <p>Selected file: <strong>{file.name}</strong></p>}
          
          {extractionStatus === 'done' && <p className="success-message">✅ File processed successfully!</p>}
          {error && <p className="error-message">{error}</p>}
        </section>

        <section className="generation-buttons">
          <button onClick={() => handleGenerate('summary')} disabled={!fileContent || !!loading}>
            {loading === 'summary' ? 'Generating...' : 'Create Summary'}
          </button>
          <button onClick={() => handleGenerate('flashcards')} disabled={!fileContent || !!loading}>
            {loading === 'flashcards' ? 'Generating...' : 'Make Flashcards'}
          </button>
          <button onClick={() => handleGenerate('quiz')} disabled={!fileContent || !!loading}>
            {loading === 'quiz' ? 'Generating...' : 'Generate Quiz'}
          </button>
        </section>

        {summary && (
          <section className="output-section">
            <h2>Summary</h2>
            <div className="summary-text" style={{ whiteSpace: 'pre-wrap' }}>{summary}</div>
          </section>
        )}
        {flashcards.length > 0 && (
          <section className="output-section">
            <h2>Flashcards</h2>
            <div className="flashcards-grid">
              {flashcards.map((card, idx) => (
                <div key={idx} className="flashcard">
                  <p><strong>Q:</strong> {card.q}</p>
                  <p><strong>A:</strong> {card.a}</p>
                </div>
              ))}
            </div>
          </section>
        )}
        {quiz.length > 0 && (
          <section className="output-section">
            <h2>Quiz Questions</h2>
            <div className="quiz-questions">
              {quiz.map((item, idx) => (
                <div key={idx} className="quiz-card">
                  <p><strong>{idx + 1}. {item.question}</strong></p>
                  <ul>
                    {item.options?.map((opt, i) => <li key={i}>{opt}</li>)}
                  </ul>
                  <p className="quiz-answer"><strong>Correct Answer:</strong> {item.answer}</p>
                </div>
              ))}
            </div>
          </section>
        )}
      </main>
    </div>
  );
}