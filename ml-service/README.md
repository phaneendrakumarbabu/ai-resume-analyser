
# XGBoost ML Service for Skill Matcher Pro

This directory contains the XGBoost machine learning service for resume-job matching analysis.

## Overview

The XGBoost ML service provides advanced machine learning-based resume analysis using gradient boosting algorithms. It predicts match percentages and ATS scores based on resume content and job requirements.

## Prerequisites

- Python 3.8 or higher
- pip (Python package manager)

## Setup Instructions

### 1. Install Python Dependencies

Create a virtual environment (recommended):

```bash
cd ml-service
python -m venv venv
```

Activate the virtual environment:

**Windows:**
```bash
venv\Scripts\activate
```

**macOS/Linux:**
```bash
source venv/bin/activate
```

Install required packages:

```bash
pip install -r requirements.txt
```

### 2. Train the XGBoost Models

Before using the service, you need to train the ML models:

```bash
python train_model.py
```

This will:
- Generate synthetic training data
- Train two XGBoost models (match score and ATS score)
- Save the trained models to the `models/` directory
- Create necessary preprocessor files (vectorizer, label encoder)

Expected output files in `models/`:
- `match_model.pkl` - XGBoost model for match percentage prediction
- `ats_model.pkl` - XGBoost model for ATS score prediction
- `vectorizer.pkl` - TF-IDF vectorizer for text processing
- `label_encoder.pkl` - Label encoder for job roles
- `job_skills.json` - Job roles and required skills mapping

### 3. Start the Flask API Server

```bash
python app.py
```

The API server will start on `http://localhost:5000`

Available endpoints:
- `GET /health` - Health check and model status
- `POST /analyze` - Analyze resume with XGBoost
- `GET /roles` - Get available job roles and skills

## API Usage

### Analyze Resume

**Endpoint:** `POST /analyze`

**Request Body:**
```json
{
  "resumeText": "Professional with experience in React, JavaScript, TypeScript...",
  "roleId": "frontend",
  "roleName": "Frontend Developer",
  "requiredSkills": ["React", "JavaScript", "TypeScript", "HTML", "CSS"]
}
```

**Response:**
```json
{
  "matchPercentage": 85.5,
  "atsScore": 82.3,
  "matchedSkills": ["React", "JavaScript", "TypeScript"],
  "missingSkills": ["HTML", "CSS"],
  "suggestions": [
    "Add experience with key technologies: HTML, CSS",
    "Include specific project examples demonstrating your technical skills",
    "Add metrics and quantifiable achievements to your experience section"
  ],
  "detailedFeedback": "Your resume shows strong alignment with the Frontend Developer position...",
  "modelType": "xgboost",
  "isAIPowered": true
}
```

## Supported Job Roles

- `frontend` - Frontend Developer
- `backend` - Backend Developer
- `fullstack` - Full Stack Developer
- `devops` - DevOps Engineer
- `mobile` - Mobile Developer
- `data` - Data Scientist

## Configuration

The main application can be configured via environment variables:

```env
VITE_XGBOOST_ENABLED=true
VITE_XGBOOST_API_URL=http://localhost:5000
```

## Troubleshooting

### Models not loading
**Error:** "Models not loaded. Please train models first."

**Solution:** Run `python train_model.py` to train and save the models.

### Connection refused
**Error:** "Cannot connect to XGBoost service"

**Solution:** Ensure the Flask server is running with `python app.py`

### Import errors
**Error:** "ModuleNotFoundError: No module named 'xgboost'"

**Solution:** Activate virtual environment and install dependencies:
```bash
pip install -r requirements.txt
```

## Architecture

```
ml-service/
├── app.py              # Flask API server
├── train_model.py      # Model training script
├── requirements.txt    # Python dependencies
├── models/            # Trained models (generated)
│   ├── match_model.pkl
│   ├── ats_model.pkl
│   ├── vectorizer.pkl
│   ├── label_encoder.pkl
│   └── job_skills.json
└── README.md          # This file
```

## Integration with Frontend

The frontend automatically integrates with the XGBoost service:

1. **Priority order:** XGBoost ML → Gemini AI → Basic keyword matching
2. **Health check:** Checks service availability before analysis
3. **Fallback:** Automatically falls back to other methods if XGBoost is unavailable
4. **No errors:** The system continues to work even if XGBoost service is down

## Development

### Adding new job roles

Edit the `JOB_SKILLS` dictionary in `train_model.py`:

```python
JOB_SKILLS = {
    'newrole': ['Skill1', 'Skill2', 'Skill3'],
    # ... existing roles
}
```

Then retrain the models:
```bash
python train_model.py
```

### Improving model accuracy

- Increase training data samples in `train_model.py`
- Adjust XGBoost hyperparameters (`n_estimators`, `max_depth`, `learning_rate`)
- Add more features in the `extract_features()` function

## Production Deployment

For production use:

1. Use a production WSGI server like Gunicorn:
   ```bash
   pip install gunicorn
   gunicorn -w 4 -b 0.0.0.0:5000 app:app
   ```

2. Configure proper CORS settings in `app.py`

3. Set up environment-specific configuration

4. Consider using Docker for containerization

5. Implement API rate limiting and authentication

## License

This ML service is part of the Skill Matcher Pro project.
