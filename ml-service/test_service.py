"""
Test script for XGBoost ML Service
Run this to verify the service is working correctly
"""

import requests
import json

API_URL = "http://localhost:5000"

def test_health_check():
    """Test health check endpoint"""
    print("Testing health check endpoint...")
    try:
        response = requests.get(f"{API_URL}/health", timeout=5)
        print(f"✓ Health check: {response.status_code}")
        print(f"  Response: {response.json()}")
        return response.status_code == 200
    except Exception as e:
        print(f"✗ Health check failed: {e}")
        return False

def test_get_roles():
    """Test get roles endpoint"""
    print("\nTesting get roles endpoint...")
    try:
        response = requests.get(f"{API_URL}/roles", timeout=5)
        print(f"✓ Get roles: {response.status_code}")
        data = response.json()
        print(f"  Available roles: {list(data['roles'].keys())}")
        return response.status_code == 200
    except Exception as e:
        print(f"✗ Get roles failed: {e}")
        return False

def test_analyze_resume():
    """Test analyze resume endpoint"""
    print("\nTesting analyze resume endpoint...")
    
    test_resume = """
    John Doe
    Frontend Developer
    
    Skills: React, JavaScript, TypeScript, HTML, CSS, Redux, Git
    
    Experience:
    - 3 years building web applications with React
    - Expert in modern JavaScript (ES6+)
    - Strong TypeScript skills
    - Experience with state management using Redux
    
    Education: BS Computer Science
    """
    
    payload = {
        "resumeText": test_resume,
        "roleId": "frontend",
        "roleName": "Frontend Developer",
        "requiredSkills": ["React", "JavaScript", "TypeScript", "HTML", "CSS"]
    }
    
    try:
        response = requests.post(
            f"{API_URL}/analyze",
            json=payload,
            headers={"Content-Type": "application/json"},
            timeout=30
        )
        print(f"✓ Analyze resume: {response.status_code}")
        
        if response.status_code == 200:
            data = response.json()
            print(f"  Match Percentage: {data['matchPercentage']}%")
            print(f"  ATS Score: {data['atsScore']}%")
            print(f"  Matched Skills: {len(data['matchedSkills'])}")
            print(f"  Missing Skills: {len(data['missingSkills'])}")
            print(f"  Model Type: {data.get('modelType', 'N/A')}")
        else:
            print(f"  Error: {response.json()}")
        
        return response.status_code == 200
    except Exception as e:
        print(f"✗ Analyze resume failed: {e}")
        return False

def main():
    print("=" * 60)
    print("XGBoost ML Service Test Suite")
    print("=" * 60)
    print()
    
    tests_passed = 0
    tests_total = 3
    
    # Run tests
    if test_health_check():
        tests_passed += 1
    
    if test_get_roles():
        tests_passed += 1
    
    if test_analyze_resume():
        tests_passed += 1
    
    # Summary
    print("\n" + "=" * 60)
    print(f"Tests Results: {tests_passed}/{tests_total} passed")
    print("=" * 60)
    
    if tests_passed == tests_total:
        print("✓ All tests passed! XGBoost service is working correctly.")
        return 0
    else:
        print("✗ Some tests failed. Please check the service setup.")
        return 1

if __name__ == "__main__":
    exit(main())
