@echo off
echo ============================================
echo Starting XGBoost ML Service
echo ============================================
echo.

REM Check if virtual environment exists
if not exist "venv\Scripts\activate.bat" (
    echo [ERROR] Virtual environment not found
    echo Please run setup.bat first
    pause
    exit /b 1
)

REM Activate virtual environment
call venv\Scripts\activate.bat

REM Check if models exist
if not exist "models\match_model.pkl" (
    echo [ERROR] Models not found
    echo Please run setup.bat to train models
    pause
    exit /b 1
)

echo Starting Flask API server...
echo API will be available at: http://localhost:5000
echo.
echo Press Ctrl+C to stop the server
echo.

python app.py
