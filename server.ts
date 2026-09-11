import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { createPrototypeReply, healthResponse } from './chat-response';

const app = express();
const PORT = Number(process.env.PORT || 3000);

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') {
    res.sendStatus(204);
    return;
  }
  next();
});

app.use(express.json());

app.get('/api/health', (_req, res) => {
  res.json(healthResponse());
});

app.post('/api/chat', (req, res) => {
  const { message, characterId } = req.body ?? {};
  if (typeof message !== 'string' || !message.trim()) {
    res.status(400).json({ error: 'Message cannot be empty.' });
    return;
  }
  res.json({
    reply: createPrototypeReply(characterId, message),
    characterId: characterId || 'bestie',
    mode: 'prototype',
  });
});

async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Overthinking as a Service server running on http://localhost:${PORT}`);
  });
}

startServer();
