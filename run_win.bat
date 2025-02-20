@echo off
setlocal enabledelayedexpansion

:: Load environment variables from .env
for /f "delims=" %%x in (.env) do (
    set "line=%%x"
    for /f "tokens=1,2 delims==" %%a in ("!line!") do (
        set "%%a=%%b"
    )
)

:: Step 1: Build the Docker image
echo 🚀 Building the Docker image...
call make build-prod .

:: Step 2: Run the container
echo 🔄 Starting the container...
start /b make run

:: Step 3: Wait for the app to be available
echo ⏳ Waiting for the app to start...
set /a RETRIES=10
:loop
    curl -s http://localhost:%VITE_PORT% >nul 2>nul
    if %ERRORLEVEL% == 0 goto open_browser
    set /a RETRIES-=1
    if %RETRIES% == 0 (
        echo ❌ App failed to start.
        exit /b 1
    )
    timeout /t 3 >nul
    goto loop

:: Step 4: Open the UI in the browser
:open_browser
echo 🌍 Opening UI in browser...
start http://localhost:%VITE_PORT%

echo ✅ App is running at http://localhost:%VITE_PORT%
exit /b 0
