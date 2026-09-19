// Vercel Serverless Function: Send Email via Resend API
// Endpoint: POST /api/send-email or GET /api/send-email

const DEFAULT_RESEND_API_KEY = 're_Buuf9PGF_AbXoKs68mLpsbNEJQx8tQW7a';
const DEFAULT_SENDER_EMAIL = 'TechFix Peshawar <onboarding@resend.dev>';
const DEFAULT_TECHNICIAN_EMAIL = 'techfixpeshawar@gmail.com';
const TECHNICIAN_PHONE = '+92 327 5226107';
const TECHNICIAN_WHATSAPP_CLEAN = '923275226107';
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function getResendApiKey(): string {
  const envKey = process.env.RESEND_API_KEY?.trim();
  if (envKey) return envKey;
  return DEFAULT_RESEND_API_KEY;
}

function getSenderEmail(): string {
  const envSender = process.env.RESEND_FROM_EMAIL?.trim();
  if (envSender) return envSender;
  return DEFAULT_SENDER_EMAIL;
}

function getTechnicianEmail(): string {
  const envTech = process.env.TECHNICIAN_EMAIL?.trim();
  if (envTech) return envTech;
  return DEFAULT_TECHNICIAN_EMAIL;
}

function formatPKTDate(isoString?: string): string {
  try {
    const d = isoString ? new Date(isoString) : new Date();
    return (
      d.toLocaleString('en-US', {
        timeZone: 'Asia/Karachi',
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
      }) + ' (PKT)'
    );
  } catch {
    return isoString || new Date().toISOString();
  }
}

export function generateTrackingId(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let rand = '';
  for (let i = 0; i < 8; i++) {
    rand += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  const suffix = Math.floor(100 + Math.random() * 900);
  return `PSH-${rand}-${suffix}`;
}

async function callResendApi(payload: {
  from: string;
  to: string[];
  reply_to?: string;
  subject: string;
  html: string;
  text?: string;
}) {
  const apiKey = getResendApiKey();
  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  const data = await response.json().catch(() => ({}));
  return { ok: response.ok, status: response.status, data };
}

export default async function handler(req: any, res: any) {
  // CORS Headers for Vercel Serverless
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization'
  );

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const apiKey = getResendApiKey();
  const senderEmail = getSenderEmail();
  const technicianEmail = getTechnicianEmail();

  // GET: Health Check & Resend Environment Diagnostics
  if (req.method === 'GET') {
    const isCustomKey = !!process.env.RESEND_API_KEY?.trim();
    const maskedKey = apiKey
      ? `${apiKey.slice(0, 6)}...${apiKey.slice(-4)}`
      : 'Not configured';

    return res.status(200).json({
      status: 'ok',
      service: 'TechFix Peshawar Vercel Email Serverless Handler',
      environment: {
        hasResendKey: !!apiKey,
        keySource: isCustomKey ? 'Vercel Environment Variable (RESEND_API_KEY)' : 'Default Fallback Key',
        maskedKey,
        senderEmail,
        technicianEmail,
        isSandboxDomain: senderEmail.toLowerCase().includes('@resend.dev'),
      },
      instructions: 'Send a POST request with JSON body to send emails.',
    });
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
  }

  try {
    const body = req.body || {};
    const type = body.type || 'request_received';

    // 1. TEST EMAIL ACTION
    if (type === 'test') {
      const recipient = (body.to || technicianEmail).trim();
      const testHtml = `
        <div style="font-family: sans-serif; padding: 24px; background: #0b1329; color: #f8fafc; border-radius: 16px;">
          <h2 style="color: #60a5fa; margin-top: 0;">🚀 TechFix Peshawar • Vercel Resend Test</h2>
          <p>This email confirms that your Vercel Serverless Email Function is working properly with Resend!</p>
          <div style="background: #1e293b; padding: 14px; border-radius: 8px; margin: 16px 0; font-family: monospace; font-size: 13px;">
            <div>Sender: ${senderEmail}</div>
            <div>Recipient: ${recipient}</div>
            <div>Sent At: ${formatPKTDate()}</div>
          </div>
          <p style="color: #94a3b8; font-size: 12px;">Peshawar On-Site Computer Support System</p>
        </div>
      `;

      const result = await callResendApi({
        from: senderEmail,
        to: [recipient],
        reply_to: recipient,
        subject: `✓ Vercel Resend Test: TechFix Peshawar (${new Date().toLocaleTimeString()})`,
        html: testHtml,
        text: 'TechFix Peshawar Vercel Resend Test Email Succeeded.',
      });

      if (!result.ok) {
        return res.status(result.status || 500).json({
          success: false,
          error: result.data?.message || 'Resend API rejected the email',
          details: result.data,
        });
      }

      return res.status(200).json({
        success: true,
        id: result.data.id,
        deliveredTo: recipient,
        message: `Test email sent successfully via Vercel to ${recipient}`,
      });
    }

    // 2. CUSTOM EMAIL ACTION
    if (type === 'custom') {
      const { to, subject, html, text, replyTo } = body;
      if (!to || !subject || !html) {
        return res.status(400).json({ error: 'Missing required parameters: to, subject, and html' });
      }

      const recipients = (Array.isArray(to) ? to : [to])
        .map((r: string) => (typeof r === 'string' ? r.trim() : ''))
        .filter((r: string) => EMAIL_REGEX.test(r));

      if (recipients.length === 0) {
        return res.status(400).json({ error: 'No valid recipient email address provided' });
      }

      const result = await callResendApi({
        from: senderEmail,
        to: recipients,
        reply_to: replyTo || technicianEmail,
        subject,
        html,
        text,
      });

      if (!result.ok) {
        return res.status(result.status || 500).json({
          success: false,
          error: result.data?.message || 'Failed to send custom email',
          details: result.data,
        });
      }

      return res.status(200).json({
        success: true,
        id: result.data.id,
        deliveredTo: recipients.join(', '),
      });
    }

    // 3. SERVICE REQUEST RECEIVED (Default)
    const customerName = body.customerName || 'Valued Customer';
    const customerEmail = body.email || body.customerEmail || '';
    const phone = body.phone || body.contactNumber || 'Not provided';
    const whatsapp = body.whatsapp || phone;
    const requestedService = body.requestedService || body.service || 'On-Site Windows / Computer Support';
    const area = body.area || body.addressArea || 'Peshawar';
    const deviceType = body.deviceType || body.device || 'PC / Laptop';
    const problemDescription = body.problemDescription || body.problem || 'Hardware/OS diagnosis required';
    const preferredDate = body.preferredDate || body.date || 'Earliest available';
    const preferredTime = body.preferredTime || body.time || '10:00 AM - 1:00 PM';
    const trackingId = body.trackingId || generateTrackingId();
    const importantData = body.importantData ? 'YES (Files must be carefully preserved)' : 'Standard';

    const isSandbox = senderEmail.toLowerCase().includes('@resend.dev');

    // Email HTML Template
    const emailHtml = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Service Request Received</title>
</head>
<body style="margin: 0; padding: 20px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #070c16; color: #f1f5f9;">
  <div style="max-width: 620px; margin: 0 auto; background-color: #0d1527; border: 1px solid #1e293b; border-radius: 20px; overflow: hidden; box-shadow: 0 20px 40px rgba(0,0,0,0.5);">
    
    <!-- Top Header Banner -->
    <div style="background: linear-gradient(135deg, #1d4ed8, #2563eb); padding: 28px 24px; text-align: center; border-bottom: 2px solid #3b82f6;">
      <div style="display: inline-block; background-color: #10b981; color: #ffffff; padding: 5px 14px; border-radius: 9999px; font-size: 11px; font-weight: 800; letter-spacing: 0.8px; text-transform: uppercase; margin-bottom: 12px;">
        ✓ REQUEST RECEIVED &amp; LOGGED
      </div>
      <h1 style="color: #ffffff; margin: 0 0 6px 0; font-size: 24px; font-weight: 800; letter-spacing: -0.5px;">
        TechFix Peshawar • Service Request
      </h1>
      <p style="color: #bfdbfe; margin: 0; font-size: 14px; font-weight: 500;">
        Fast On-Site Computer &amp; Windows Support in Peshawar
      </p>
    </div>

    <!-- Main Content -->
    <div style="padding: 30px 24px;">
      
      <!-- Tracking Reference Card -->
      <div style="background-color: #111e38; border: 2px dashed #3b82f6; border-radius: 14px; padding: 18px; text-align: center; margin-bottom: 26px;">
        <div style="font-size: 11px; text-transform: uppercase; color: #93c5fd; font-weight: 700; letter-spacing: 1px; margin-bottom: 4px;">
          Your Service Tracking ID
        </div>
        <div style="font-size: 28px; font-weight: 900; color: #60a5fa; font-family: monospace; letter-spacing: 2px;">
          ${trackingId}
        </div>
        <div style="font-size: 12px; color: #94a3b8; margin-top: 6px;">
          Keep this code to track on-site technician progress anytime.
        </div>
      </div>

      <p style="font-size: 15px; line-height: 1.6; color: #e2e8f0; margin: 0 0 20px 0;">
        Hello <strong>${customerName}</strong>,<br>
        Your computer support request has been recorded. Technician Safiullah will review your problem and call or WhatsApp you directly to confirm the visit time.
      </p>

      <!-- Details Table -->
      <table style="width: 100%; border-collapse: collapse; margin-bottom: 24px; font-size: 13px;">
        <tr style="border-bottom: 1px solid #1e293b;">
          <td style="padding: 10px 0; color: #94a3b8; width: 38%;">Service Requested</td>
          <td style="padding: 10px 0; color: #f8fafc; font-weight: 700;">${requestedService}</td>
        </tr>
        <tr style="border-bottom: 1px solid #1e293b;">
          <td style="padding: 10px 0; color: #94a3b8;">Device</td>
          <td style="padding: 10px 0; color: #f8fafc; font-weight: 600;">${deviceType}</td>
        </tr>
        <tr style="border-bottom: 1px solid #1e293b;">
          <td style="padding: 10px 0; color: #94a3b8;">Area / Locality</td>
          <td style="padding: 10px 0; color: #60a5fa; font-weight: 700;">${area}</td>
        </tr>
        <tr style="border-bottom: 1px solid #1e293b;">
          <td style="padding: 10px 0; color: #94a3b8;">Preferred Date &amp; Time</td>
          <td style="padding: 10px 0; color: #f8fafc; font-weight: 600;">${preferredDate} (${preferredTime})</td>
        </tr>
        <tr style="border-bottom: 1px solid #1e293b;">
          <td style="padding: 10px 0; color: #94a3b8;">Phone / WhatsApp</td>
          <td style="padding: 10px 0; color: #f8fafc; font-weight: 600;">${phone}</td>
        </tr>
        <tr style="border-bottom: 1px solid #1e293b;">
          <td style="padding: 10px 0; color: #94a3b8;">Important Data</td>
          <td style="padding: 10px 0; color: #34d399; font-weight: 700;">${importantData}</td>
        </tr>
      </table>

      <!-- Problem Box -->
      <div style="background-color: #1e293b; border-left: 4px solid #3b82f6; padding: 14px 18px; border-radius: 8px; margin-bottom: 24px;">
        <div style="font-size: 11px; text-transform: uppercase; color: #94a3b8; font-weight: 700; margin-bottom: 4px;">
          Problem Reported
        </div>
        <div style="font-size: 13px; color: #f1f5f9; line-height: 1.5;">
          ${problemDescription}
        </div>
      </div>

      <!-- Quick Action Buttons -->
      <div style="text-align: center; margin: 26px 0;">
        <a href="https://wa.me/${TECHNICIAN_WHATSAPP_CLEAN}?text=Hello%20Safiullah,%20I%20submitted%20request%20${trackingId}" 
           style="display: inline-block; background-color: #25d366; color: #ffffff; text-decoration: none; padding: 12px 24px; border-radius: 12px; font-weight: 700; font-size: 13px; margin: 4px;">
          💬 Chat on WhatsApp (+92 327 5226107)
        </a>
      </div>

      <!-- Footer Info -->
      <div style="border-top: 1px solid #1e293b; padding-top: 16px; font-size: 11px; color: #64748b; line-height: 1.5; text-align: center;">
        TechFix Peshawar • Safiullah (Computer Science &amp; Cybersecurity, Univ. of Agriculture, Peshawar)<br>
        On-Site Computer &amp; Windows Services across Hayatabad, University Town, Cantt, Saddar, Warsak Rd &amp; Peshawar City.
      </div>

    </div>
  </div>
</body>
</html>
    `;

    // Resend Sandbox check:
    // If sender is onboarding@resend.dev, external recipients cause validation_error.
    // We send to technician email and include customer reply-to so Safiullah gets it directly!
    let recipientsToSend: string[] = [];
    if (customerEmail && EMAIL_REGEX.test(customerEmail)) {
      recipientsToSend.push(customerEmail);
    }
    // Always include technician
    if (!recipientsToSend.includes(technicianEmail)) {
      recipientsToSend.push(technicianEmail);
    }

    let finalRecipients = recipientsToSend;
    let isSandboxRerouted = false;

    if (isSandbox) {
      // In sandbox mode, only the verified account email can receive emails
      finalRecipients = [technicianEmail];
      isSandboxRerouted = true;
    }

    const emailSubject = `✓ Service Request Logged: [${trackingId}] — ${customerName} (${area})`;

    const emailResult = await callResendApi({
      from: senderEmail,
      to: finalRecipients,
      reply_to: customerEmail || technicianEmail,
      subject: emailSubject,
      html: emailHtml,
      text: `TechFix Peshawar Request ${trackingId}: ${customerName} requested ${requestedService} in ${area}. Contact: ${phone}`,
    });

    if (!emailResult.ok) {
      console.error('Vercel Resend Error:', emailResult.data);
      return res.status(200).json({
        success: true,
        emailSent: false,
        trackingId,
        error: emailResult.data?.message || 'Email delivery failed on Resend',
        details: emailResult.data,
      });
    }

    return res.status(200).json({
      success: true,
      emailSent: true,
      trackingId,
      id: emailResult.data.id,
      deliveredTo: finalRecipients.join(', '),
      isSandboxRerouted,
      message: isSandboxRerouted
        ? `Delivered to verified inbox ${technicianEmail} (Resend sandbox copy for customer ${customerEmail})`
        : `Email sent to ${finalRecipients.join(', ')}`,
    });
  } catch (err: any) {
    console.error('Unhandled Vercel serverless error:', err);
    return res.status(500).json({
      success: false,
      error: err.message || 'Internal server error in email serverless handler',
    });
  }
}
