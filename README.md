# ResumeAI Pro 🚀

An AI-powered resume analyzer that helps job seekers match their skills to job requirements, get ATS scores, and receive personalized improvement suggestions.

![ResumeAI Pro](https://img.shields.io/badge/AI-Powered-blue)
![React](https://img.shields.io/badge/React-18.3.1-61dafb)
![TypeScript](https://img.shields.io/badge/TypeScript-5.8.3-blue)
![Gemini](https://img.shields.io/badge/Google%20Gemini-Generative%20AI-green)
![Firebase](https://img.shields.io/badge/Firebase-Integrated-orange)

## Overview

ResumeAI Pro is a React + TypeScript web app that analyzes a resume against a target role and returns:

- Match percentage
- ATS score
- Matched and missing skills
- Actionable suggestions to improve the resume

The app uses Google Gemini for AI-powered analysis, with an optional local XGBoost service for ML-based scoring.

## ✨ Features

- **AI-Powered Analysis** - Uses Google Gemini for intelligent resume analysis
- **Skill Matching** - Compare your skills against job requirements instantly
- **ATS Score** - Get your resume score for applicant tracking systems
- **PDF Support** - Upload PDF resumes or paste text directly
- **Multiple Job Roles** - Analyze for Web Dev, Data Analyst, DevOps, Cloud Engineer, and more
- **Personalized Suggestions** - Get actionable recommendations to improve your resume
- **Dark/Light Mode** - Beautiful UI with theme support
- **Responsive Design** - Works perfectly on desktop and mobile

## 🎯 Tech Stack

- **Frontend**: React 18 + TypeScript
- **Styling**: Tailwind CSS + Shadcn UI
- **AI**: Google Gemini (Generative AI)
- **PDF Parsing**: PDF.js
- **Build Tool**: Vite
- **Testing**: Vitest + Testing Library

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Google Gemini API key

### Installation

1. Clone the repository:
```bash
git clone https://github.com/phaneendrakumarbabu/ai-resume-analyser.git
cd ai-resume-analyser
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory:
```bash
VITE_GEMINI_API_KEY=your_gemini_api_key_here
# Optional (XGBoost ML service)
VITE_XGBOOST_ENABLED=true
VITE_XGBOOST_API_URL=http://localhost:5000
```

4. Start the development server:
```bash
npm run dev
```

5. Open your browser and navigate to `http://localhost:8080`

## 📖 Usage

1. **Upload or Paste Resume** - Upload a PDF or paste your resume text
2. **Select Job Role** - Choose your target job role (Web Developer, Data Analyst, etc.)
3. **Analyze** - Click "Analyze Resume" to get AI-powered insights
4. **Review Results** - See your skill match percentage, ATS score, and personalized suggestions

## 🔧 Configuration

### Environment Variables

- `VITE_GEMINI_API_KEY` - Your Google Gemini API key (required for AI analysis)
- `VITE_XGBOOST_ENABLED` - Enable/disable XGBoost ML service integration (default: enabled)
- `VITE_XGBOOST_API_URL` - XGBoost service URL (default: `http://localhost:5000`)

### Fallback Mode

If AI analysis is not configured or fails, the app automatically falls back to other available methods (including basic keyword matching).

## 🏗️ Project Structure

```
ai-resume-analyser/
├── public/              # Static assets
│   ├── favicon.svg      # App icon
│   └── robots.txt
├── src/
│   ├── components/      # React components
│   │   ├── ui/         # Shadcn UI components
│   │   ├── Navbar.tsx
│   │   ├── ProgressBar.tsx
│   │   └── ...
│   ├── lib/            # Utility functions
│   │   ├── aiService.ts      # Gemini integration
│   │   ├── pdfParser.ts      # PDF parsing
│   │   └── resumeData.ts     # Resume analysis logic
│   ├── pages/          # Page components
│   │   ├── Landing.tsx
│   │   ├── Analyzer.tsx
│   │   └── Results.tsx
│   └── main.tsx        # App entry point
├── ml-service/          # Optional Flask + XGBoost ML service
├── .env.example        # Example environment variables
└── package.json
```

## 🧪 Testing

Run tests:
```bash
npm test
```

Run tests in watch mode:
```bash
npm run test:watch
```

## 🏗️ Build

Build for production:
```bash
npm run build
```

Preview production build:
```bash
npm run preview
```

## 🔒 Security Notes

⚠️ **Important**: The current implementation calls the AI provider directly from the browser, which means API keys configured via Vite environment variables can be exposed to users. This is for development/demo purposes only.

### For Production:
1. Create a backend API endpoint
2. Move AI calls to the backend
3. Never expose API keys in frontend code
4. Implement rate limiting and authentication

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

## 👨‍💻 Author

**Phaneendra Kumar Babu**
- GitHub: [@phaneendrakumarbabu](https://github.com/phaneendrakumarbabu)

## 🙏 Acknowledgments

- [Google AI](https://ai.google.dev/) for the Gemini API
- [Shadcn UI](https://ui.shadcn.com/) for the beautiful components
- [Lucide](https://lucide.dev/) for the icons
- [Tailwind CSS](https://tailwindcss.com/) for styling

## 📧 Support

If you have any questions or need help, please open an issue on GitHub.

---

Made with ❤️ by Phaneendra Kumar Babu

## 🧠 Optional: XGBoost ML Service

This repo includes an optional local Flask + XGBoost service in `ml-service/`.

1. Train models (first time)
```bash
cd ml-service
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
python train_model.py
```

2. Start the service
```bash
python app.py
```

Then enable it in your `.env`:
```bash
VITE_XGBOOST_ENABLED=true
VITE_XGBOOST_API_URL=http://localhost:5000
```

## 📚 Documentation

- [Gemini API Setup](GEMINI_API_SETUP.md)
- [Firebase Auth Setup](FIREBASE_AUTH_SETUP.md)
- [Deployment Guide](DEPLOYMENT.md)
- [XGBoost Quick Start](QUICK_START_XGBOOST.md)
