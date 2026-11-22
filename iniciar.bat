@echo off
rem BioTrampa en Windows: doble clic para abrir la app en el navegador desde http://localhost:8000
rem Para cerrarla, cierra esta ventana.
cd /d %~dp0
set URL=http://localhost:8000
rem 1.4.38: busca Python 3 ("py" del instalador de python.org o "python"); el "python" de la Microsoft Store sin instalar falla aqui
set PY=
py -3 -c "import sys" >nul 2>&1 && set PY=py -3
if not defined PY (python -c "import sys" >nul 2>&1 && set PY=python)
if not defined PY goto sinpython
rem 1.4.38: el navegador se abre cuando el servidor ya responde (antes se abria antes de tiempo y salia "No se puede acceder")
start "" /b powershell -NoProfile -Command "for($i=0;$i -lt 60;$i++){try{(New-Object Net.WebClient).DownloadString('%URL%')|Out-Null;break}catch{Start-Sleep -Milliseconds 250}}; Start-Process '%URL%'"
echo BioTrampa: abriendo %URL% ... cierra esta ventana para detenerla
%PY% -c "import http.server as h; exec('class H(h.SimpleHTTPRequestHandler):\n def end_headers(s): s.send_header(\'Cache-Control\', \'no-cache\'); super().end_headers()'); h.ThreadingHTTPServer(('127.0.0.1', 8000), H).serve_forever()"
echo.
echo No se pudo iniciar el servidor. Si BioTrampa ya esta abierta en otra ventana, usa esa.
pause
exit /b 1
:sinpython
echo BioTrampa necesita Python 3 para abrirse en el navegador.
echo Instalalo desde https://www.python.org/downloads/ y marca la casilla "Add python.exe to PATH".
echo Despues vuelve a abrir este archivo.
pause
exit /b 1
