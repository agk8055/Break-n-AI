# Break-n-AI ✨  
AI-powered Note Summarizer built with Gemini API, Node.js, and React.

## 🚀 Overview

Breakn AI is an intelligent web application that summarizes long academic or general notes into concise and meaningful content. Powered by Google’s Gemini API, it helps students and learners quickly digest large volumes of information.

## 🧠 Features

- 📄 Upload or paste long notes
- 🤖 Get concise summaries using the Gemini AI
- 🎯 Student-focused: Tailored for classroom and study use
- 🗣️ Ask follow-up questions (student-only query model)
- ⚡ Fast, clean, and responsive interface

## 🛠️ Tech Stack

- **Frontend**: React.js  
- **Backend**: Node.js + Express  
- **AI Model**: Google Gemini API  
- **Styling**: (Add your preferred CSS or UI library here)

## 📦 Installation

### 1. Clone the repository

```bash
git clone https://github.com/agk8055/Break-n-AI.git
cd Break-n-AI
```
---
## 2. Install dependencies
**For backend:**
```bash
cd backend
npm install
```
**For frontend:**
```bash
cd  frontend
npm install
```
---
## 3. Set up environment variables
- Create a .env file in the server/ directory with:
```env
GEMINI_API_KEY=your_gemini_api_key
PORT=5000
```
- Optionally set CORS config and frontend URL as needed.
---
## 4. Run the app
**Start the backend:**
```bash
cd server
npm start
```
**Start the frontend:**
```bash
cd frontend
npm run dev
```
