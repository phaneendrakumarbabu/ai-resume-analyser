"""
Flask API Server for XGBoost Resume-Job Matching
Provides REST API endpoints for resume analysis using XGBoost ML models
"""

from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib
import numpy as np
import pandas as pd
import json
from pathlib import Path
import re

app = Flask(__name__)
CORS(app)  # Enable CORS for frontend requests

# Load models and preprocessors
models_dir = Path(__file__).parent / 'models'

try:
    match_model = joblib.load(models_dir / 'match_model.pkl')
    ats_model = joblib.load(models_dir / 'ats_model.pkl')
    vectorizer = joblib.load(models_dir / 'vectorizer.pkl')
    label_encoder = joblib.load(models_dir / 'label_encoder.pkl')
    
    with open(models_dir / 'job_skills.json', 'r') as f:
        JOB_SKILLS = json.load(f)
    
    print("✓ Models loaded successfully!")
except Exception as e:
    print(f"⚠ Warning: Could not load models. Run train_model.py first.")
    print(f"Error: {e}")
    match_model = None
    ats_model = None
    vectorizer = None
    label_encoder = None
    JOB_SKILLS = {}

def extract_skills_from_text(text, required_skills):
    """Extract skills found in resume text"""
    text_lower = text.lower()
    matched_skills = []
    missing_skills = []
    
    for skill in required_skills:
        # Case-insensitive search with word boundaries
        pattern = r'\b' + re.escape(skill.lower()) + r'\b'
        if re.search(pattern, text_lower):
            matched_skills.append(skill)
        else:
            missing_skills.append(skill)
    
    return matched_skills, missing_skills

def calculate_features(resume_text, role, required_skills):
    """Calculate features for ML prediction"""
    matched_skills, missing_skills = extract_skills_from_text(resume_text, required_skills)
    
    n_matching_skills = len(matched_skills)
    n_total_skills = len(set(re.findall(r'\b[A-Z][a-z]+(?:\.[a-z]+)?', resume_text)))
    skill_match_ratio = n_matching_skills / len(required_skills) if required_skills else 0
    
    return {
        'n_matching_skills': n_matching_skills,
        'n_total_skills': max(n_total_skills, n_matching_skills),
        'skill_match_ratio': skill_match_ratio,
        'matched_skills': matched_skills,
        'missing_skills': missing_skills
    }

def generate_suggestions(matched_skills, missing_skills, role_name):
    """Generate actionable suggestions based on analysis"""
    suggestions = []
    
    if missing_skills:
        top_missing = missing_skills[:3]
        suggestions.append(f"Add experience with key technologies: {', '.join(top_missing)}")
    
    if len(matched_skills) < len(missing_skills):
        suggestions.append(f"Strengthen your {role_name} skills portfolio by learning more required technologies")
    
    suggestions.append("Include specific project examples demonstrating your technical skills")
    suggestions.append("Add metrics and quantifiable achievements to your experience section")
    suggestions.append("Ensure your resume uses industry-standard keywords for better ATS compatibility")
    
    return suggestions[:5]

def generate_detailed_feedback(match_percentage, ats_score, matched_skills, missing_skills, role_name):
    """Generate detailed feedback text"""
    feedback = []
    
    # Overall assessment
    if match_percentage >= 80:
        feedback.append(f"Your resume shows strong alignment with the {role_name} position. You demonstrate proficiency in most required skills.")
    elif match_percentage >= 60:
        feedback.append(f"Your resume shows good potential for the {role_name} position, with room for improvement in certain areas.")
    else:
        feedback.append(f"Your resume currently shows a moderate match for the {role_name} position. Consider strengthening your technical skill set.")
    
    # Strengths
    if matched_skills:
        feedback.append(f"Your strengths include: {', '.join(matched_skills[:5])}.")
    
    # Areas for improvement
    if missing_skills:
        feedback.append(f"To improve your candidacy, consider gaining experience in: {', '.join(missing_skills[:5])}.")
    
    # ATS feedback
    if ats_score >= 80:
        feedback.append("Your resume is well-optimized for Applicant Tracking Systems.")
    else:
        feedback.append("Consider adding more industry keywords to improve ATS compatibility.")
    
    return " ".join(feedback)

@app.route('/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({
        'status': 'healthy',
        'models_loaded': match_model is not None,
        'version': '1.0.0'
    })

@app.route('/analyze', methods=['POST'])
def analyze_resume():
    """Main endpoint for resume analysis using XGBoost"""
    try:
        # Validate models are loaded
        if not all([match_model, ats_model, vectorizer, label_encoder]):
            return jsonify({
                'error': 'Models not loaded. Please train models first by running train_model.py'
            }), 500
        
        # Parse request
        data = request.get_json()
        
        if not data:
            return jsonify({'error': 'No JSON data provided'}), 400
        
        resume_text = data.get('resumeText', '')
        role_id = data.get('roleId', '')
        role_name = data.get('roleName', '')
        
        if not resume_text or not role_id:
            return jsonify({'error': 'Missing required fields: resumeText and roleId'}), 400
        
        # Validate role
        if role_id not in JOB_SKILLS:
            return jsonify({'error': f'Invalid role ID: {role_id}'}), 400
        
        required_skills = JOB_SKILLS[role_id]
        
        # Calculate features
        features = calculate_features(resume_text, role_id, required_skills)
        
        # Prepare data for prediction
        df = pd.DataFrame([{
            'resume_text': resume_text,
            'role': role_id,
            'n_matching_skills': features['n_matching_skills'],
            'n_total_skills': features['n_total_skills'],
            'skill_match_ratio': features['skill_match_ratio']
        }])
        
        # Extract features using same preprocessing as training
        text_features = vectorizer.transform(df['resume_text']).toarray()
        role_encoded = label_encoder.transform(df['role']).reshape(-1, 1)
        numerical_features = df[['n_matching_skills', 'n_total_skills', 'skill_match_ratio']].values
        X = np.hstack([text_features, role_encoded, numerical_features])
        
        # Predict using XGBoost models
        match_percentage = float(match_model.predict(X)[0])
        ats_score = float(ats_model.predict(X)[0])
        
        # Ensure scores are in valid range
        match_percentage = np.clip(match_percentage, 0, 100)
        ats_score = np.clip(ats_score, 0, 100)
        
        # Generate suggestions and feedback
        suggestions = generate_suggestions(
            features['matched_skills'],
            features['missing_skills'],
            role_name
        )
        
        detailed_feedback = generate_detailed_feedback(
            match_percentage,
            ats_score,
            features['matched_skills'],
            features['missing_skills'],
            role_name
        )
        
        # Build response
        result = {
            'matchPercentage': round(match_percentage, 1),
            'atsScore': round(ats_score, 1),
            'matchedSkills': features['matched_skills'],
            'missingSkills': features['missing_skills'],
            'suggestions': suggestions,
            'detailedFeedback': detailed_feedback,
            'modelType': 'xgboost',
            'isAIPowered': True
        }
        
        return jsonify(result)
        
    except Exception as e:
        print(f"Error during analysis: {str(e)}")
        import traceback
        traceback.print_exc()
        return jsonify({
            'error': 'Internal server error during analysis',
            'details': str(e)
        }), 500

@app.route('/roles', methods=['GET'])
def get_roles():
    """Get available job roles and their skills"""
    return jsonify({
        'roles': JOB_SKILLS
    })

@app.errorhandler(404)
def not_found(e):
    return jsonify({'error': 'Endpoint not found'}), 404

@app.errorhandler(500)
def internal_error(e):
    return jsonify({'error': 'Internal server error'}), 500

if __name__ == '__main__':
    print("=" * 60)
    print("XGBoost Resume Matcher - API Server")
    print("=" * 60)
    print("\nStarting Flask server...")
    print("API will be available at: http://localhost:5000")
    print("\nEndpoints:")
    print("  GET  /health  - Health check")
    print("  POST /analyze - Analyze resume")
    print("  GET  /roles   - Get available roles")
    print("\n" + "=" * 60)
    
    app.run(host='0.0.0.0', port=5000, debug=True)
