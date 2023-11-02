import http.server
import socketserver
import socket
import webbrowser

PORT = 8000

Handler = http.server.SimpleHTTPRequestHandler

while True:
    try:
        with socketserver.TCPServer(("", PORT), Handler) as httpd:
            httpd.socket.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
            print(f"localhost:{PORT}")
            #webbrowser.open(f'http://localhost:{PORT}')
            httpd.serve_forever()
    except OSError as e:
        if e.errno == socket.errno.EADDRINUSE:
            print(f"Port {PORT} is already in use. Trying the next available port.")
            PORT += 1
        else:
            raise

