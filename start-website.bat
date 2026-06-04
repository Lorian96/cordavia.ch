@echo off
title Cordavia - Dev Server
cd /d "%~dp0"
echo Starting Cordavia website...
echo.
start "" http://localhost:3000
call "C:\Program Files\nodejs\npm.cmd" run dev
pause
