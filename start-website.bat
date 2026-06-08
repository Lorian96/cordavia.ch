@echo off
title VitaWay - Dev Server
cd /d "%~dp0"
echo Starting VitaWay website...
echo.
start "" http://localhost:3000
call "C:\Program Files\nodejs\npm.cmd" run dev
pause
