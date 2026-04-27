@echo off
echo Installing and starting Backend...
start cmd /k "cd backend && npm install && npm run dev"

echo Installing and starting Frontend on Network (Host)...
start cmd /k "cd frontend && npm install && npm run dev -- --host"

echo ====================================================
echo Starting your Black Box Dashboard.
echo Two terminal windows should have opened.
echo You can access the dashboard on your Local PC at:
echo http://localhost:5173
echo.
echo Check the Frontend terminal window for your "Network" 
echo IP Address to view it on your phone or tablet!
echo ====================================================
pause
