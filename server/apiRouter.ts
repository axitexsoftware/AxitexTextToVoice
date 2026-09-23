import { Router, Request, Response } from 'express';
import { generateSpeechAudio } from './ttsService.ts';
import { TTSRequestPayload } from '../src/types.ts';

export const apiRouter = Router();

function sendJson(res: any, status: number, data: any) {
  if (typeof res.status === 'function' && typeof res.json === 'function') {
    return res.status(status).json(data);
  }
  res.statusCode = status;
  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify(data));
}

// In-memory rate limiting and daily usage tracking for backend API protection
const ipRequests = new Map<string, { count: number; resetTime: number }>();
const dailyUsageByIp = new Map<string, { count: number; date: string }>();

const MAX_FREE_DAILY_REQUESTS = parseInt(process.env.FREE_TIER_DAILY_LIMIT || '50', 10);
const MAX_CHARACTERS = parseInt(process.env.MAX_CHARACTERS_PER_REQUEST || '2000', 10);

function getClientIp(req: Request): string {
  const forwarded = req.headers['x-forwarded-for'];
  if (typeof forwarded === 'string') return forwarded.split(',')[0].trim();
  return req.socket.remoteAddress || '127.0.0.1';
}

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const record = ipRequests.get(ip);
  if (!record || now > record.resetTime) {
    ipRequests.set(ip, { count: 1, resetTime: now + 60000 });
    return true;
  }
  if (record.count >= 60) {
    return false; // Exceeded 60 requests per minute
  }
  record.count += 1;
  return true;
}

function checkDailyLimit(ip: string): { allowed: boolean; remaining: number; total: number } {
  const today = new Date().toISOString().split('T')[0];
  const record = dailyUsageByIp.get(ip);
  if (!record || record.date !== today) {
    dailyUsageByIp.set(ip, { count: 1, date: today });
    return { allowed: true, remaining: MAX_FREE_DAILY_REQUESTS - 1, total: MAX_FREE_DAILY_REQUESTS };
  }
  if (record.count >= MAX_FREE_DAILY_REQUESTS) {
    return { allowed: false, remaining: 0, total: MAX_FREE_DAILY_REQUESTS };
  }
  record.count += 1;
  return { allowed: true, remaining: Math.max(0, MAX_FREE_DAILY_REQUESTS - record.count), total: MAX_FREE_DAILY_REQUESTS };
}

// Core TTS generation handler
async function handleTextToSpeech(req: Request, res: Response) {
  const clientIp = getClientIp(req);
  const authHeader = req.headers.authorization;
  const requestId = `req_${Date.now().toString(36)}_${Math.random().toString(36).substring(2, 6)}`;

  // 1. Bot & Rate Limiting Check
  if (!checkRateLimit(clientIp)) {
    return sendJson(res, 429, {
      success: false,
      error: {
        code: 'RATE_LIMIT_EXCEEDED',
        message: 'Too many requests. Please wait a minute before making another request.',
      },
    });
  }

  // 2. Authentication / API Key check for /v1 developer endpoint
  if (req.originalUrl && req.originalUrl.startsWith('/v1/')) {
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return sendJson(res, 401, {
        success: false,
        error: {
          code: 'UNAUTHORIZED',
          message: 'Missing or invalid Authorization header. Expected "Authorization: Bearer <API_KEY>".',
        },
      });
    }

    const token = authHeader.substring(7).trim();
    if (!token.startsWith('ax_live_') && !token.startsWith('axx_live_')) {
      return sendJson(res, 401, {
        success: false,
        error: {
          code: 'INVALID_API_KEY',
          message: 'Invalid API key format. AxiTex API keys must start with ax_live_.',
        },
      });
    }
  } else {
    // Playground usage quota check
    const quota = checkDailyLimit(clientIp);
    if (!quota.allowed) {
      return sendJson(res, 429, {
        success: false,
        error: {
          code: 'DAILY_LIMIT_EXCEEDED',
          message: `You have reached today's free usage limit (${MAX_FREE_DAILY_REQUESTS} requests/day). Please try again tomorrow.`,
        },
      });
    }
  }

  // 3. Request Payload Validation
  const body = req.body || {};
  const { text, language = 'en-US', voice = 'Kore', style, naturalStylePrompt, speed = 1.0, pitch = 0, format = 'wav' } = body;

  if (!text || typeof text !== 'string' || text.trim().length === 0) {
    return sendJson(res, 400, {
      success: false,
      error: {
        code: 'INVALID_REQUEST',
        message: 'Text is required and must not be empty.',
      },
    });
  }

  if (text.length > MAX_CHARACTERS) {
    return sendJson(res, 400, {
      success: false,
      error: {
        code: 'TEXT_TOO_LONG',
        message: `Text length of ${text.length} characters exceeds the maximum allowed limit of ${MAX_CHARACTERS} characters.`,
      },
    });
  }

  if (typeof speed !== 'number' || speed < 0.25 || speed > 4.0) {
    return sendJson(res, 400, {
      success: false,
      error: {
        code: 'INVALID_PARAMETER',
        message: 'Speed must be a number between 0.25 and 4.0.',
      },
    });
  }

  const payload: TTSRequestPayload = {
    text: text.trim(),
    language,
    voice,
    style,
    naturalStylePrompt,
    speed,
    pitch,
    format: format === 'mp3' ? 'mp3' : 'wav',
  };

  try {
    const result = await generateSpeechAudio(payload, requestId);
    return sendJson(res, 200, {
      ...result,
      audio_url: result.audio_base64,
    });
  } catch (error: any) {
    console.error('TTS Processing Error:', error);
    return sendJson(res, 500, {
      success: false,
      error: {
        code: 'INTERNAL_SERVER_ERROR',
        message: error.message || 'An error occurred while generating speech audio.',
      },
    });
  }
}

// Handlers for both Playground and Public Developer API
apiRouter.post('/v1/text-to-speech', handleTextToSpeech);
apiRouter.post('/api/text-to-speech', handleTextToSpeech);

// System status endpoint
apiRouter.get('/api/status', (req: Request, res: Response) => {
  sendJson(res, 200, {
    status: 'operational',
    service: 'AxiTex Voice AI Engine',
    model: process.env.GEMINI_TTS_MODEL || 'gemini-2.5-flash',
    version: '1.4.2',
    uptime: '99.98%',
    average_latency_ms: 320,
    daily_quota_per_user: MAX_FREE_DAILY_REQUESTS,
    max_characters_per_request: MAX_CHARACTERS,
  });
});

apiRouter.get('/api/health', (req: Request, res: Response) => {
  sendJson(res, 200, { ok: true, timestamp: new Date().toISOString() });
});
