@echo off
echo ========================================
echo JobQuest Development Environment Starter
echo ========================================
echo.

echo Checking for running services on ports...
FOR /F "tokens=5" %%P IN ('netstat -a -n -o ^| findstr :5000') DO (
  echo Stopping process with PID %%P using port 5000
  taskkill /F /PID %%P 2>nul
)

FOR /F "tokens=5" %%P IN ('netstat -a -n -o ^| findstr :5173') DO (
  echo Stopping process with PID %%P using port 5173
  taskkill /F /PID %%P 2>nul
)

echo.
echo Checking MongoDB connection...
cd backend
node -e "const mongoose = require('mongoose'); mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/JobQuest').then(() => { console.log('MongoDB connection successful'); process.exit(0); }).catch(err => { console.error('MongoDB connection failed:', err.message); process.exit(1); })"
if %errorlevel% neq 0 (
  echo [WARNING] MongoDB connection failed. Please make sure MongoDB is running.
  echo The application will start, but data won't be saved.
  echo.
  echo Do you want to continue anyway? (Y/N)
  set /p continue=
  if /i not "%continue%"=="Y" exit
)

echo.
echo Starting backend server...
start cmd /k "cd backend && npm run dev"
echo Waiting for backend to start...
timeout /t 5 > nul

echo.
echo Starting frontend development server...
start cmd /k "cd frontend && npm run dev"

echo.
echo ========================================
echo JobQuest is starting!
echo ========================================
echo.
echo * Backend API: http://localhost:5000
echo * Frontend: http://localhost:5173
echo.
echo If you experience connection issues:
echo - Try accessing the app in a different browser
echo - Clear your browser cache (Ctrl+Shift+Delete)
echo - Make sure MongoDB is running properly
echo.
echo To stop all services, close the command windows
echo ========================================
echo. 