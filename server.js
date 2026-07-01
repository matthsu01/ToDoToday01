const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 18800;
const DATA_FILE = path.join(__dirname, 'tasks.json');
const TITLE_FILE = path.join(__dirname, 'title.json');
const OPTIONS_FILE = path.join(__dirname, 'options.json');

// Initialize files
if (!fs.existsSync(DATA_FILE)) fs.writeFileSync(DATA_FILE, '[]');
if (!fs.existsSync(TITLE_FILE)) fs.writeFileSync(TITLE_FILE, JSON.stringify({ title: '📋 今日任務' }));
if (!fs.existsSync(OPTIONS_FILE)) fs.writeFileSync(OPTIONS_FILE, JSON.stringify({
  taskOptions: ['背單字','看課外書','念數學','練管樂'],
  ownerOptions: ['辰辰','小希','萌萌']
}));

const server = http.createServer((req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') { res.writeHead(204); res.end(); return; }

  const url = new URL(req.url, `http://localhost:${PORT}`);
  const route = url.pathname;

  // GET /api/tasks
  if (route === '/api/tasks' && req.method === 'GET') {
    const data = fs.readFileSync(DATA_FILE, 'utf8');
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(data);
    return;
  }

  // POST /api/tasks (replace all)
  if (route === '/api/tasks' && req.method === 'POST') {
    let body = '';
    req.on('data', c => body += c);
    req.on('end', () => {
      try {
        const parsed = JSON.parse(body);
        fs.writeFileSync(DATA_FILE, JSON.stringify(parsed));
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ ok: true }));
      } catch(e) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: e.message }));
      }
    });
    return;
  }

  // GET /api/title
  if (route === '/api/title' && req.method === 'GET') {
    const data = fs.readFileSync(TITLE_FILE, 'utf8');
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(data);
    return;
  }

  // POST /api/title
  if (route === '/api/title' && req.method === 'POST') {
    let body = '';
    req.on('data', c => body += c);
    req.on('end', () => {
      try {
        const parsed = JSON.parse(body);
        fs.writeFileSync(TITLE_FILE, JSON.stringify(parsed));
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ ok: true }));
      } catch(e) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: e.message }));
      }
    });
    return;
  }

  // GET /api/options
  if (route === '/api/options' && req.method === 'GET') {
    const data = fs.readFileSync(OPTIONS_FILE, 'utf8');
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(data);
    return;
  }

  // POST /api/options
  if (route === '/api/options' && req.method === 'POST') {
    let body = '';
    req.on('data', c => body += c);
    req.on('end', () => {
      try {
        const parsed = JSON.parse(body);
        fs.writeFileSync(OPTIONS_FILE, JSON.stringify(parsed));
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ ok: true }));
      } catch(e) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: e.message }));
      }
    });
    return;
  }

  res.writeHead(404);
  res.end('Not found');
});

server.listen(PORT, '0.0.0.0', () => {
  console.log(`Task API server running on port ${PORT}`);
});
