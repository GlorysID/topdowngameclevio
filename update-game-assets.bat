@echo off
echo ============================================
echo   Update Game Assets (base64 generator)
echo ============================================
echo.
echo Scanning assets/assetdesa folder...
echo.

python "%~dp0_generate_assets.py"

echo.
echo ============================================
echo   SELESAI! Refresh index.html di browser.
echo ============================================
pause
