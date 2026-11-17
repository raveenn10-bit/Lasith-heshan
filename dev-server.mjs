import http from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { extname, join, normalize } from 'node:path';
const args = process.argv.slice(2);
const value = flag => args[args.indexOf(flag) + 1];
const port = Number(value('--port') || 4173);
const host = value('--host') || '127.0.0.1';
const types = {'.html':'text/html; charset=utf-8','.css':'text/css','.js':'text/javascript','.mjs':'text/javascript','.svg':'image/svg+xml','.webp':'image/webp','.jpg':'image/jpeg','.xml':'application/xml','.txt':'text/plain'};
http.createServer(async (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);
  let path = normalize(decodeURIComponent(url.pathname)).replace(/^(\.\.[/\\])+/, '');
  if (path === '/') path = '/index.html';
  try {
    const file = join(process.cwd(), path);
    const info = await stat(file);
    const data = await readFile(info.isDirectory() ? join(file, 'index.html') : file);
    res.writeHead(200, {'content-type': types[extname(file)] || 'application/octet-stream', 'cache-control':'no-store'}); res.end(data);
  } catch { res.writeHead(404); res.end('Not found'); }
}).listen(port, host, () => console.log(`Local preview: http://${host}:${port}`));
