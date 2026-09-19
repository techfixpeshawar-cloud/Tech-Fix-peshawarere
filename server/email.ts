import { ServiceRequest, Booking } from '../src/types.js';
import { getDatabase } from './db.js';

const DEFAULT_RESEND_API_KEY = 're_Buuf9PGF_AbXoKs68mLpsbNEJQx8tQW7a';
const DEFAULT_SENDER_EMAIL = 'TechFix Peshawar <onboarding@resend.dev>';
const TECHNICIAN_EMAIL = 'techfixpeshawar@gmail.com';
const TECHNICIAN_PHONE = '+92 327 5226107';
const TECHNICIAN_WHATSAPP_CLEAN = '923275226107';
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function getActiveResendApiKey(): string {
  try {
    const db = getDatabase();
    if (db?.settings?.resendApiKey && db.settings.resendApiKey.trim()) {
      return db.settings.resendApiKey.trim();
    }
  } catch (e) {
    // fallback
  }
  return process.env.RESEND_API_KEY || DEFAULT_RESEND_API_KEY;
}

export function getActiveSenderEmail(): string {
  try {
    const db = getDatabase();
    if (db?.settings?.resendSenderEmail && db.settings.resendSenderEmail.trim()) {
      return db.settings.resendSenderEmail.trim();
    }
  } catch (e) {
    // fallback
  }
  return process.env.RESEND_FROM_EMAIL || DEFAULT_SENDER_EMAIL;
}

export interface EmailSendResult {
  success: boolean;
  id?: string;
  error?: string;
  deliveredTo?: string;
  message?: string;
  isSandboxRerouted?: boolean;
}

/**
 * Sends an email via the Resend API with smart sandbox detection & graceful fallback
 */
async function sendViaResend(params: {
  to: string | string[];
  subject: string;
  html: string;
  text?: string;
}): Promise<EmailSendResult> {
  try {
    const rawRecipients = Array.isArray(params.to) ? params.to : [params.to];
    const recipients = rawRecipients
      .map(r => (typeof r === 'string' ? r.trim() : ''))
      .filter(r => EMAIL_REGEX.test(r));

    if (recipients.length === 0) {
      return { success: false, error: 'No valid recipient email address provided' };
    }

    const apiKey = getActiveResendApiKey();
    if (!apiKey) {
      return { success: false, error: 'Resend API key is not configured' };
    }

    const senderEmail = getActiveSenderEmail();
    const isSandboxDomain = senderEmail.toLowerCase().includes('@resend.dev');

    // Resend free test domain (onboarding@resend.dev) restricts delivery exclusively to
    // the registered account email (techfixpeshawar@gmail.com).
    // Reroute external customer addresses to the verified technician email with clear notice
    // and customer reply_to header to prevent API validation_error rejections.
    const hasExternalRecipient = recipients.some(
      r => r.toLowerCase() !== TECHNICIAN_EMAIL.toLowerCase()
    );

    let finalRecipients = recipients;
    let finalSubject = params.subject;
    let finalHtml = params.html;
    let finalReplyTo = TECHNICIAN_EMAIL;
    let isSandboxRerouted = false;

    if (isSandboxDomain && hasExternalRecipient) {
      isSandboxRerouted = true;
      finalRecipients = [TECHNICIAN_EMAIL];
      const customerAddresses = recipients.join(', ');
      finalSubject = `[Sandbox Delivery • Customer: ${customerAddresses}] ${params.subject}`;
      finalReplyTo = recipients[0] || TECHNICIAN_EMAIL;

      const sandboxBanner = `
        <div style="background-color: #0d1e38; border: 1px solid #3b82f6; border-radius: 12px; padding: 14px 18px; margin-bottom: 24px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-size: 13px; color: #93c5fd; line-height: 1.5;">
          <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 6px;">
            <strong style="color: #60a5fa; font-size: 14px;">ℹ️ Resend Sandbox Notice (Live Test Mode)</strong>
          </div>
          <div style="color: #f1f5f9; margin-bottom: 6px;">
            Delivered to verified account (<strong>${TECHNICIAN_EMAIL}</strong>) because current sender is set to Resend testing domain (<code>${senderEmail}</code>).
          </div>
          <div style="color: #cbd5e1;">
            <strong>Intended Customer Recipient:</strong> <span style="color: #38bdf8; font-family: monospace; font-weight: bold;">${customerAddresses}</span>
          </div>
          <div style="margin-top: 8px; font-size: 11px; color: #94a3b8;">
            💡 <em>To deliver emails directly to customer inboxes, verify your domain at resend.com/domains and update Sender Email in Admin Settings.</em>
          </div>
        </div>
      `;

      if (finalHtml.includes('<!-- Main Content -->')) {
        finalHtml = finalHtml.replace('<!-- Main Content -->', `<!-- Main Content -->\n${sandboxBanner}`);
      } else {
        finalHtml = sandboxBanner + finalHtml;
      }
    }

    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: senderEmail,
        to: finalRecipients,
        reply_to: finalReplyTo,
        subject: finalSubject,
        html: finalHtml,
        text: params.text || params.subject,
      }),
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      // Check if Resend rejected due to sandbox restriction
      const isSandboxRestriction =
        data?.name === 'validation_error' &&
        typeof data?.message === 'string' &&
        (data.message.includes('testing emails') || data.message.includes('resend.com/domains'));

      if (isSandboxRestriction && !finalRecipients.includes(TECHNICIAN_EMAIL)) {
        // Transparent fallback to technician email
        const fallbackRes = await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${apiKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            from: senderEmail,
            to: [TECHNICIAN_EMAIL],
            reply_to: recipients[0] || TECHNICIAN_EMAIL,
            subject: `[Customer: ${recipients.join(', ')}] ${params.subject}`,
            html: params.html,
            text: params.text || params.subject,
          }),
        });
        const fallbackData = await fallbackRes.json().catch(() => ({}));
        if (fallbackRes.ok) {
          return {
            success: true,
            id: fallbackData.id,
            deliveredTo: TECHNICIAN_EMAIL,
            isSandboxRerouted: true,
            message: `Delivered to ${TECHNICIAN_EMAIL} (Resend sandbox mode)`
          };
        }
      }

      const errMsg = data?.message || `Resend error status: ${response.status}`;
      return {
        success: false,
        error: errMsg,
      };
    }

    return {
      success: true,
      id: data.id,
      deliveredTo: finalRecipients.join(', '),
      isSandboxRerouted,
      message: isSandboxRerouted
        ? `Delivered to verified inbox ${TECHNICIAN_EMAIL} (Sandbox copy for ${recipients.join(', ')})`
        : `Confirmation email sent to ${recipients.join(', ')}`
    };
  } catch (err: any) {
    return { success: false, error: err.message || 'Network error sending email' };
  }
}

/**
 * Format date in Pakistan Standard Time (PKT)
 */
function formatPKTDate(isoString: string): string {
  try {
    const d = new Date(isoString);
    return d.toLocaleString('en-US', {
      timeZone: 'Asia/Karachi',
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    }) + ' (PKT)';
  } catch {
    return isoString;
  }
}

/**
 * Generate Tracking ID: e.g. PSH-MU2ELAGT-949
 */
export function generateTrackingId(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let rand = '';
  for (let i = 0; i < 8; i++) {
    rand += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  const suffix = Math.floor(100 + Math.random() * 900);
  return `PSH-${rand}-${suffix}`;
}

/**
 * 1. Customer Request Received Email (Sent immediately when service request form is submitted)
 */
export async function sendRequestReceivedEmail(request: ServiceRequest): Promise<EmailSendResult> {
  const trackingId = request.trackingId || request.id;
  const submittedAt = formatPKTDate(request.createdAt || new Date().toISOString());
  const dataSafety = request.importantData
    ? 'CRITICAL FILE PRESERVATION (Backup before modifications)'
    : 'Standard';

  const subject = `✓ Request Received & Logged: ${trackingId} — TechFix Peshawar`;

  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Service Request Received</title>
</head>
<body style="margin: 0; padding: 20px; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #070c16; color: #f1f5f9;">
  <div style="max-width: 620px; margin: 0 auto; background-color: #0d1527; border: 1px solid #1e293b; border-radius: 20px; overflow: hidden; box-shadow: 0 20px 40px rgba(0,0,0,0.5);">
    
    <!-- Top Header Banner -->
    <div style="background: linear-gradient(135deg, #1d4ed8, #2563eb); padding: 28px 24px; text-align: center; border-bottom: 2px solid #3b82f6;">
      <div style="display: inline-block; background-color: #10b981; color: #ffffff; padding: 5px 14px; border-radius: 9999px; font-size: 11px; font-weight: 800; letter-spacing: 0.8px; text-transform: uppercase; margin-bottom: 12px;">
        ✓ REQUEST RECEIVED &amp; LOGGED
      </div>
      <h1 style="color: #ffffff; margin: 0 0 6px 0; font-size: 24px; font-weight: 800; letter-spacing: -0.5px;">
        TechFix Peshawar • Booking Confirmation
      </h1>
      <p style="color: #bfdbfe; margin: 0; font-size: 14px; font-weight: 500;">
        Reliable On-Site Computer Support in Peshawar
      </p>
    </div>

    <!-- Main Content -->
    <div style="padding: 28px 24px;">
      <p style="font-size: 16px; margin: 0 0 16px 0; color: #ffffff;">
        Hello <strong style="color: #60a5fa;">${request.customerName}</strong>,
      </p>
      
      <p style="font-size: 14px; line-height: 1.6; color: #cbd5e1; margin: 0 0 24px 0;">
        Thank you for booking with <strong>TechFix Peshawar</strong>! We have successfully received your on-site service request. Our head technician, <strong>Safiullah</strong>, has been alerted and will contact you shortly to review the issue and confirm our technician's arrival time.
      </p>

      <!-- Tracking ID Banner Box -->
      <div style="background-color: #131f38; border: 1px solid #2563eb; border-radius: 14px; padding: 18px; text-align: center; margin-bottom: 24px;">
        <span style="font-size: 11px; font-weight: 700; color: #93c5fd; text-transform: uppercase; letter-spacing: 1px; display: block; margin-bottom: 4px;">
          YOUR REFERENCE TRACKING ID
        </span>
        <span style="font-family: Consolas, Monaco, monospace; font-size: 22px; font-weight: 800; color: #38bdf8; letter-spacing: 1.5px;">
          ${trackingId}
        </span>
      </div>

      <!-- Details Table -->
      <table style="width: 100%; border-collapse: collapse; margin-bottom: 24px; font-size: 13px;">
        <tbody>
          <tr style="border-bottom: 1px solid #1e293b;">
            <td style="padding: 10px 0; color: #94a3b8; font-weight: 600; width: 38%;">Service:</td>
            <td style="padding: 10px 0; color: #f8fafc; font-weight: 600;">${request.requestedService}</td>
          </tr>
          <tr style="border-bottom: 1px solid #1e293b;">
            <td style="padding: 10px 0; color: #94a3b8; font-weight: 600;">Device:</td>
            <td style="padding: 10px 0; color: #f8fafc;">${request.deviceType.toUpperCase()} ${request.computerBrandModel ? '— ' + request.computerBrandModel : ''} (${request.operatingSystem})</td>
          </tr>
          <tr style="border-bottom: 1px solid #1e293b;">
            <td style="padding: 10px 0; color: #94a3b8; font-weight: 600;">Location / Area:</td>
            <td style="padding: 10px 0; color: #f8fafc;"><strong>${request.area}</strong> (Peshawar)</td>
          </tr>
          <tr style="border-bottom: 1px solid #1e293b;">
            <td style="padding: 10px 0; color: #94a3b8; font-weight: 600;">Preferred Window:</td>
            <td style="padding: 10px 0; color: #f8fafc;"><strong>${request.preferredDate}</strong> — ${request.preferredTime}</td>
          </tr>
          <tr style="border-bottom: 1px solid #1e293b;">
            <td style="padding: 10px 0; color: #94a3b8; font-weight: 600;">Data Safety Alert:</td>
            <td style="padding: 10px 0; color: ${request.importantData ? '#fbbf24' : '#94a3b8'}; font-weight: 600;">
              ${dataSafety}
            </td>
          </tr>
          <tr>
            <td style="padding: 10px 0; color: #94a3b8; font-weight: 600;">Submitted At:</td>
            <td style="padding: 10px 0; color: #cbd5e1; font-family: monospace;">${submittedAt}</td>
          </tr>
        </tbody>
      </table>

      <!-- Problem Description Box -->
      <div style="background-color: #090e1a; border: 1px solid #1e293b; border-radius: 12px; padding: 16px; margin-bottom: 24px;">
        <span style="font-size: 11px; font-weight: 700; color: #60a5fa; text-transform: uppercase; letter-spacing: 0.5px; display: block; margin-bottom: 6px;">
          Reported Computer Issue
        </span>
        <p style="margin: 0; font-size: 13px; line-height: 1.5; color: #e2e8f0; white-space: pre-wrap;">
${request.problemDescription}
        </p>
      </div>

      <!-- What happens next -->
      <div style="background-color: #0b1526; border-left: 4px solid #3b82f6; padding: 14px 16px; border-radius: 0 10px 10px 0; margin-bottom: 24px;">
        <p style="margin: 0; font-size: 13px; color: #93c5fd; line-height: 1.5;">
          <strong>What happens next?</strong> Submitting this request allows our technician to prep tools &amp; replacement parts. We will call or WhatsApp you at <strong>${request.phone}</strong> to confirm the exact address and arrival slot before dispatching.
        </p>
      </div>

      <!-- WhatsApp CTA Button -->
      <div style="text-align: center; margin: 28px 0 16px 0;">
        <a href="https://wa.me/${TECHNICIAN_WHATSAPP_CLEAN}?text=${encodeURIComponent(`Hello Safiullah! I just submitted request ${trackingId} for ${request.requestedService} in ${request.area}.`)}"
           style="display: inline-block; background-color: #10b981; color: #ffffff; text-decoration: none; padding: 14px 28px; border-radius: 12px; font-weight: 700; font-size: 14px; box-shadow: 0 4px 12px rgba(16,185,129,0.3);">
          💬 Chat with Technician on WhatsApp (${TECHNICIAN_PHONE})
        </a>
      </div>

      <div style="text-align: center; margin-top: 12px;">
        <span style="font-size: 12px; color: #64748b;">
          No upfront advance payment. You test your computer and pay on-site when 100% satisfied.
        </span>
      </div>

    </div>

    <!-- Footer Info -->
    <div style="background-color: #070c16; padding: 20px 24px; text-align: center; border-top: 1px solid #1e293b; font-size: 12px; color: #64748b; line-height: 1.5;">
      <p style="margin: 0 0 6px 0; font-weight: 600; color: #94a3b8;">
        TechFix On-Site Computer Repair &amp; IT Support • Peshawar, KP
      </p>
      <p style="margin: 0;">
        Helpline: <a href="tel:${TECHNICIAN_PHONE}" style="color: #60a5fa; text-decoration: none;">${TECHNICIAN_PHONE}</a> • Email: <a href="mailto:${TECHNICIAN_EMAIL}" style="color: #60a5fa; text-decoration: none;">${TECHNICIAN_EMAIL}</a>
      </p>
    </div>

  </div>
</body>
</html>
  `;

  const text = `✓ REQUEST RECEIVED & LOGGED
TechFix Peshawar • Booking Confirmation
Reliable On-Site Computer Support in Peshawar

Hello ${request.customerName},

Thank you for booking with TechFix Peshawar! We have successfully received your on-site service request. Our head technician, Safiullah, has been alerted and will contact you shortly to review the issue and confirm our technician's arrival time.

Your Reference Tracking ID: ${trackingId}
Service: ${request.requestedService}
Device: ${request.deviceType.toUpperCase()} ${request.computerBrandModel ? '— ' + request.computerBrandModel : ''} (${request.operatingSystem})
Location / Area: ${request.area} (Peshawar)
Preferred Window: ${request.preferredDate} — ${request.preferredTime}
Data Safety Alert: ${dataSafety}
Submitted At: ${submittedAt}

Reported Computer Issue:
${request.problemDescription}

What happens next? Submitting this request allows our technician to prep tools & replacement parts. We will call or WhatsApp you at ${request.phone} to confirm the exact address and arrival slot before dispatching.

💬 Chat with Technician on WhatsApp: https://wa.me/${TECHNICIAN_WHATSAPP_CLEAN} (${TECHNICIAN_PHONE})
Helpline: ${TECHNICIAN_PHONE}
No upfront advance payment. You test the computer and pay on-site when satisfied.
TechFix On-Site Computer Repair & IT Support • Peshawar, KP`;

  // Send to customer
  const result = await sendViaResend({
    to: request.email,
    subject,
    html,
    text,
  });

  // If customer is external and email was delivered directly (custom verified domain), also send alert copy to technician
  if (result.success && !result.isSandboxRerouted && request.email.toLowerCase() !== TECHNICIAN_EMAIL.toLowerCase()) {
    try {
      await sendViaResend({
        to: TECHNICIAN_EMAIL,
        subject: `[New Inquiry Alert] ${trackingId}: ${request.customerName} (${request.area})`,
        html,
        text,
      });
    } catch {
      // ignore
    }
  }

  return result;
}

/**
 * 2. Appointment Confirmed Email (Sent when technician confirms the visit in Admin Panel)
 */
export async function sendAppointmentConfirmedEmail(booking: Booking): Promise<EmailSendResult> {
  const customerEmail = booking.email;
  if (!customerEmail) {
    return { success: false, error: 'No email address registered on this booking' };
  }

  const trackingId = booking.trackingId || booking.id;
  const subject = `✓ Appointment Confirmed: ${trackingId} — TechFix Peshawar`;

  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Appointment Confirmed</title>
</head>
<body style="margin: 0; padding: 20px; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #070c16; color: #f1f5f9;">
  <div style="max-width: 620px; margin: 0 auto; background-color: #0d1527; border: 1px solid #1e293b; border-radius: 20px; overflow: hidden; box-shadow: 0 20px 40px rgba(0,0,0,0.5);">
    
    <!-- Top Header Banner -->
    <div style="background: linear-gradient(135deg, #059669, #10b981); padding: 28px 24px; text-align: center; border-bottom: 2px solid #34d399;">
      <div style="display: inline-block; background-color: #047857; color: #ffffff; padding: 5px 14px; border-radius: 9999px; font-size: 11px; font-weight: 800; letter-spacing: 0.8px; text-transform: uppercase; margin-bottom: 12px; border: 1px solid #6ee7b7;">
        ✓ APPOINTMENT OFFICIALLY CONFIRMED
      </div>
      <h1 style="color: #ffffff; margin: 0 0 6px 0; font-size: 24px; font-weight: 800; letter-spacing: -0.5px;">
        TechFix Peshawar • Visit Scheduled
      </h1>
      <p style="color: #d1fae5; margin: 0; font-size: 14px; font-weight: 500;">
        Our technician is assigned and scheduled for your on-site visit
      </p>
    </div>

    <!-- Main Content -->
    <div style="padding: 28px 24px;">
      <p style="font-size: 16px; margin: 0 0 16px 0; color: #ffffff;">
        Hello <strong style="color: #34d399;">${booking.customerName}</strong>,
      </p>
      
      <p style="font-size: 14px; line-height: 1.6; color: #cbd5e1; margin: 0 0 24px 0;">
        Great news! Your on-site computer support appointment has been <strong>OFFICIALLY CONFIRMED</strong>. Head technician <strong>${booking.technician || 'Safiullah'}</strong> will visit your location in Peshawar at the confirmed slot.
      </p>

      <!-- Scheduled Time Card -->
      <div style="background-color: #064e3b; border: 1px solid #10b981; border-radius: 14px; padding: 20px; text-align: center; margin-bottom: 24px;">
        <span style="font-size: 11px; font-weight: 700; color: #a7f3d0; text-transform: uppercase; letter-spacing: 1px; display: block; margin-bottom: 6px;">
          CONFIRMED VISIT TIME
        </span>
        <div style="font-size: 22px; font-weight: 800; color: #ffffff;">
          ${booking.date} at ${booking.time}
        </div>
        <span style="display: inline-block; margin-top: 6px; font-size: 12px; color: #6ee7b7; font-family: monospace;">
          Reference ID: ${trackingId}
        </span>
      </div>

      <!-- Appointment Details -->
      <table style="width: 100%; border-collapse: collapse; margin-bottom: 24px; font-size: 13px;">
        <tbody>
          <tr style="border-bottom: 1px solid #1e293b;">
            <td style="padding: 10px 0; color: #94a3b8; font-weight: 600; width: 38%;">Service:</td>
            <td style="padding: 10px 0; color: #f8fafc; font-weight: 600;">${booking.service}</td>
          </tr>
          <tr style="border-bottom: 1px solid #1e293b;">
            <td style="padding: 10px 0; color: #94a3b8; font-weight: 600;">Address / Area:</td>
            <td style="padding: 10px 0; color: #f8fafc;">${booking.addressArea}</td>
          </tr>
          <tr style="border-bottom: 1px solid #1e293b;">
            <td style="padding: 10px 0; color: #94a3b8; font-weight: 600;">Assigned Technician:</td>
            <td style="padding: 10px 0; color: #38bdf8; font-weight: 600;">${booking.technician || 'Safiullah (Head Tech)'}</td>
          </tr>
          <tr style="border-bottom: 1px solid #1e293b;">
            <td style="padding: 10px 0; color: #94a3b8; font-weight: 600;">Estimated Service Fee:</td>
            <td style="padding: 10px 0; color: #34d399; font-weight: 700; font-size: 15px;">Rs. ${booking.price}</td>
          </tr>
          <tr>
            <td style="padding: 10px 0; color: #94a3b8; font-weight: 600;">Payment Terms:</td>
            <td style="padding: 10px 0; color: #cbd5e1;">Pay on-site after testing &amp; satisfaction (Cash / EasyPaisa / Bank)</td>
          </tr>
        </tbody>
      </table>

      ${booking.notes ? `
      <div style="background-color: #0f1d36; border: 1px solid #1e3a8a; border-radius: 12px; padding: 14px; margin-bottom: 24px;">
        <span style="font-size: 11px; font-weight: 700; color: #93c5fd; text-transform: uppercase; display: block; margin-bottom: 4px;">
          Technician Visit Note:
        </span>
        <p style="margin: 0; font-size: 13px; color: #e2e8f0; line-height: 1.5;">${booking.notes}</p>
      </div>` : ''}

      <!-- Preparation Tip -->
      <div style="background-color: #0b1526; border-left: 4px solid #10b981; padding: 14px 16px; border-radius: 0 10px 10px 0; margin-bottom: 24px;">
        <p style="margin: 0; font-size: 13px; color: #94a3b8; line-height: 1.5;">
          <strong style="color: #34d399;">Please note:</strong> Please keep your PC plugged in or charger nearby. If you have any sudden changes in schedule, feel free to call or WhatsApp directly.
        </p>
      </div>

      <!-- Actions -->
      <div style="text-align: center; margin: 28px 0 16px 0;">
        <a href="https://wa.me/${TECHNICIAN_WHATSAPP_CLEAN}?text=${encodeURIComponent(`Salam Safiullah! Regarding my confirmed booking ${trackingId} for ${booking.service} on ${booking.date}.`)}"
           style="display: inline-block; background-color: #10b981; color: #ffffff; text-decoration: none; padding: 14px 28px; border-radius: 12px; font-weight: 700; font-size: 14px; box-shadow: 0 4px 12px rgba(16,185,129,0.3);">
          💬 Contact Safiullah on WhatsApp (${TECHNICIAN_PHONE})
        </a>
      </div>

    </div>

    <!-- Footer Info -->
    <div style="background-color: #070c16; padding: 20px 24px; text-align: center; border-top: 1px solid #1e293b; font-size: 12px; color: #64748b; line-height: 1.5;">
      <p style="margin: 0 0 6px 0; font-weight: 600; color: #94a3b8;">
        TechFix On-Site Computer Repair &amp; IT Support • Peshawar, KP
      </p>
      <p style="margin: 0;">
        Helpline: <a href="tel:${TECHNICIAN_PHONE}" style="color: #60a5fa; text-decoration: none;">${TECHNICIAN_PHONE}</a> • Email: <a href="mailto:${TECHNICIAN_EMAIL}" style="color: #60a5fa; text-decoration: none;">${TECHNICIAN_EMAIL}</a>
      </p>
    </div>

  </div>
</body>
</html>
  `;

  const text = `✓ APPOINTMENT OFFICIALLY CONFIRMED
TechFix Peshawar • Visit Scheduled
Reliable On-Site Computer Support in Peshawar

Hello ${booking.customerName},

Great news! Your on-site computer support appointment has been OFFICIALLY CONFIRMED.

Confirmed Visit Time: ${booking.date} at ${booking.time}
Reference ID: ${trackingId}
Service: ${booking.service}
Address / Area: ${booking.addressArea}
Assigned Technician: ${booking.technician || 'Safiullah'}
Estimated Service Fee: Rs. ${booking.price}
Payment: Pay on-site after testing & satisfaction

Contact Technician on WhatsApp: https://wa.me/${TECHNICIAN_WHATSAPP_CLEAN} (${TECHNICIAN_PHONE})
TechFix On-Site Computer Repair & IT Support • Peshawar, KP`;

  const result = await sendViaResend({
    to: customerEmail,
    subject,
    html,
    text,
  });

  // If customer is external and email was delivered directly (custom verified domain), also send schedule alert to technician
  if (result.success && !result.isSandboxRerouted && customerEmail.toLowerCase() !== TECHNICIAN_EMAIL.toLowerCase()) {
    try {
      await sendViaResend({
        to: TECHNICIAN_EMAIL,
        subject: `[Schedule Confirmed] ${trackingId}: ${booking.customerName} on ${booking.date} at ${booking.time}`,
        html,
        text,
      });
    } catch {
      // ignore
    }
  }

  return result;
}

/**
 * Send custom email via Resend
 */
export async function sendCustomEmail(params: {
  to: string | string[];
  subject: string;
  html: string;
  text?: string;
}): Promise<EmailSendResult> {
  return sendViaResend(params);
}

/**
 * Test the Resend connection and configuration
 */
export async function testResendConnection(targetEmail?: string): Promise<EmailSendResult> {
  const recipient = (targetEmail || TECHNICIAN_EMAIL).trim();
  const apiKey = getActiveResendApiKey();
  const senderEmail = getActiveSenderEmail();

  if (!apiKey) {
    return {
      success: false,
      error: 'Resend API key is not configured in environment or database settings.',
    };
  }

  const testSubject = `✓ TechFix Peshawar • Email Service Test (${new Date().toLocaleTimeString('en-US')})`;
  const testHtml = `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; padding: 24px; background-color: #0b1329; color: #f8fafc; border-radius: 16px; border: 1px solid #1e293b;">
      <h2 style="color: #60a5fa; margin-top: 0; font-size: 20px;">✓ Resend Integration Active &amp; Ready</h2>
      <p style="font-size: 14px; color: #cbd5e1; line-height: 1.6;">
        This test confirms that your server-side Resend email configuration is functioning properly.
      </p>
      <div style="background-color: #1e293b; padding: 14px 18px; border-radius: 8px; margin: 16px 0; font-family: monospace; font-size: 13px; color: #93c5fd;">
        <div style="margin-bottom: 4px;">Sender: <strong>${senderEmail}</strong></div>
        <div style="margin-bottom: 4px;">Recipient: <strong>${recipient}</strong></div>
        <div>Timestamp: <strong>${new Date().toISOString()}</strong></div>
      </div>
      <p style="font-size: 12px; color: #94a3b8; margin: 0;">
        TechFix Peshawar • On-Site Computer Support System
      </p>
    </div>
  `;

  return sendViaResend({
    to: recipient,
    subject: testSubject,
    html: testHtml,
    text: `TechFix Peshawar Resend Email Test sent at ${new Date().toISOString()}`,
  });
}

export { getActiveResendApiKey };

