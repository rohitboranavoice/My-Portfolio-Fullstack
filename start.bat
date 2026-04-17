@echo off
color 0A
title Rohit Borana Portfolio - Local Server Setup
echo ====================================================
echo Starting Rohit Borana Premium Website
echo ====================================================
echo.
echo Installing any missing packages just in case...
call npm install --silent
echo.
echo Starting the Next.js Live Server...
echo Please wait 5-10 seconds...
echo.
start cmd /c "timeout /t 6 /nobreak >nul && start http://localhost:3000"
call npm run dev
pause
