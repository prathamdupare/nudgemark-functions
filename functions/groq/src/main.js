import OpenAI from 'openai';
import { getStaticFile, throwIfMissing } from './utils.js';
import Groq from 'groq-sdk';

export default async ({ req, res }) => {
  throwIfMissing(process.env, ['GROQ_API_KEY']);

  if (req.method === 'GET') {
    return res.text(getStaticFile('index.html'), 200, {
      'Content-Type': 'text/html; charset=utf-8',
    });
  }

  try {
    throwIfMissing(req.body, ['prompt']);
  } catch (err) {
    return res.json({ ok: false, error: err.message }, 400);
  }

  const openai = new OpenAI();
  const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
  try {
    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: 'user',
          content: 'Explain the importance of fast language models',
        },
      ],
      model: 'llama-3.3-70b-versatile',
    });
    return res.json({ ok: true, completion }, 200);
  } catch (err) {
    return res.json({ ok: false, error: 'Failed to query model.' }, 500);
  }
};
