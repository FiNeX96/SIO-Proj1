import http.server
import socketserver
import socket
import webbrowser

PORT = 9000

class CORSRequestHandler(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header("Access-Control-Allow-Origin", "self")
        self.send_header("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "Content-Type" "Authorization")
        self.send_header("Cache-Control", "no-store")
        self.send_header(
            "Content-Security-Policy",
            "default-src 'none';"
            "script-src 'self' cdn.jsdelivr.net code.jquery.com stackpath.bootstrapcdn.com 'nonce-filter-nonce' 'nonce-searchnonce' 'nonce-getcartnonce' 'nonce-userdetailnonce' 'nonce-checkoutdatanonce' 'nonce-detailinfononce' 'nonce-userloggednonce' 'nonce-loginuserlogged' 'nonce-registeruserlogged';"
            "connect-src 'self' http://localhost:5000 "
            "img-src 'self' data:;"
            "style-src 'self' cdn.jsdelivr.net 'unsafe-inline' https://fonts.googleapis.com https://fonts.gstatic.com https://cdnjs.cloudflare.com;"
            "font-src 'self' cdn.jsdelivr.net fonts.gstatic.com fonts.googleapis.com cdnjs.cloudflare.com;",
        )

        super().end_headers()

    def do_OPTIONS(self):
        self.send_response(200, "ok")
        self.end_headers()


Handler = CORSRequestHandler

while True:
    try:
        with socketserver.TCPServer(("", PORT), Handler) as httpd:
            httpd.socket.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
            print(f"localhost:{PORT}")
            webbrowser.open(f"http://localhost:{PORT}")
            httpd.serve_forever()
    except OSError as e:
        if e.errno == socket.errno.EADDRINUSE:
            print(f"Port {PORT} is already in use. Trying the next available port.")
            PORT += 1
        else:
            raise
