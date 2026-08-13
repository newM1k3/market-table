import type { Handler } from '@netlify/functions';

// SMS Auth handler using Twilio
// In production, TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, and TWILIO_PHONE_NUMBER
// are set as environment variables in the Netlify dashboard.

const CODES = new Map<string, { code: string; expires: number }>();

function generateCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

function cleanPhone(phone: string): string {
  return phone.replace(/\D/g, '');
}

export const handler: Handler = async (event) => {
  // CORS headers
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 204, headers, body: '' };
  }

  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, headers, body: 'Method not allowed' };
  }

  try {
    const { phone, action, code } = JSON.parse(event.body || '{}') as {
      phone?: string;
      action?: 'request' | 'verify';
      code?: string;
    };

    if (!phone || !action) {
      return { statusCode: 400, headers, body: JSON.stringify({ error: 'Missing phone or action' }) };
    }

    const cleaned = cleanPhone(phone);

    if (action === 'request') {
      const verificationCode = generateCode();
      CODES.set(cleaned, {
        code: verificationCode,
        expires: Date.now() + 10 * 60 * 1000, // 10 minutes
      });

      // In production: send SMS via Twilio
      // await twilioClient.messages.create({
      //   body: `Market Table: Your verification code is ${verificationCode}`,
      //   to: `+1${cleaned}`,
      //   from: process.env.TWILIO_PHONE_NUMBER,
      // });

      console.log(`[SMS-AUTH] Code for ${cleaned}: ${verificationCode}`);

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ success: true }),
      };
    }

    if (action === 'verify') {
      const record = CODES.get(cleaned);

      if (!record) {
        return { statusCode: 400, headers, body: JSON.stringify({ error: 'No code requested' }) };
      }

      if (Date.now() > record.expires) {
        CODES.delete(cleaned);
        return { statusCode: 400, headers, body: JSON.stringify({ error: 'Code expired' }) };
      }

      if (record.code !== code) {
        return { statusCode: 400, headers, body: JSON.stringify({ error: 'Invalid code' }) };
      }

      CODES.delete(cleaned);

      // In production: generate a real PocketBase auth token
      // For now, return a demo token
      const token = 'demo-token';

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ success: true, token }),
      };
    }

    return { statusCode: 400, headers, body: JSON.stringify({ error: 'Invalid action' }) };
  } catch (e) {
    console.error('[SMS-AUTH] Error:', e);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Internal server error' }),
    };
  }
};
