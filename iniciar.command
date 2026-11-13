#!/bin/bash
# BioTrampa en Mac: doble clic para abrir la app en Chrome (o tu navegador) desde http://localhost:8000
# Para cerrarla, cierra esta ventana de Terminal.
cd "$(dirname "$0")" || exit 1
PUERTO=8000
echo "BioTrampa: abriendo http://localhost:$PUERTO ... (cierra esta ventana para detenerla)"
( sleep 1; if open -Ra "Google Chrome" 2>/dev/null; then open -a "Google Chrome" "http://localhost:$PUERTO"; elif open -Ra "Microsoft Edge" 2>/dev/null; then open -a "Microsoft Edge" "http://localhost:$PUERTO"; else open "http://localhost:$PUERTO"; fi ) &
# Solo esta Mac (127.0.0.1) y sin caché: Chrome siempre toma la versión nueva de la app
python3 -c 'import http.server as h, sys
class H(h.SimpleHTTPRequestHandler):
    def end_headers(s): s.send_header("Cache-Control", "no-cache"); super().end_headers()
h.ThreadingHTTPServer(("127.0.0.1", int(sys.argv[1])), H).serve_forever()' $PUERTO
