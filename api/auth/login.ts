// Vercel Serverless Function: Admin Authentication
// Endpoint: POST /api/auth/login or POST /api/auth/update-password

const ADMIN_EMAIL = 'techfixpeshawar@gmail.com';
let adminPasswordHash = 'Safiullah@12';

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

  if (req.method !== 'POST') {
    return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
  }

  const { email, password } = req.body || {};

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  const trimmedEmail = email.trim().toLowerCase();
  const trimmedPassword = password.trim();

  // Allow Safiullah@12 or custom set password
  if (trimmedEmail === ADMIN_EMAIL.toLowerCase() && (trimmedPassword === 'Safiullah@12' || trimmedPassword === adminPasswordHash)) {
    const token = 'admin_session_' + Buffer.from(`${trimmedEmail}:${Date.now()}`).toString('base64');
    return res.status(200).json({
      success: true,
      token,
      user: {
        email: ADMIN_EMAIL,
        name: 'Safiullah',
        role: 'Administrator',
        institution: 'University of Agriculture, Peshawar',
      },
    });
  }

  return res.status(401).json({
    error: 'Invalid admin credentials. Please verify your email and password.',
  });
}
