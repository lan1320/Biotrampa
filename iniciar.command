#!/bin/bash
# BioTrampa en Mac: doble clic para abrir la app en Chrome (o tu navegador) desde http://localhost:8000
# Para cerrarla, cierra esta ventana de Terminal.
cd "$(dirname "$0")" || exit 1
PUERTO=8000
URL="http://localhost:$PUERTO"
abrir() { if open -Ra "Google Chrome" 2>/dev/null; then open -a "Google Chrome" "$URL"; elif open -Ra "Microsoft Edge" 2>/dev/null; then open -a "Microsoft Edge" "$URL"; else open "$URL"; fi; }
# 1.4.38: si BioTrampa ya está abierta en otra ventana de Terminal, solo se abre el navegador
if curl -s -o /dev/null "$URL"; then echo "BioTrampa ya estaba abierta: $URL"; abrir; exit 0; fi
# 1.4.38: sin Python 3 no hay servidor; se explica qué hacer en vez de fallar en silencio
if ! python3 -c 'import sys' 2>/dev/null; then
  echo "BioTrampa necesita Python 3 para abrirse en el navegador."
  echo "Si la Mac te ofrece instalar las «herramientas de línea de comandos», acepta y vuelve a abrir este archivo."
  echo "También puedes instalar Python desde https://www.python.org/downloads/"
  read -r -p "Pulsa Enter para cerrar…"; exit 1
fi
echo "BioTrampa: abriendo $URL ... (cierra esta ventana para detenerla)"
# 1.4.38: el navegador se abre cuando el servidor ya responde (antes, a ciegas tras 1 s)
( for _ in $(seq 40); do curl -s -o /dev/null "$URL" && break; sleep 0.25; done; abrir ) &
# Solo esta Mac (127.0.0.1) y sin caché: Chrome siempre toma la versión nueva de la app
python3 -c 'import http.server as h, sys
class H(h.SimpleHTTPRequestHandler):
    def end_headers(s): s.send_header("Cache-Control", "no-cache"); super().end_headers()
h.ThreadingHTTPServer(("127.0.0.1", int(sys.argv[1])), H).serve_forever()' $PUERTO
