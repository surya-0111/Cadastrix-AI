"""
Cadastrix AI - WebGIS Local Live Server
Starts a local HTTP server and launches the WebGIS application in your default browser.
"""
import http.server
import socketserver
import webbrowser
import os

PORT = 8080
DIRECTORY = os.path.dirname(os.path.abspath(__file__))

class Handler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=DIRECTORY, **kwargs)

def run():
    with socketserver.TCPServer(("", PORT), Handler) as httpd:
        url = f"http://localhost:{PORT}/standalone.html"
        print(f"================================================================")
        print(f"   Cadastrix AI: Cadastral WebGIS Frontend (Member 5)")
        print(f"   Server active at: {url}")
        print(f"================================================================")
        print(f"Opening browser... Press Ctrl+C to stop.")
        webbrowser.open(url)
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\nServer stopped.")

if __name__ == "__main__":
    run()
