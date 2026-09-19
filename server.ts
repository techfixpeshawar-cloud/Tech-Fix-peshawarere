import express from 'express';
import path from 'path';
import fs from 'fs';
import { createServer as createViteServer } from 'vite';
import { getDatabase, saveDatabase } from './server/db.js';
import {
  Service,
  ServiceRequest,
  Booking,
  Customer,
  FAQItem,
  ServiceArea,
  RealServiceCase,
  MediaItem,
  WebsiteSettings,
} from './src/types.js';
import {
  sendRequestReceivedEmail,
  sendAppointmentConfirmedEmail,
  sendCustomEmail,
  testResendConnection,
  generateTrackingId,
  getActiveSenderEmail,
  getActiveResendApiKey,
} from './server/email.js';

async function startServer() {
  const app = express();
  const PORT = 3000;

  // JSON Body Parser with 20MB limit for image uploads
  app.use(express.json({ limit: '20mb' }));
  app.use(express.urlencoded({ extended: true, limit: '20mb' }));

  // Ensure public uploads directory exists
  const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
  }

  // Helper to verify admin token header
  const requireAdmin = (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Unauthorized: Admin authentication required' });
    }
    // Simple bearer check for the authenticated session
    const token = authHeader.split(' ')[1];
    if (!token || token.length < 3) {
      return res.status(401).json({ error: 'Unauthorized: Invalid token' });
    }
    next();
  };

  // --- PUBLIC REQUEST TRACKER ---
  app.get('/api/track/:query', (req, res) => {
    const rawQuery = (req.params.query || '').trim();
    if (!rawQuery) {
      return res.status(400).json({ error: 'Tracking reference or phone number is required' });
    }

    const cleanQuery = rawQuery.toLowerCase();
    const digitsOnly = rawQuery.replace(/\D/g, '');

    const db = getDatabase();

    // 1. Search in Bookings first (most up-to-date schedule)
    const booking = db.bookings.find(b => {
      const tId = (b.trackingId || '').toLowerCase();
      const bId = (b.id || '').toLowerCase();
      const rId = (b.requestId || '').toLowerCase();
      const bPhone = (b.phone || '').replace(/\D/g, '');
      const bWa = (b.whatsapp || '').replace(/\D/g, '');

      return (
        tId === cleanQuery ||
        bId === cleanQuery ||
        rId === cleanQuery ||
        (digitsOnly.length >= 7 && (bPhone.endsWith(digitsOnly) || bWa.endsWith(digitsOnly)))
      );
    });

    if (booking) {
      const stepIndexMap: Record<string, number> = {
        requested: 0,
        pending: 1,
        confirmed: 2,
        in_progress: 3,
        completed: 4,
        cancelled: -1
      };

      const statusLabels: Record<string, string> = {
        requested: 'Appointment Requested - Pending Review',
        pending: 'Under Review by Technician Safiullah',
        confirmed: 'Visit Confirmed & Scheduled',
        in_progress: 'Technician Dispatched / In Progress',
        completed: 'Service Completed & Verified',
        cancelled: 'Service Cancelled'
      };

      return res.json({
        found: true,
        type: 'booking',
        trackingId: booking.trackingId || booking.id,
        customerName: booking.customerName,
        service: booking.service,
        status: booking.status,
        statusLabel: statusLabels[booking.status] || booking.status,
        scheduledDate: booking.date,
        scheduledTime: booking.time,
        confirmedDate: booking.date,
        confirmedTime: booking.time,
        area: booking.addressArea,
        device: booking.device,
        technician: booking.technician || 'Safiullah',
        technicianPhone: db.settings.phone || '+92 312 9876543',
        stepIndex: stepIndexMap[booking.status] ?? 2,
        notes: booking.notes || 'Technician will arrive at your location at the confirmed time.',
        updatedAt: booking.updatedAt || booking.createdAt,
        emailSent: booking.emailSent
      });
    }

    // 2. Search in Requests
    const request = db.requests.find(r => {
      const tId = (r.trackingId || '').toLowerCase();
      const rId = (r.id || '').toLowerCase();
      const rPhone = (r.phone || '').replace(/\D/g, '');
      const rWa = (r.whatsapp || '').replace(/\D/g, '');

      return (
        tId === cleanQuery ||
        rId === cleanQuery ||
        (digitsOnly.length >= 7 && (rPhone.endsWith(digitsOnly) || rWa.endsWith(digitsOnly)))
      );
    });

    if (request) {
      const stepIndexMap: Record<string, number> = {
        new: 0,
        contacted: 1,
        appointment_requested: 1,
        confirmed: 2,
        in_progress: 3,
        completed: 4,
        cancelled: -1
      };

      const statusLabels: Record<string, string> = {
        new: 'Request Received - Queued for Technician Review',
        contacted: 'Contacted via WhatsApp/Phone',
        appointment_requested: 'Appointment Time Under Review',
        confirmed: 'Visit Confirmed & Scheduled',
        in_progress: 'On-Site Troubleshooting In Progress',
        completed: 'Service Completed Successfully',
        cancelled: 'Request Cancelled'
      };

      return res.json({
        found: true,
        type: 'request',
        trackingId: request.trackingId || request.id,
        customerName: request.customerName,
        service: request.requestedService,
        status: request.status,
        statusLabel: statusLabels[request.status] || request.status,
        scheduledDate: request.preferredDate,
        scheduledTime: request.preferredTime,
        confirmedDate: request.preferredDate,
        confirmedTime: request.preferredTime,
        area: request.area,
        device: request.deviceType,
        technician: 'Safiullah',
        technicianPhone: db.settings.phone || '+92 312 9876543',
        stepIndex: stepIndexMap[request.status] ?? 1,
        notes: request.adminNotes || 'Request logged. Safiullah will confirm visit details.',
        updatedAt: request.updatedAt || request.createdAt,
        emailSent: request.emailSent
      });
    }

    return res.status(404).json({
      found: false,
      error: 'No active service request or booking found matching that reference or phone number.'
    });
  });

  // --- HEALTH CHECK ---
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
  });

  // --- AUTHENTICATION ---
  // In addition to Firebase compatibility, provides direct server-verified login
  // so `auth/operation-not-allowed` never breaks the admin workflow.
  let adminPasswordHash = 'Safiullah@12';
  const ADMIN_EMAIL = 'techfixpeshawar@gmail.com';

  app.post('/api/auth/login', (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const trimmedEmail = email.trim().toLowerCase();
    if (trimmedEmail === ADMIN_EMAIL.toLowerCase() && password === adminPasswordHash) {
      const token = 'admin_session_' + Buffer.from(`${trimmedEmail}:${Date.now()}`).toString('base64');
      return res.json({
        success: true,
        token,
        user: {
          email: ADMIN_EMAIL,
          name: 'Safiullah',
          role: 'Administrator',
          institution: 'University of Agriculture, Peshawar'
        }
      });
    }

    return res.status(401).json({ error: 'Invalid admin credentials. Please verify your email and password.' });
  });

  app.post('/api/auth/update-password', requireAdmin, (req, res) => {
    const { currentPassword, newPassword } = req.body;
    if (currentPassword !== adminPasswordHash) {
      return res.status(400).json({ error: 'Current password is incorrect' });
    }
    if (!newPassword || newPassword.length < 6) {
      return res.status(400).json({ error: 'New password must be at least 6 characters' });
    }
    adminPasswordHash = newPassword;
    res.json({ success: true, message: 'Admin password updated successfully' });
  });

  // --- STATS OVERVIEW ---
  app.get('/api/stats', (req, res) => {
    const db = getDatabase();
    const stats = {
      totalServices: db.services.length,
      activeServices: db.services.filter(s => s.status === 'published').length,
      newRequests: db.requests.filter(r => r.status === 'new').length,
      pendingBookings: db.bookings.filter(b => b.status === 'requested' || b.status === 'pending').length,
      confirmedBookings: db.bookings.filter(b => b.status === 'confirmed').length,
      completedJobs: db.bookings.filter(b => b.status === 'completed').length,
      faqItems: db.faq.filter(f => f.published).length,
      publishedCases: db.cases.filter(c => c.published).length,
      totalCustomers: db.customers.length,
    };
    res.json(stats);
  });

  // --- SETTINGS ---
  app.get('/api/settings', (req, res) => {
    const db = getDatabase();
    res.json(db.settings);
  });

  app.put('/api/settings', requireAdmin, (req, res) => {
    const db = getDatabase();
    db.settings = { ...db.settings, ...req.body };
    saveDatabase(db);
    res.json({ success: true, settings: db.settings });
  });

  // --- SERVICES ---
  app.get('/api/services', (req, res) => {
    const db = getDatabase();
    const showAll = req.query.all === 'true';
    if (showAll) {
      // Return all services sorted by displayOrder (including draft, unpublished, archived)
      const list = [...db.services].sort((a, b) => a.displayOrder - b.displayOrder);
      return res.json(list);
    }
    // Public: only published services
    const published = db.services
      .filter(s => s.status === 'published')
      .sort((a, b) => a.displayOrder - b.displayOrder);
    res.json(published);
  });

  app.post('/api/services', requireAdmin, (req, res) => {
    const db = getDatabase();
    let status = req.body.status || 'published';
    if (req.body.isPublished === false && status === 'published') {
      status = 'unpublished';
    } else if (req.body.isPublished === true) {
      status = 'published';
    }

    const newService: Service & { isPublished?: boolean } = {
      id: 'srv-' + Date.now(),
      name: req.body.name || 'New Service',
      shortDescription: req.body.shortDescription || '',
      fullDescription: req.body.fullDescription || '',
      icon: req.body.icon || 'Wrench',
      coverImage: req.body.coverImage || '',
      startingPrice: req.body.startingPrice || 1500,
      priceType: req.body.priceType || 'starting',
      serviceDuration: req.body.serviceDuration || '45 - 60 mins',
      category: req.body.category || 'Windows',
      targetCustomer: req.body.targetCustomer || 'all',
      status: status as any,
      displayOrder: req.body.displayOrder || db.services.length + 1,
      featured: !!req.body.featured,
      workflowSteps: req.body.workflowSteps || [],
      keyPoints: req.body.keyPoints || [],
      warningMessage: req.body.warningMessage || ''
    };
    db.services.push(newService as any);
    saveDatabase(db);
    res.status(201).json(newService);
  });

  app.put('/api/services/:id', requireAdmin, (req, res) => {
    const db = getDatabase();
    const index = db.services.findIndex(s => s.id === req.params.id);
    if (index === -1) {
      return res.status(404).json({ error: 'Service not found' });
    }

    let updates = { ...req.body };
    if (updates.isPublished === false && (!updates.status || updates.status === 'published')) {
      updates.status = 'unpublished';
    } else if (updates.isPublished === true) {
      updates.status = 'published';
    }
    if (updates.status) {
      updates.isPublished = updates.status === 'published';
      updates.published = updates.status === 'published';
    }

    db.services[index] = { ...db.services[index], ...updates };
    saveDatabase(db);
    res.json(db.services[index]);
  });

  app.delete('/api/services/:id', requireAdmin, (req, res) => {
    const db = getDatabase();
    db.services = db.services.filter(s => s.id !== req.params.id);
    saveDatabase(db);
    res.json({ success: true, message: 'Service removed permanently' });
  });

  // --- SERVICE REQUESTS (PUBLIC SUBMISSION + ADMIN MANAGEMENT) ---
  app.get('/api/requests', requireAdmin, (req, res) => {
    const db = getDatabase();
    const list = [...db.requests].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    res.json(list);
  });

  app.post('/api/requests', async (req, res) => {
    const db = getDatabase();
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
      urgency
    } = req.body;

    if (!customerName || !phone || !problemDescription) {
      return res.status(400).json({ error: 'Name, phone, and problem description are required' });
    }

    const trackingId = generateTrackingId();
    const customerEmail = email ? email.trim() : '';

    const newRequest: ServiceRequest = {
      id: 'req-' + Date.now(),
      trackingId,
      customerName: customerName.trim(),
      email: customerEmail,
      phone: phone.trim(),
      whatsapp: whatsapp || phone,
      area: area || 'Peshawar',
      deviceType: deviceType || 'laptop',
      computerBrandModel: computerBrandModel || 'Not specified',
      operatingSystem: operatingSystem || 'Windows',
      requestedService: requestedService || 'Troubleshooting',
      problemDescription: problemDescription.trim(),
      importantData: !!importantData,
      preferredDate: preferredDate || new Date().toISOString().split('T')[0],
      preferredTime: preferredTime || 'Morning',
      urgency: urgency || 'normal',
      status: 'new',
      adminNotes: '',
      emailSent: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    // If customer provided an email, send confirmation email immediately
    if (customerEmail) {
      try {
        const emailRes = await sendRequestReceivedEmail(newRequest);
        newRequest.emailSent = emailRes.success;
        if (!emailRes.success && emailRes.error) {
          newRequest.emailError = emailRes.error;
        }
      } catch (err: any) {
        console.error('Email error during request submission:', err);
        newRequest.emailError = err.message;
      }
    }

    db.requests.unshift(newRequest);

    // Sync or update customer record
    const existingCust = db.customers.find(c => c.phone.replace(/\D/g, '') === phone.replace(/\D/g, ''));
    if (existingCust) {
      existingCust.requestCount += 1;
      existingCust.area = area || existingCust.area;
      existingCust.whatsapp = whatsapp || existingCust.whatsapp;
      if (customerEmail) existingCust.email = customerEmail;
    } else {
      db.customers.push({
        id: 'cust-' + Date.now(),
        name: customerName,
        phone,
        whatsapp: whatsapp || phone,
        email: customerEmail,
        area: area || 'Peshawar',
        requestCount: 1,
        completedCount: 0,
        createdAt: new Date().toISOString()
      });
    }

    saveDatabase(db);
    res.status(201).json({ success: true, request: newRequest });
  });

  app.put('/api/requests/:id', requireAdmin, async (req, res) => {
    const db = getDatabase();
    const index = db.requests.findIndex(r => r.id === req.params.id);
    if (index === -1) {
      return res.status(404).json({ error: 'Request not found' });
    }

    const previousStatus = db.requests[index].status;
    db.requests[index] = {
      ...db.requests[index],
      ...req.body,
      updatedAt: new Date().toISOString()
    };

    // If status transitioned to 'confirmed' or if explicitly requested, send confirmation email
    const isNowConfirmed = req.body.status === 'confirmed' && previousStatus !== 'confirmed';
    if ((isNowConfirmed || req.body.triggerConfirmationEmail) && db.requests[index].email) {
      try {
        const dummyBooking: Booking = {
          id: 'bkg-from-' + db.requests[index].id,
          requestId: db.requests[index].id,
          trackingId: db.requests[index].trackingId || db.requests[index].id,
          customerName: db.requests[index].customerName,
          email: db.requests[index].email,
          phone: db.requests[index].phone,
          whatsapp: db.requests[index].whatsapp,
          addressArea: db.requests[index].area,
          device: db.requests[index].deviceType,
          problem: db.requests[index].problemDescription,
          service: db.requests[index].requestedService,
          date: db.requests[index].preferredDate,
          time: db.requests[index].preferredTime,
          status: 'confirmed',
          technician: 'Safiullah (Head Tech)',
          price: 2000,
          paymentStatus: 'pending',
          notes: db.requests[index].adminNotes || '',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
        await sendAppointmentConfirmedEmail(dummyBooking);
        db.requests[index].emailSent = true;
      } catch (emailErr) {
        console.warn('Could not send confirmation email on request status change:', emailErr);
      }
    }

    saveDatabase(db);
    res.json(db.requests[index]);
  });

  app.post('/api/requests/:id/resend-email', requireAdmin, async (req, res) => {
    const db = getDatabase();
    const request = db.requests.find(r => r.id === req.params.id);
    if (!request) return res.status(404).json({ error: 'Request not found' });
    if (!request.email) return res.status(400).json({ error: 'No email address found on this request' });

    const result = await sendRequestReceivedEmail(request);
    if (result.success) {
      request.emailSent = true;
      delete request.emailError;
      saveDatabase(db);
      return res.json({ success: true, message: result.message || `Confirmation email sent for ${request.email}` });
    } else {
      return res.status(500).json({ error: result.error || 'Failed to send email via Resend' });
    }
  });

  app.delete('/api/requests/:id', requireAdmin, (req, res) => {
    const db = getDatabase();
    db.requests = db.requests.filter(r => r.id !== req.params.id);
    saveDatabase(db);
    res.json({ success: true, message: 'Request deleted permanently' });
  });

  // --- RESEND EMAIL DISPATCHER (Compatible with Vercel Serverless Function & Local Server) ---
  app.get('/api/send-email', (req, res) => {
    const apiKey = getActiveResendApiKey();
    const senderEmail = getActiveSenderEmail();
    const isCustomKey = !!process.env.RESEND_API_KEY?.trim();
    const maskedKey = apiKey ? `${apiKey.slice(0, 6)}...${apiKey.slice(-4)}` : 'Not configured';

    res.json({
      status: 'ok',
      service: 'TechFix Peshawar Email Dispatcher',
      environment: {
        hasResendKey: !!apiKey,
        keySource: isCustomKey ? 'Environment Variable (RESEND_API_KEY)' : 'Default / Settings Key',
        maskedKey,
        senderEmail,
        technicianEmail: 'techfixpeshawar@gmail.com',
        isSandboxDomain: senderEmail.toLowerCase().includes('@resend.dev'),
      }
    });
  });

  app.post('/api/send-email', async (req, res) => {
    try {
      const { type, ...payload } = req.body || {};

      if (type === 'test') {
        const result = await testResendConnection(payload.to);
        return res.status(result.success ? 200 : 500).json(result);
      }

      if (type === 'appointment_confirmed') {
        const result = await sendAppointmentConfirmedEmail(payload as any);
        return res.status(result.success ? 200 : 500).json(result);
      }

      if (type === 'custom') {
        const result = await sendCustomEmail(payload as any);
        return res.status(result.success ? 200 : 500).json(result);
      }

      // Default: request_received
      const result = await sendRequestReceivedEmail(payload as any);
      return res.status(result.success ? 200 : 500).json(result);
    } catch (err: any) {
      console.error('API send-email error:', err);
      return res.status(500).json({ success: false, error: err.message || 'Email dispatch failed' });
    }
  });

  app.all('/api/test-email', async (req, res) => {
    try {
      const target = req.query.to || req.body?.to;
      const result = await testResendConnection(typeof target === 'string' ? target : undefined);
      res.status(result.success ? 200 : 500).json(result);
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message || 'Test email error' });
    }
  });

  // --- BOOKINGS ---
  app.get('/api/bookings', requireAdmin, (req, res) => {
    const db = getDatabase();
    const list = [...db.bookings].sort((a, b) => new Date(b.date + ' ' + b.time).getTime() - new Date(a.date + ' ' + a.time).getTime());
    res.json(list);
  });

  app.post('/api/bookings', requireAdmin, async (req, res) => {
    const db = getDatabase();
    const trackingId = generateTrackingId();
    const newBooking: Booking = {
      id: 'bkg-' + Date.now(),
      requestId: req.body.requestId || '',
      trackingId,
      customerName: req.body.customerName || 'Customer',
      email: req.body.email || '',
      phone: req.body.phone || '',
      whatsapp: req.body.whatsapp || req.body.phone || '',
      addressArea: req.body.addressArea || 'Peshawar',
      device: req.body.device || 'PC',
      problem: req.body.problem || '',
      service: req.body.service || 'General Support',
      date: req.body.date || new Date().toISOString().split('T')[0],
      time: req.body.time || '12:00 PM',
      status: req.body.status || 'confirmed',
      technician: req.body.technician || 'Safiullah',
      price: req.body.price || 2000,
      paymentStatus: req.body.paymentStatus || 'pending',
      notes: req.body.notes || '',
      emailSent: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    // If status is confirmed and customer email exists, send appointment confirmed email
    if (newBooking.email && (newBooking.status === 'confirmed' || req.body.sendEmail)) {
      try {
        const emailRes = await sendAppointmentConfirmedEmail(newBooking);
        newBooking.emailSent = emailRes.success;
      } catch (err) {
        console.warn('Booking email send failed:', err);
      }
    }

    db.bookings.unshift(newBooking);

    // If linked to request, update request status
    if (newBooking.requestId) {
      const r = db.requests.find(reqItem => reqItem.id === newBooking.requestId);
      if (r) {
        r.status = 'confirmed';
        r.updatedAt = new Date().toISOString();
      }
    }

    saveDatabase(db);
    res.status(201).json(newBooking);
  });

  app.put('/api/bookings/:id', requireAdmin, async (req, res) => {
    const db = getDatabase();
    const index = db.bookings.findIndex(b => b.id === req.params.id);
    if (index === -1) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    const prevStatus = db.bookings[index].status;
    db.bookings[index] = {
      ...db.bookings[index],
      ...req.body,
      updatedAt: new Date().toISOString()
    };

    // If status transitioned to confirmed, or trigger email flag
    if ((req.body.status === 'confirmed' && prevStatus !== 'confirmed') || req.body.sendEmail) {
      if (db.bookings[index].email) {
        try {
          const emailRes = await sendAppointmentConfirmedEmail(db.bookings[index]);
          db.bookings[index].emailSent = emailRes.success;
        } catch (err) {
          console.warn('Booking update email failed:', err);
        }
      }
    }

    // If completed, update customer stats
    if (req.body.status === 'completed') {
      const cust = db.customers.find(c => c.phone.replace(/\D/g, '') === db.bookings[index].phone.replace(/\D/g, ''));
      if (cust) {
        cust.completedCount = (cust.completedCount || 0) + 1;
        cust.lastServiceDate = new Date().toISOString().split('T')[0];
      }
    }

    saveDatabase(db);
    res.json(db.bookings[index]);
  });

  app.post('/api/bookings/:id/resend-email', requireAdmin, async (req, res) => {
    const db = getDatabase();
    const bkg = db.bookings.find(b => b.id === req.params.id);
    if (!bkg) return res.status(404).json({ error: 'Booking not found' });
    if (!bkg.email) return res.status(400).json({ error: 'No email on this booking' });

    const result = await sendAppointmentConfirmedEmail(bkg);
    if (result.success) {
      bkg.emailSent = true;
      saveDatabase(db);
      return res.json({ success: true, message: result.message || `Confirmed schedule email sent for ${bkg.email}` });
    } else {
      return res.status(500).json({ error: result.error || 'Failed to send email' });
    }
  });

  app.delete('/api/bookings/:id', requireAdmin, (req, res) => {
    const db = getDatabase();
    db.bookings = db.bookings.filter(b => b.id !== req.params.id);
    saveDatabase(db);
    res.json({ success: true, message: 'Booking deleted' });
  });

  // --- CUSTOMERS ---
  app.get('/api/customers', requireAdmin, (req, res) => {
    const db = getDatabase();
    res.json(db.customers);
  });

  app.put('/api/customers/:id', requireAdmin, (req, res) => {
    const db = getDatabase();
    const index = db.customers.findIndex(c => c.id === req.params.id);
    if (index === -1) {
      return res.status(404).json({ error: 'Customer not found' });
    }
    db.customers[index] = { ...db.customers[index], ...req.body };
    saveDatabase(db);
    res.json(db.customers[index]);
  });

  app.post('/api/customers', requireAdmin, (req, res) => {
    const db = getDatabase();
    const newCust: Customer = {
      id: 'cust-' + Date.now(),
      name: req.body.name || 'New Customer',
      phone: req.body.phone || '',
      whatsapp: req.body.whatsapp || req.body.phone || '',
      email: req.body.email || '',
      area: req.body.area || 'Peshawar',
      notes: req.body.notes || '',
      requestCount: req.body.requestCount || 0,
      completedCount: req.body.completedCount || 0,
      createdAt: new Date().toISOString()
    };
    db.customers.unshift(newCust);
    saveDatabase(db);
    res.status(201).json(newCust);
  });

  app.delete('/api/customers/:id', requireAdmin, (req, res) => {
    const db = getDatabase();
    db.customers = db.customers.filter(c => c.id !== req.params.id);
    saveDatabase(db);
    res.json({ success: true, message: 'Customer record deleted' });
  });

  // --- FAQ ---
  app.get('/api/faq', (req, res) => {
    const db = getDatabase();
    const showAll = req.query.all === 'true';
    if (showAll) {
      return res.json(db.faq.sort((a, b) => a.displayOrder - b.displayOrder));
    }
    res.json(db.faq.filter(f => f.published).sort((a, b) => a.displayOrder - b.displayOrder));
  });

  app.post('/api/faq', requireAdmin, (req, res) => {
    const db = getDatabase();
    const isPub = req.body.isPublished !== undefined ? req.body.isPublished : req.body.published !== false;
    const newFaq: FAQItem & { isPublished?: boolean } = {
      id: 'faq-' + Date.now(),
      question: req.body.question || 'New Question',
      answer: req.body.answer || '',
      category: req.body.category || 'General',
      displayOrder: req.body.displayOrder || db.faq.length + 1,
      published: isPub,
      isPublished: isPub,
    };
    db.faq.push(newFaq as any);
    saveDatabase(db);
    res.status(201).json(newFaq);
  });

  app.put('/api/faq/:id', requireAdmin, (req, res) => {
    const db = getDatabase();
    const index = db.faq.findIndex(f => f.id === req.params.id);
    if (index === -1) {
      return res.status(404).json({ error: 'FAQ not found' });
    }
    const isPub = req.body.isPublished !== undefined ? req.body.isPublished : req.body.published;
    const updates = {
      ...req.body,
      ...(isPub !== undefined ? { published: isPub, isPublished: isPub } : {}),
    };
    db.faq[index] = { ...db.faq[index], ...updates };
    saveDatabase(db);
    res.json(db.faq[index]);
  });

  app.delete('/api/faq/:id', requireAdmin, (req, res) => {
    const db = getDatabase();
    db.faq = db.faq.filter(f => f.id !== req.params.id);
    saveDatabase(db);
    res.json({ success: true, message: 'FAQ deleted' });
  });

  // --- SERVICE AREAS ---
  app.get('/api/areas', (req, res) => {
    const db = getDatabase();
    res.json(db.areas.sort((a, b) => a.displayOrder - b.displayOrder));
  });

  app.post('/api/areas', requireAdmin, (req, res) => {
    const db = getDatabase();
    const newArea: ServiceArea = {
      id: 'area-' + Date.now(),
      name: req.body.name || 'New Area',
      status: req.body.status || 'active',
      travelFee: req.body.travelFee || 500,
      notes: req.body.notes || '',
      displayOrder: req.body.displayOrder || db.areas.length + 1
    };
    db.areas.push(newArea);
    saveDatabase(db);
    res.status(201).json(newArea);
  });

  app.put('/api/areas/:id', requireAdmin, (req, res) => {
    const db = getDatabase();
    const index = db.areas.findIndex(a => a.id === req.params.id);
    if (index === -1) {
      return res.status(404).json({ error: 'Area not found' });
    }
    db.areas[index] = { ...db.areas[index], ...req.body };
    saveDatabase(db);
    res.json(db.areas[index]);
  });

  app.delete('/api/areas/:id', requireAdmin, (req, res) => {
    const db = getDatabase();
    db.areas = db.areas.filter(a => a.id !== req.params.id);
    saveDatabase(db);
    res.json({ success: true, message: 'Area deleted' });
  });

  // --- REAL SERVICE CASES ---
  app.get('/api/cases', (req, res) => {
    const db = getDatabase();
    const showAll = req.query.all === 'true';
    if (showAll) {
      return res.json(db.cases);
    }
    res.json(db.cases.filter(c => c.published));
  });

  app.post('/api/cases', requireAdmin, (req, res) => {
    const db = getDatabase();
    const isPub = req.body.isPublished !== undefined ? req.body.isPublished : req.body.published !== false;
    const newCase: RealServiceCase & { isPublished?: boolean } = {
      id: 'case-' + Date.now(),
      title: req.body.title || 'Service Case',
      problem: req.body.problem || '',
      diagnosis: req.body.diagnosis || '',
      solution: req.body.solution || '',
      result: req.body.result || '',
      serviceType: req.body.serviceType || 'Troubleshooting',
      customerType: req.body.customerType || 'Home',
      beforeImage: req.body.beforeImage || '',
      afterImage: req.body.afterImage || '',
      date: req.body.date || new Date().toISOString().split('T')[0],
      published: isPub,
      isPublished: isPub,
      createdAt: new Date().toISOString()
    };
    db.cases.unshift(newCase as any);
    saveDatabase(db);
    res.status(201).json(newCase);
  });

  app.put('/api/cases/:id', requireAdmin, (req, res) => {
    const db = getDatabase();
    const index = db.cases.findIndex(c => c.id === req.params.id);
    if (index === -1) {
      return res.status(404).json({ error: 'Case not found' });
    }
    const isPub = req.body.isPublished !== undefined ? req.body.isPublished : req.body.published;
    const updates = {
      ...req.body,
      ...(isPub !== undefined ? { published: isPub, isPublished: isPub } : {}),
    };
    db.cases[index] = { ...db.cases[index], ...updates };
    saveDatabase(db);
    res.json(db.cases[index]);
  });

  app.delete('/api/cases/:id', requireAdmin, (req, res) => {
    const db = getDatabase();
    db.cases = db.cases.filter(c => c.id !== req.params.id);
    saveDatabase(db);
    res.json({ success: true, message: 'Case deleted' });
  });

  // --- MEDIA MANAGER ---
  app.get('/api/media', requireAdmin, (req, res) => {
    const db = getDatabase();
    res.json(db.media);
  });

  app.post('/api/media/upload', requireAdmin, (req, res) => {
    const { name, base64Data, altText, title } = req.body;
    if (!base64Data) {
      return res.status(400).json({ error: 'base64Data is required' });
    }

    try {
      // Extract content type and data
      const matches = base64Data.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
      let buffer: Buffer;
      let ext = '.png';

      if (matches && matches.length === 3) {
        const mimeType = matches[1];
        if (mimeType.includes('jpeg') || mimeType.includes('jpg')) ext = '.jpg';
        else if (mimeType.includes('webp')) ext = '.webp';
        buffer = Buffer.from(matches[2], 'base64');
      } else {
        buffer = Buffer.from(base64Data, 'base64');
      }

      const fileName = `upload_${Date.now()}${ext}`;
      const filePath = path.join(uploadsDir, fileName);
      fs.writeFileSync(filePath, buffer);

      const sizeKb = Math.round(buffer.length / 1024);
      const sizeStr = sizeKb > 1024 ? `${(sizeKb / 1024).toFixed(1)} MB` : `${sizeKb} KB`;
      const publicUrl = `/uploads/${fileName}`;

      const db = getDatabase();
      const newMedia: MediaItem = {
        id: 'med-' + Date.now(),
        name: name || fileName,
        url: publicUrl,
        size: sizeStr,
        altText: altText || name || 'Uploaded Image',
        title: title || name || 'Uploaded Image',
        createdAt: new Date().toISOString()
      };
      db.media.unshift(newMedia);
      saveDatabase(db);

      res.status(201).json(newMedia);
    } catch (err: any) {
      console.error('Upload error:', err);
      res.status(500).json({ error: 'Failed to save image file: ' + err.message });
    }
  });

  // Embed image via Cloudinary or web URL
  app.post('/api/media/embed', requireAdmin, (req, res) => {
    const { url, name, title, altText, setAsProfile } = req.body;
    if (!url || typeof url !== 'string' || !url.trim()) {
      return res.status(400).json({ error: 'Image URL is required' });
    }

    const trimmedUrl = url.trim();
    const db = getDatabase();

    const newMedia: MediaItem = {
      id: 'med-' + Date.now(),
      name: name || 'Cloudinary / Embedded Asset',
      url: trimmedUrl,
      size: 'External URL',
      altText: altText || name || 'Technician Media Asset',
      title: title || name || 'Technician Photo',
      createdAt: new Date().toISOString()
    };

    // Remove duplicates if same URL exists
    db.media = db.media.filter(m => m.url !== trimmedUrl);
    db.media.unshift(newMedia);

    if (setAsProfile) {
      db.settings.technicianPhoto = trimmedUrl;
    }

    saveDatabase(db);
    res.status(201).json({ success: true, media: newMedia, technicianPhoto: db.settings.technicianPhoto });
  });

  // Set or remove technician profile picture
  app.post('/api/media/set-profile', requireAdmin, (req, res) => {
    const { url } = req.body;
    const db = getDatabase();
    db.settings.technicianPhoto = url || '';
    saveDatabase(db);
    res.json({ success: true, technicianPhoto: db.settings.technicianPhoto });
  });

  app.delete('/api/media/:id', requireAdmin, (req, res) => {
    const db = getDatabase();
    const item = db.media.find(m => m.id === req.params.id);
    if (item && item.url.startsWith('/uploads/')) {
      const fileName = path.basename(item.url);
      const filePath = path.join(uploadsDir, fileName);
      if (fs.existsSync(filePath)) {
        try { fs.unlinkSync(filePath); } catch (e) { /* ignore */ }
      }
    }
    db.media = db.media.filter(m => m.id !== req.params.id);
    saveDatabase(db);
    res.json({ success: true, message: 'Media removed' });
  });

  // Static uploads directory
  app.use('/uploads', express.static(uploadsDir));

  // --- VITE MIDDLEWARE / SPA FALLBACK ---
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Peshawar Tech Support Server running on http://localhost:${PORT}`);
  });
}

startServer();
