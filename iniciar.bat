@echo off
cd /d %~dp0
start http://localhost:8000
python -c "import http.server as h; exec('class H(h.SimpleHTTPRequestHandler):\n def end_headers(s): s.send_header(\'Cache-Control\', \'no-cache\'); super().end_headers()'); h.ThreadingHTTPServer(('127.0.0.1', 8000), H).serve_forever()"
