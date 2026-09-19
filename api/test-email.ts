// Vercel Serverless Function: Test Resend Email & Environment Configuration
// Endpoint: GET or POST /api/test-email

const DEFAULT_RESEND_API_KEY = 're_Buuf9PGF_AbXoKs68mLpsbNEJQx8tQW7a';
const DEFAULT_SENDER_EMAIL = 'TechFix Peshawar <onboarding@resend.dev>';
const DEFAULT_TECHNICIAN_EMAIL = 'techfixpeshawar@gmail.com';

export default async function handler(req: any, res: any) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const apiKey = process.env.RESEND_API_KEY?.trim() || DEFAULT_RESEND_API_KEY;
  const senderEmail = process.env.RESEND_FROM_EMAIL?.trim() || DEFAULT_SENDER_EMAIL;
  const technicianEmail = process.env.TECHNICIAN_EMAIL?.trim() || DEFAULT_TECHNICIAN_EMAIL;
  const targetEmail = (req.query?.to || req.body?.to || technicianEmail).trim();

  if (!apiKey) {
    return res.status(500).json({
      success: false,
      error: 'RESEND_API_KEY is not defined in Vercel environment variables or defaults.',
    });
  }

  try {
    const isCustomKey = !!process.env.RESEND_API_KEY?.trim();
    const maskedKey = `${apiKey.slice(0, 6)}...${apiKey.slice(-4)}`;

    const testHtml = `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; padding: 24px; background-color: #0b1329; color: #f8fafc; border-radius: 16px; border: 1px solid #1e293b; max-width: 600px; margin: 0 auto;">
        <div style="display: inline-block; background-color: #10b981; color: #ffffff; padding: 4px 12px; border-radius: 9999px; font-size: 11px; font-weight: 800; text-transform: uppercase; margin-bottom: 12px;">
          ✓ VERCEL SERVERLESS VERIFIED
        </div>
        <h2 style="color: #60a5fa; margin: 0 0 8px 0; font-size: 22px;">TechFix Peshawar • Resend Test</h2>
        <p style="font-size: 14px; color: #cbd5e1; line-height: 1.6;">
          Your Vercel serverless function successfully communicated with the Resend API and sent this test email!
        </p>
        <div style="background-color: #1e293b; padding: 14px 18px; border-radius: 8px; margin: 18px 0; font-family: monospace; font-size: 13px; color: #93c5fd; line-height: 1.6;">
          <div>Key Source: <strong>${isCustomKey ? 'Vercel Environment Variable (RESEND_API_KEY)' : 'Built-in Project Fallback'}</strong></div>
          <div>Masked Key: <strong>${maskedKey}</strong></div>
          <div>Sender: <strong>${senderEmail}</strong></div>
          <div>Recipient: <strong>${targetEmail}</strong></div>
          <div>Timestamp: <strong>${new Date().toISOString()}</strong></div>
        </div>
        <p style="font-size: 12px; color: #94a3b8; margin: 0;">
          TechFix Peshawar • On-Site Computer &amp; Windows Support System
        </p>
      </div>
    `;

    const resendResponse = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: senderEmail,
        to: [targetEmail],
        reply_to: targetEmail,
        subject: `✓ TechFix Peshawar: Vercel Resend Verified (${new Date().toLocaleTimeString()})`,
        html: testHtml,
        text: `TechFix Peshawar Vercel test email successful at ${new Date().toISOString()}`,
      }),
    });

    const data = await resendResponse.json().catch(() => ({}));

    if (!resendResponse.ok) {
      return res.status(resendResponse.status || 500).json({
        success: false,
        error: data.message || 'Resend rejected the test email',
        details: data,
        environment: {
          keySource: isCustomKey ? 'Vercel Environment Variable' : 'Default Fallback',
          maskedKey,
          senderEmail,
        },
      });
    }

    return res.status(200).json({
      success: true,
      id: data.id,
      deliveredTo: targetEmail,
      message: `Test email successfully sent to ${targetEmail} via Vercel serverless function!`,
      environment: {
        keySource: isCustomKey ? 'Vercel Environment Variable' : 'Default Fallback',
        maskedKey,
        senderEmail,
      },
    });
  } catch (err: any) {
    return res.status(500).json({
      success: false,
      error: err.message || 'Failed to send test email',
    });
  }
}
