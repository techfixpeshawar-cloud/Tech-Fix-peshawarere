// Vercel Serverless Function: Public Service Request Submission & Email Notification
// Endpoint: POST /api/requests

const DEFAULT_RESEND_API_KEY = 're_Buuf9PGF_AbXoKs68mLpsbNEJQx8tQW7a';
const DEFAULT_SENDER_EMAIL = 'TechFix Peshawar <onboarding@resend.dev>';
const DEFAULT_TECHNICIAN_EMAIL = 'techfixpeshawar@gmail.com';
const TECHNICIAN_PHONE = '+92 327 5226107';
const TECHNICIAN_WHATSAPP_CLEAN = '923275226107';
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function getResendApiKey(): string {
  return process.env.RESEND_API_KEY?.trim() || DEFAULT_RESEND_API_KEY;
}

function getSenderEmail(): string {
  return process.env.RESEND_FROM_EMAIL?.trim() || DEFAULT_SENDER_EMAIL;
}

function getTechnicianEmail(): string {
  return process.env.TECHNICIAN_EMAIL?.trim() || DEFAULT_TECHNICIAN_EMAIL;
}

function generateTrackingId(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let rand = '';
  for (let i = 0; i < 8; i++) {
    rand += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  const suffix = Math.floor(100 + Math.random() * 900);
  return `PSH-${rand}-${suffix}`;
}

export default async function handler(req: any, res: any) {
  // CORS Headers
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

  if (req.method === 'GET') {
    return res.status(200).json({
      status: 'ok',
      service: 'TechFix Peshawar Service Request Endpoint',
      note: 'Submit requests via POST'
    });
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
  }

  try {
    const {
      customerName,
      email,
      phone,
      whatsapp,
      area,
      deviceType,
      computerBrandModel,
      operatingSystem,
      requestedService,
      problemDescription,
      importantData,
      preferredDate,
      preferredTime,
      urgency,
    } = req.body || {};

    if (!customerName || !email || !phone || !problemDescription) {
      return res.status(400).json({
        error: 'Full name, email address, phone number, and problem description are required'
      });
    }

    const trackingId = generateTrackingId();
    const requestId = 'req-' + Date.now();
    const createdAt = new Date().toISOString();

    const newRequest = {
      id: requestId,
      trackingId,
      customerName: customerName.trim(),
      email: email.trim(),
      phone: phone.trim(),
      whatsapp: (whatsapp || phone).trim(),
      area: (area || 'Peshawar').trim(),
      deviceType: deviceType || 'PC / Laptop',
      computerBrandModel: computerBrandModel || 'Not specified',
      operatingSystem: operatingSystem || 'Windows 10/11',
      requestedService: requestedService || 'Windows & Computer Support',
      problemDescription: problemDescription.trim(),
      importantData: !!importantData,
      preferredDate: preferredDate || new Date().toISOString().split('T')[0],
      preferredTime: preferredTime || '10:00 AM - 1:00 PM',
      urgency: urgency || 'normal',
      status: 'new',
      emailSent: false,
      createdAt,
      updatedAt: createdAt,
    };

    // Trigger Resend email directly via serverless function
    const apiKey = getResendApiKey();
    const senderEmail = getSenderEmail();
    const technicianEmail = getTechnicianEmail();
    const isSandbox = senderEmail.toLowerCase().includes('@resend.dev');

    const emailSubject = `✓ Service Request Logged: [${trackingId}] — ${newRequest.customerName} (${newRequest.area})`;

    const emailHtml = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Service Request Received</title>
</head>
<body style="margin: 0; padding: 20px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #070c16; color: #f1f5f9;">
  <div style="max-width: 620px; margin: 0 auto; background-color: #0d1527; border: 1px solid #1e293b; border-radius: 20px; overflow: hidden; box-shadow: 0 20px 40px rgba(0,0,0,0.5);">
    
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

    <div style="padding: 30px 24px;">
      
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
        Hello <strong>${newRequest.customerName}</strong>,<br>
        Your computer support request has been recorded. Technician Safiullah will review your problem and call or WhatsApp you directly to confirm the visit time.
      </p>

      <table style="width: 100%; border-collapse: collapse; margin-bottom: 24px; font-size: 13px;">
        <tr style="border-bottom: 1px solid #1e293b;">
          <td style="padding: 10px 0; color: #94a3b8; width: 38%;">Service Requested</td>
          <td style="padding: 10px 0; color: #f8fafc; font-weight: 700;">${newRequest.requestedService}</td>
        </tr>
        <tr style="border-bottom: 1px solid #1e293b;">
          <td style="padding: 10px 0; color: #94a3b8;">Device &amp; OS</td>
          <td style="padding: 10px 0; color: #f8fafc; font-weight: 600;">${newRequest.deviceType} (${newRequest.operatingSystem})</td>
        </tr>
        <tr style="border-bottom: 1px solid #1e293b;">
          <td style="padding: 10px 0; color: #94a3b8;">Area / Locality</td>
          <td style="padding: 10px 0; color: #60a5fa; font-weight: 700;">${newRequest.area}</td>
        </tr>
        <tr style="border-bottom: 1px solid #1e293b;">
          <td style="padding: 10px 0; color: #94a3b8;">Preferred Date &amp; Time</td>
          <td style="padding: 10px 0; color: #f8fafc; font-weight: 600;">${newRequest.preferredDate} (${newRequest.preferredTime})</td>
        </tr>
        <tr style="border-bottom: 1px solid #1e293b;">
          <td style="padding: 10px 0; color: #94a3b8;">Phone / WhatsApp</td>
          <td style="padding: 10px 0; color: #f8fafc; font-weight: 600;">${newRequest.phone}</td>
        </tr>
      </table>

      <div style="background-color: #1e293b; border-left: 4px solid #3b82f6; padding: 14px 18px; border-radius: 8px; margin-bottom: 24px;">
        <div style="font-size: 11px; text-transform: uppercase; color: #94a3b8; font-weight: 700; margin-bottom: 4px;">
          Problem Reported
        </div>
        <div style="font-size: 13px; color: #f1f5f9; line-height: 1.5;">
          ${newRequest.problemDescription}
        </div>
      </div>

      <div style="text-align: center; margin: 26px 0;">
        <a href="https://wa.me/${TECHNICIAN_WHATSAPP_CLEAN}?text=Hello%20Safiullah,%20I%20submitted%20request%20${trackingId}" 
           style="display: inline-block; background-color: #25d366; color: #ffffff; text-decoration: none; padding: 12px 24px; border-radius: 12px; font-weight: 700; font-size: 13px;">
          💬 Chat on WhatsApp (+92 327 5226107)
        </a>
      </div>

      <div style="border-top: 1px solid #1e293b; padding-top: 16px; font-size: 11px; color: #64748b; line-height: 1.5; text-align: center;">
        TechFix Peshawar • Safiullah (Computer Science &amp; Cybersecurity, Univ. of Agriculture, Peshawar)<br>
        On-Site Computer &amp; Windows Services across Hayatabad, University Town, Cantt, Saddar, Warsak Rd &amp; Peshawar City.
      </div>

    </div>
  </div>
</body>
</html>
    `;

    // Deliver to technician and customer (or technician if sandbox)
    const finalRecipients = isSandbox ? [technicianEmail] : [technicianEmail, newRequest.email];

    try {
      const emailResponse = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: senderEmail,
          to: finalRecipients,
          reply_to: newRequest.email || technicianEmail,
          subject: emailSubject,
          html: emailHtml,
          text: `TechFix Peshawar Request ${trackingId}: ${newRequest.customerName} in ${newRequest.area}. Contact: ${newRequest.phone}`,
        }),
      });

      if (emailResponse.ok) {
        newRequest.emailSent = true;
      }
    } catch (e: any) {
      console.warn('Vercel Resend background send notice:', e.message);
    }

    return res.status(201).json({
      success: true,
      request: newRequest,
      message: 'Request registered and notification processed'
    });
  } catch (err: any) {
    console.error('Vercel /api/requests error:', err);
    return res.status(500).json({
      error: err.message || 'Internal error handling request'
    });
  }
}
