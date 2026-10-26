"""Server HTTP: file statis + POST /api/akun (disimpan ke data/akun.json). Jalankan: python server.py"""
import json, os, hashlib, secrets
from datetime import datetime
from http.server import SimpleHTTPRequestHandler, HTTPServer
FILE = os.path.join('data', 'akun.json')

class H(SimpleHTTPRequestHandler):
    def kirim(self, kode, obj):
        b = json.dumps(obj).encode(); self.send_response(kode)
        self.send_header('Content-Type', 'application/json'); self.send_header('Content-Length', str(len(b)))
        self.end_headers(); self.wfile.write(b)
    def do_POST(self):
        if self.path != '/api/akun': return self.send_error(404)
        try: d = json.loads(self.rfile.read(int(self.headers.get('Content-Length', 0))))
        except ValueError: return self.kirim(400, {'error': 'Data tidak valid'})
        if not all(d.get(k) for k in ('role', 'nama', 'username', 'password')) or d['role'] not in ('mahasiswa', 'adminlab'):
            return self.kirim(422, {'error': 'Data tidak lengkap'})
        os.makedirs('data', exist_ok=True)
        rows = json.load(open(FILE, encoding='utf-8')) if os.path.exists(FILE) else []
        if any(r['username'] == d['username'] for r in rows): return self.kirim(409, {'error': 'Username sudah dipakai'})
        salt = secrets.token_hex(8)
        d['password'] = salt + ':' + hashlib.sha256((salt + d['password']).encode()).hexdigest()  # hash+salt (bcrypt butuh library)
        d.update(id=len(rows) + 1, status_akun='aktif', gagal_login=0, dibuat=datetime.now().isoformat(timespec='seconds'))
        rows.append(d); json.dump(rows, open(FILE, 'w', encoding='utf-8'), ensure_ascii=False, indent=2)
        self.kirim(201, {'ok': True, 'id': d['id']})

if __name__ == '__main__':
    print('Buka http://127.0.0.1:8000'); HTTPServer(('', 8000), H).serve_forever()
