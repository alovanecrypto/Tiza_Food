@echo off
setlocal
cd /d "%~dp0"
powershell.exe -NoProfile -ExecutionPolicy Bypass -File "%~dp0INICIAR-TIZA-FOOD.ps1"
if errorlevel 1 (
  echo.
  echo No se pudo iniciar Tiza Food. Lee el mensaje anterior.
  pause
)
endlocal
