"""
XGBoost Resume-Job Matching Model Training Script
This script trains an XGBoost model to predict resume-job match scores
"""

import numpy as np
import pandas as pd
import xgboost as xgb
from sklearn.model_selection import train_test_split
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.preprocessing import LabelEncoder
import joblib
import json
from pathlib import Path

# Job roles and their required skills
JOB_SKILLS = {
    'frontend': ['React', 'JavaScript', 'TypeScript', 'HTML', 'CSS', 'Redux', 'Next.js', 'Vue.js', 'Angular', 'Webpack', 'Jest'],
    'backend': ['Python', 'Node.js', 'Java', 'SQL', 'MongoDB', 'REST API', 'GraphQL', 'Docker', 'AWS', 'Redis', 'Microservices'],
    'fullstack': ['React', 'Node.js', 'TypeScript', 'MongoDB', 'Express', 'REST API', 'Docker', 'AWS', 'Git', 'Jest', 'CI/CD'],
    'devops': ['Docker', 'Kubernetes', 'AWS', 'CI/CD', 'Jenkins', 'Terraform', 'Linux', 'Bash', 'Python', 'Monitoring', 'Git'],
    'mobile': ['React Native', 'Flutter', 'Swift', 'Kotlin', 'iOS', 'Android', 'Firebase', 'Redux', 'REST API', 'Git'],
    'data': ['Python', 'SQL', 'Machine Learning', 'TensorFlow', 'PyTorch', 'Pandas', 'NumPy', 'Spark', 'Tableau', 'Statistics', 'R']
}

def generate_synthetic_data(n_samples=1000):
    """Generate synthetic resume-job matching data"""
    data = []
    
    for _ in range(n_samples):
        # Random job role
        role = np.random.choice(list(JOB_SKILLS.keys()))
        required_skills = JOB_SKILLS[role]
        
        # Generate resume with random skills (some matching, some not)
        n_skills = np.random.randint(3, 15)
        
        # Mix of matching skills and random skills
        matching_ratio = np.random.uniform(0.1, 1.0)
        n_matching = int(n_skills * matching_ratio)
        n_other = n_skills - n_matching
        
        # Get matching skills
        resume_skills = []
        if n_matching > 0:
            resume_skills.extend(np.random.choice(required_skills, min(n_matching, len(required_skills)), replace=False).tolist())
        
        # Add some random skills from other roles
        if n_other > 0:
            all_other_skills = [s for r, skills in JOB_SKILLS.items() if r != role for s in skills]
            if all_other_skills:
                resume_skills.extend(np.random.choice(all_other_skills, min(n_other, len(all_other_skills)), replace=False).tolist())
        
        # Generate resume text
        resume_text = f"Professional with experience in {', '.join(resume_skills)}. "
        resume_text += f"Years of experience: {np.random.randint(1, 15)}. "
        resume_text += f"Education: {np.random.choice(['BS', 'MS', 'PhD', 'Bootcamp'])}. "
        
        # Calculate features
        n_matching_skills = len(set(resume_skills) & set(required_skills))
        n_total_skills = len(resume_skills)
        skill_match_ratio = n_matching_skills / len(required_skills) if required_skills else 0
        
        # Target: match percentage (0-100)
        # Higher score if more matching skills
        base_score = skill_match_ratio * 100
        noise = np.random.normal(0, 5)  # Add some noise
        match_score = np.clip(base_score + noise, 0, 100)
        
        # ATS score (similar but slightly different)
        ats_score = np.clip(base_score + np.random.normal(0, 8), 0, 100)
        
        data.append({
            'resume_text': resume_text,
            'role': role,
            'n_matching_skills': n_matching_skills,
            'n_total_skills': n_total_skills,
            'skill_match_ratio': skill_match_ratio,
            'match_score': match_score,
            'ats_score': ats_score
        })
    
    return pd.DataFrame(data)

def extract_features(df, vectorizer=None, label_encoder=None, fit=True):
    """Extract features from resume data"""
    
    # TF-IDF vectorization of resume text
    if fit:
        vectorizer = TfidfVectorizer(max_features=100, stop_words='english')
        text_features = vectorizer.fit_transform(df['resume_text']).toarray()
    else:
        text_features = vectorizer.transform(df['resume_text']).toarray()
    
    # Encode job role
    if fit:
        label_encoder = LabelEncoder()
        role_encoded = label_encoder.fit_transform(df['role']).reshape(-1, 1)
    else:
        role_encoded = label_encoder.transform(df['role']).reshape(-1, 1)
    
    # Numerical features
    numerical_features = df[['n_matching_skills', 'n_total_skills', 'skill_match_ratio']].values
    
    # Combine all features
    X = np.hstack([text_features, role_encoded, numerical_features])
    
    return X, vectorizer, label_encoder

def train_models():
    """Train XGBoost models for match_score and ats_score prediction"""
    print("Generating synthetic training data...")
    df = generate_synthetic_data(n_samples=2000)
    
    print(f"Training data shape: {df.shape}")
    print(f"Sample data:\n{df.head()}")
    
    # Extract features
    print("\nExtracting features...")
    X, vectorizer, label_encoder = extract_features(df, fit=True)
    y_match = df['match_score'].values
    y_ats = df['ats_score'].values
    
    # Split data
    X_train, X_test, y_match_train, y_match_test, y_ats_train, y_ats_test = train_test_split(
        X, y_match, y_ats, test_size=0.2, random_state=42
    )
    
    print(f"Training set size: {X_train.shape[0]}")
    print(f"Test set size: {X_test.shape[0]}")
    
    # Train match_score model
    print("\nTraining Match Score XGBoost model...")
    match_model = xgb.XGBRegressor(
        n_estimators=100,
        max_depth=6,
        learning_rate=0.1,
        objective='reg:squarederror',
        random_state=42,
        n_jobs=-1
    )
    match_model.fit(X_train, y_match_train)
    match_score = match_model.score(X_test, y_match_test)
    print(f"Match Score Model R² Score: {match_score:.4f}")
    
    # Train ats_score model
    print("\nTraining ATS Score XGBoost model...")
    ats_model = xgb.XGBRegressor(
        n_estimators=100,
        max_depth=6,
        learning_rate=0.1,
        objective='reg:squarederror',
        random_state=42,
        n_jobs=-1
    )
    ats_model.fit(X_train, y_ats_train)
    ats_score = ats_model.score(X_test, y_ats_test)
    print(f"ATS Score Model R² Score: {ats_score:.4f}")
    
    # Save models and preprocessors
    models_dir = Path(__file__).parent / 'models'
    models_dir.mkdir(exist_ok=True)
    
    print(f"\nSaving models to {models_dir}...")
    joblib.dump(match_model, models_dir / 'match_model.pkl')
    joblib.dump(ats_model, models_dir / 'ats_model.pkl')
    joblib.dump(vectorizer, models_dir / 'vectorizer.pkl')
    joblib.dump(label_encoder, models_dir / 'label_encoder.pkl')
    
    # Save job skills mapping
    with open(models_dir / 'job_skills.json', 'w') as f:
        json.dump(JOB_SKILLS, f, indent=2)
    
    print("✓ Models saved successfully!")
    print(f"\nModel files:")
    print(f"  - match_model.pkl")
    print(f"  - ats_model.pkl")
    print(f"  - vectorizer.pkl")
    print(f"  - label_encoder.pkl")
    print(f"  - job_skills.json")
    
    return match_model, ats_model, vectorizer, label_encoder

if __name__ == '__main__':
    print("=" * 60)
    print("XGBoost Resume Matcher - Model Training")
    print("=" * 60)
    train_models()
    print("\n" + "=" * 60)
    print("Training Complete!")
    print("=" * 60)
