@echo off
title LocalAid Nepal Launcher
color 0B

echo ===================================================
echo     Starting LocalAid Nepal
echo     Coordinated Social Support Services
echo ===================================================
echo.

echo [1/3] Starting the Node.js Backend Server...
start "LocalAid Backend" cmd /k "cd backend && npm run dev"

echo [2/3] Starting the React Frontend Server...
start "LocalAid Frontend" cmd /k "cd frontend && npm run dev"

echo[3/3] Waiting for servers to initialize...
:: Wait for 5 seconds to give Vite and Nodemon time to start
timeout /t 5 /nobreak > NUL

echo.
echo Opening LocalAid in your default browser...
start http://localhost:5173

echo.
echo ===================================================
echo LocalAid is now running!
echo. 
echo Note: Two background terminal windows are now open.
echo To stop the application, simply close those windows.
echo ===================================================
echo.
pause