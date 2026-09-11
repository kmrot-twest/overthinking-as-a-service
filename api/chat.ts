import { createPrototypeReply } from '../chat-response';

export default function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed.' });
  }
  const { message, characterId } = req.body ?? {};
  if (typeof message !== 'string' || !message.trim()) {
    return res.status(400).json({ error: 'Message cannot be empty.' });
  }
  return res.status(200).json({
    reply: createPrototypeReply(characterId, message),
    characterId: characterId || 'bestie',
    mode: 'prototype',
  });
}