@echo off
setlocal
set "PATH=%LOCALAPPDATA%\Programs\Git\cmd;%PATH%"

echo ============================================================
echo   BhuvixTechnology - 1-Click Update to GitHub
echo ============================================================
echo.

:: Stage all modified, new, or deleted files
echo [1/3] Staging changes...
git add .

:: Ask user for an optional commit note, or default
set /p "COMMIT_MSG=Enter a short description of changes (or press Enter for default): "
if "%COMMIT_MSG%"=="" set "COMMIT_MSG=Update website"

:: Commit the staged files
echo.
echo [2/3] Committing changes (%COMMIT_MSG%)...
git commit -m "%COMMIT_MSG%"

:: Push directly to GitHub
echo.
echo [3/3] Uploading to GitHub...
git push origin main

echo.
echo ============================================================
echo   Success! Your website will update in 1-2 minutes at:
echo   https://hash-amit.github.io/BhuvixTechnology/
echo ============================================================
pause
