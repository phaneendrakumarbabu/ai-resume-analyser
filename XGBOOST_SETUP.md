# XGBoost Integration Guide

This guide explains how to set up and use the XGBoost machine learning model in Skill Matcher Pro.

## What is XGBoost?

XGBoost (Extreme Gradient Boosting) is a powerful machine learning algorithm that provides:
- **High accuracy** predictions for resume-job matching
- **Fast inference** times for real-time analysis
- **Better feature understanding** compared to basic keyword matching
- **Adaptive learning** from training data patterns

## Architecture Overview

```
Frontend (React/TypeScript)
         ↓
   xgboostService.ts
         ↓
   Flask API Server (Port 5000)
         ↓
   XGBoost ML Models
         ↓
   Predictions & Analysis
```

## Quick Start

### 1. Setup ML Service

Run the setup script:

**Windows:**
```bash
cd ml-service
setup.bat
```

This will:
- Create a Python virtual environment
- Install all dependencies (XGBoost, Flask, scikit-learn, etc.)
- Train the ML models with synthetic data
- Generate model files in `ml-service/models/`

### 2. Start the ML Service

**Windows:**
```bash
cd ml-service
start-service.bat
```

The service will start on `http://localhost:5000`

### 3. Configure Frontend (Optional)

The frontend automatically connects to `http://localhost:5000` by default.

To customize, create a `.env` file:

```env
VITE_XGBOOST_ENABLED=true
VITE_XGBOOST_API_URL=http://localhost:5000
```

### 4. Run the Application

```bash
npm run dev
```

The application will now use XGBoost for resume analysis!

## How It Works

### Analysis Priority

The application tries methods in this order:

1. **XGBoost ML Model** (if available)
2. **Gemini AI** (if API key configured)
3. **Basic Keyword Matching** (always available)

### Automatic Fallback

- If XGBoost service is unavailable, automatically uses Gemini AI
- If Gemini AI fails, falls back to basic keyword matching
- **No errors** - the application continues to work

### Health Checks

The frontend performs health checks before analysis:
- Checks if ML service is running
- Validates models are loaded
- Falls back gracefully if service is down

## Features

### What XGBoost Analyzes

1. **Resume Text**: TF-IDF vectorization of resume content
2. **Skill Matching**: Number of matched skills vs required skills
3. **Job Role Alignment**: Encoded job role categories
4. **Skill Ratios**: Percentage of required skills present

### Predictions

- **Match Percentage** (0-100): How well the resume fits the job
- **ATS Score** (0-100): Resume optimization for Applicant Tracking Systems
- **Matched Skills**: List of skills found in resume
- **Missing Skills**: Skills required but not found
- **Suggestions**: 5 actionable recommendations
- **Detailed Feedback**: 2-3 paragraphs of analysis

## Supported Job Roles

- Frontend Developer
- Backend Developer
- Full Stack Developer
- DevOps Engineer
- Mobile Developer
- Data Scientist

## API Endpoints

### Health Check
```
GET http://localhost:5000/health
```

Response:
```json
{
  "status": "healthy",
  "models_loaded": true,
  "version": "1.0.0"
}
```

### Analyze Resume
```
POST http://localhost:5000/analyze
Content-Type: application/json

{
  "resumeText": "Professional with experience in React, JavaScript...",
  "roleId": "frontend",
  "roleName": "Frontend Developer",
  "requiredSkills": ["React", "JavaScript", "TypeScript"]
}
```

### Get Roles
```
GET http://localhost:5000/roles
```

## Customization

### Adding New Job Roles

1. Edit `ml-service/train_model.py`:

```python
JOB_SKILLS = {
    'yournewrole': ['Skill1', 'Skill2', 'Skill3'],
    # ... existing roles
}
```

2. Retrain models:
```bash
cd ml-service
python train_model.py
```

3. Restart the service:
```bash
start-service.bat
```

### Improving Model Accuracy

**Increase training samples:**
```python
df = generate_synthetic_data(n_samples=5000)  # Default: 2000
```

**Tune hyperparameters:**
```python
match_model = xgb.XGBRegressor(
    n_estimators=200,    # Default: 100
    max_depth=8,         # Default: 6
    learning_rate=0.05,  # Default: 0.1
)
```

### Using Real Data

Replace synthetic data generation with your own dataset:

```python
# Load your data
df = pd.read_csv('your_training_data.csv')

# Ensure columns: resume_text, role, match_score, ats_score
```

## Troubleshooting

### Service Not Starting

**Issue**: `ModuleNotFoundError: No module named 'xgboost'`

**Solution**:
```bash
cd ml-service
venv\Scripts\activate
pip install -r requirements.txt
```

### Models Not Found

**Issue**: "Models not loaded. Please train models first."

**Solution**:
```bash
cd ml-service
python train_model.py
```

### Connection Refused

**Issue**: "Cannot connect to XGBoost service"

**Solution**:
1. Check if service is running: `http://localhost:5000/health`
2. Start the service: `start-service.bat`
3. Check firewall/antivirus settings

### Low Accuracy

**Issue**: Predictions don't seem accurate

**Solution**:
1. Increase training samples
2. Use real data instead of synthetic
3. Tune hyperparameters
4. Add more features

## Disabling XGBoost

To disable XGBoost and use only Gemini AI or basic matching:

**.env file:**
```env
VITE_XGBOOST_ENABLED=false
```

Or stop the service and the app will automatically fallback.

## Production Deployment

### Using Gunicorn (Linux/Mac)

```bash
pip install gunicorn
gunicorn -w 4 -b 0.0.0.0:5000 app:app
```

### Using Docker

Create `ml-service/Dockerfile`:

```dockerfile
FROM python:3.10-slim

WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt

COPY . .
RUN python train_model.py

CMD ["python", "app.py"]
```

Build and run:
```bash
docker build -t xgboost-service ml-service
docker run -p 5000:5000 xgboost-service
```

### Cloud Deployment

Deploy to:
- **Heroku**: Use Procfile with gunicorn
- **AWS**: EC2, ECS, or Lambda with container
- **Google Cloud**: Cloud Run or App Engine
- **Azure**: App Service or Container Instances

Update frontend `.env`:
```env
VITE_XGBOOST_API_URL=https://your-service.herokuapp.com
```

## Performance

### Benchmarks (Approximate)

- **Health Check**: < 100ms
- **Resume Analysis**: 200-500ms
- **Model Loading**: 2-3 seconds (at startup)
- **Memory Usage**: ~100-200MB

### Optimization Tips

1. **Use caching** for frequently analyzed resumes
2. **Batch predictions** for multiple resumes
3. **Load models once** at startup
4. **Use async** processing for multiple requests
5. **Compress responses** with gzip

## Security Considerations

1. **API Authentication**: Add API keys for production
2. **Rate Limiting**: Prevent abuse with rate limits
3. **Input Validation**: Validate all incoming data
4. **CORS**: Configure allowed origins properly
5. **HTTPS**: Use SSL/TLS in production

## FAQ

**Q: Do I need XGBoost for the app to work?**
A: No, the app works without it using Gemini AI or basic matching.

**Q: Can I use XGBoost without Gemini API?**
A: Yes, XGBoost works independently.

**Q: How accurate is the model?**
A: With synthetic data: ~70-80% R² score. Real data improves this.

**Q: Can I train on my own data?**
A: Yes, modify `train_model.py` to load your dataset.

**Q: Does it work offline?**
A: The ML service works offline once models are trained. Only Gemini AI requires internet.

**Q: What's the difference vs Gemini AI?**
A: XGBoost is faster, more consistent, and can be trained on your data. Gemini AI provides more natural language feedback.

## Support

For issues or questions:
1. Check the troubleshooting section
2. Review logs in the terminal
3. Test endpoints with curl or Postman
4. Ensure all dependencies are installed

## Next Steps

1. ✅ Set up ML service
2. ✅ Train models
3. ✅ Start service
4. ✅ Test with sample resumes
5. 🎯 Customize for your job roles
6. 🎯 Deploy to production
7. 🎯 Collect real data and retrain

Enjoy using XGBoost in your resume analyzer!
