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
  DashboardStats,
} from '../types';

const API_BASE = '/api';

function getAuthHeaders(): HeadersInit {
  const token = localStorage.getItem('techfix_admin_token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {})
  };
}

export const api = {
  // --- Auth ---
  async login(email: string, password: string) {
    let data: any = null;
    try {
      const res = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim(), password: password.trim() })
      });
      if (res.ok) {
        data = await res.json();
      }
    } catch {
      // Network/static server fallback
    }

    // Direct fallback verification for authorized admin Safiullah
    const trimmedEmail = email.trim().toLowerCase();
    const trimmedPass = password.trim();
    if (!data && trimmedEmail === 'techfixpeshawar@gmail.com' && (trimmedPass === 'Safiullah@12' || trimmedPass === 'Safiullah12')) {
      data = {
        success: true,
        token: 'admin_session_' + btoa(`${trimmedEmail}:${Date.now()}`),
        user: {
          email: 'techfixpeshawar@gmail.com',
          name: 'Safiullah',
          role: 'Administrator',
          institution: 'University of Agriculture, Peshawar'
        }
      };
    }

    if (!data) {
      throw new Error('Invalid email or password. Use Safiullah@12 with techfixpeshawar@gmail.com');
    }

    localStorage.setItem('techfix_admin_token', data.token);
    localStorage.setItem('techfix_admin_user', JSON.stringify(data.user));
    return data;
  },

  logout() {
    localStorage.removeItem('techfix_admin_token');
    localStorage.removeItem('techfix_admin_user');
  },

  getStoredUser() {
    try {
      const user = localStorage.getItem('techfix_admin_user');
      return user ? JSON.parse(user) : null;
    } catch {
      return null;
    }
  },

  isAuthenticated() {
    return !!localStorage.getItem('techfix_admin_token');
  },

  async updatePassword(currentPassword: string, newPassword: string) {
    const res = await fetch(`${API_BASE}/auth/update-password`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ currentPassword, newPassword })
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ error: 'Update failed' }));
      throw new Error(err.error || 'Update failed');
    }
    return res.json();
  },

  // --- Stats ---
  async getStats(): Promise<DashboardStats> {
    const res = await fetch(`${API_BASE}/stats`);
    if (!res.ok) throw new Error('Failed to fetch stats');
    return res.json();
  },

  // --- Settings ---
  async getSettings(): Promise<WebsiteSettings> {
    const res = await fetch(`${API_BASE}/settings`);
    if (!res.ok) throw new Error('Failed to fetch settings');
    return res.json();
  },

  async updateSettings(settings: Partial<WebsiteSettings>): Promise<WebsiteSettings> {
    const res = await fetch(`${API_BASE}/settings`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(settings)
    });
    if (!res.ok) throw new Error('Failed to update settings');
    const data = await res.json();
    return data.settings;
  },

  // --- Services ---
  async getServices(all = false): Promise<Service[]> {
    const res = await fetch(`${API_BASE}/services${all ? '?all=true' : ''}`);
    if (!res.ok) throw new Error('Failed to fetch services');
    return res.json();
  },

  async createService(service: Partial<Service>): Promise<Service> {
    const res = await fetch(`${API_BASE}/services`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(service)
    });
    if (!res.ok) throw new Error('Failed to create service');
    return res.json();
  },

  async updateService(id: string, service: Partial<Service>): Promise<Service> {
    const res = await fetch(`${API_BASE}/services/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(service)
    });
    if (!res.ok) throw new Error('Failed to update service');
    return res.json();
  },

  async deleteService(id: string, permanent = false): Promise<void> {
    const res = await fetch(`${API_BASE}/services/${id}${permanent ? '?permanent=true' : ''}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    if (!res.ok) throw new Error('Failed to delete service');
  },

  // --- Requests ---
  async getRequests(): Promise<ServiceRequest[]> {
    const res = await fetch(`${API_BASE}/requests`, {
      headers: getAuthHeaders()
    });
    if (!res.ok) throw new Error('Failed to fetch requests');
    return res.json();
  },

  async submitRequest(request: Partial<ServiceRequest>): Promise<{ success: boolean; request: ServiceRequest }> {
    const res = await fetch(`${API_BASE}/requests`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(request)
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ error: 'Failed to submit' }));
      throw new Error(err.error || 'Failed to submit request');
    }
    return res.json();
  },

  async updateRequest(id: string, updates: Partial<ServiceRequest>): Promise<ServiceRequest> {
    const res = await fetch(`${API_BASE}/requests/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(updates)
    });
    if (!res.ok) throw new Error('Failed to update request');
    return res.json();
  },

  async deleteRequest(id: string): Promise<void> {
    const res = await fetch(`${API_BASE}/requests/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    if (!res.ok) throw new Error('Failed to delete request');
  },

  async resendRequestEmail(id: string): Promise<{ success: boolean; message: string }> {
    const res = await fetch(`${API_BASE}/requests/${id}/resend-email`, {
      method: 'POST',
      headers: getAuthHeaders()
    });
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      throw new Error(data.error || 'Failed to resend confirmation email');
    }
    return res.json();
  },

  // --- Bookings ---
  async getBookings(): Promise<Booking[]> {
    const res = await fetch(`${API_BASE}/bookings`, {
      headers: getAuthHeaders()
    });
    if (!res.ok) throw new Error('Failed to fetch bookings');
    return res.json();
  },

  async createBooking(booking: Partial<Booking>): Promise<Booking> {
    const res = await fetch(`${API_BASE}/bookings`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(booking)
    });
    if (!res.ok) throw new Error('Failed to create booking');
    return res.json();
  },

  async updateBooking(id: string, updates: Partial<Booking>): Promise<Booking> {
    const res = await fetch(`${API_BASE}/bookings/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(updates)
    });
    if (!res.ok) throw new Error('Failed to update booking');
    return res.json();
  },

  async deleteBooking(id: string): Promise<void> {
    const res = await fetch(`${API_BASE}/bookings/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    if (!res.ok) throw new Error('Failed to delete booking');
  },

  async resendBookingEmail(id: string): Promise<{ success: boolean; message: string }> {
    const res = await fetch(`${API_BASE}/bookings/${id}/resend-email`, {
      method: 'POST',
      headers: getAuthHeaders()
    });
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      throw new Error(data.error || 'Failed to resend confirmation email');
    }
    return res.json();
  },

  // --- Customers ---
  async getCustomers(): Promise<Customer[]> {
    const res = await fetch(`${API_BASE}/customers`, {
      headers: getAuthHeaders()
    });
    if (!res.ok) throw new Error('Failed to fetch customers');
    return res.json();
  },

  async createCustomer(customer: Partial<Customer>): Promise<Customer> {
    const res = await fetch(`${API_BASE}/customers`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(customer)
    });
    if (!res.ok) throw new Error('Failed to create customer');
    return res.json();
  },

  async updateCustomer(id: string, updates: Partial<Customer>): Promise<Customer> {
    const res = await fetch(`${API_BASE}/customers/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(updates)
    });
    if (!res.ok) throw new Error('Failed to update customer');
    return res.json();
  },

  async deleteCustomer(id: string): Promise<void> {
    const res = await fetch(`${API_BASE}/customers/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    if (!res.ok) throw new Error('Failed to delete customer');
  },

  // --- FAQ ---
  async getFAQ(all = false): Promise<FAQItem[]> {
    const res = await fetch(`${API_BASE}/faq${all ? '?all=true' : ''}`);
    if (!res.ok) throw new Error('Failed to fetch FAQ');
    return res.json();
  },

  async createFAQ(item: Partial<FAQItem>): Promise<FAQItem> {
    const res = await fetch(`${API_BASE}/faq`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(item)
    });
    if (!res.ok) throw new Error('Failed to create FAQ');
    return res.json();
  },

  async updateFAQ(id: string, updates: Partial<FAQItem>): Promise<FAQItem> {
    const res = await fetch(`${API_BASE}/faq/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(updates)
    });
    if (!res.ok) throw new Error('Failed to update FAQ');
    return res.json();
  },

  async deleteFAQ(id: string): Promise<void> {
    const res = await fetch(`${API_BASE}/faq/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    if (!res.ok) throw new Error('Failed to delete FAQ');
  },

  // --- Areas ---
  async getAreas(): Promise<ServiceArea[]> {
    const res = await fetch(`${API_BASE}/areas`);
    if (!res.ok) throw new Error('Failed to fetch service areas');
    return res.json();
  },

  async createArea(area: Partial<ServiceArea>): Promise<ServiceArea> {
    const res = await fetch(`${API_BASE}/areas`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(area)
    });
    if (!res.ok) throw new Error('Failed to create area');
    return res.json();
  },

  async updateArea(id: string, updates: Partial<ServiceArea>): Promise<ServiceArea> {
    const res = await fetch(`${API_BASE}/areas/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(updates)
    });
    if (!res.ok) throw new Error('Failed to update area');
    return res.json();
  },

  async deleteArea(id: string): Promise<void> {
    const res = await fetch(`${API_BASE}/areas/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    if (!res.ok) throw new Error('Failed to delete area');
  },

  // --- Cases ---
  async getCases(all = false): Promise<RealServiceCase[]> {
    const res = await fetch(`${API_BASE}/cases${all ? '?all=true' : ''}`);
    if (!res.ok) throw new Error('Failed to fetch service cases');
    return res.json();
  },

  async createCase(c: Partial<RealServiceCase>): Promise<RealServiceCase> {
    const res = await fetch(`${API_BASE}/cases`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(c)
    });
    if (!res.ok) throw new Error('Failed to create service case');
    return res.json();
  },

  async updateCase(id: string, updates: Partial<RealServiceCase>): Promise<RealServiceCase> {
    const res = await fetch(`${API_BASE}/cases/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(updates)
    });
    if (!res.ok) throw new Error('Failed to update service case');
    return res.json();
  },

  async deleteCase(id: string): Promise<void> {
    const res = await fetch(`${API_BASE}/cases/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    if (!res.ok) throw new Error('Failed to delete service case');
  },

  // --- Tracking ---
  async trackRequest(query: string): Promise<any> {
    const res = await fetch(`${API_BASE}/track/${encodeURIComponent(query.trim())}`);
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Tracking record not found');
    }
    return res.json();
  },

  // --- Media ---
  async getMedia(): Promise<MediaItem[]> {
    const res = await fetch(`${API_BASE}/media`, {
      headers: getAuthHeaders()
    });
    if (!res.ok) throw new Error('Failed to fetch media');
    return res.json();
  },

  async uploadMedia(base64Data: string, name: string, altText?: string, title?: string): Promise<MediaItem> {
    const res = await fetch(`${API_BASE}/media/upload`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ base64Data, name, altText, title })
    });
    if (!res.ok) throw new Error('Failed to upload image');
    return res.json();
  },

  async embedMedia(payload: {
    url: string;
    name?: string;
    altText?: string;
    title?: string;
    setAsProfile?: boolean;
  }): Promise<{ success: boolean; media: MediaItem; technicianPhoto: string }> {
    const res = await fetch(`${API_BASE}/media/embed`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(payload)
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Failed to embed image link');
    }
    return res.json();
  },

  async setTechnicianProfilePhoto(url: string): Promise<{ success: boolean; technicianPhoto: string }> {
    const res = await fetch(`${API_BASE}/media/set-profile`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ url })
    });
    if (!res.ok) throw new Error('Failed to update technician photo');
    return res.json();
  },

  async deleteMedia(id: string): Promise<void> {
    const res = await fetch(`${API_BASE}/media/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    if (!res.ok) throw new Error('Failed to delete media');
  },

  // --- Email Service Testing & Dispatch ---
  async testEmail(targetEmail?: string): Promise<{ success: boolean; message?: string; error?: string }> {
    const res = await fetch(`${API_BASE}/test-email`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ to: targetEmail })
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      throw new Error(data.error || 'Failed to send test email');
    }
    return data;
  },

  async sendEmail(payload: {
    type?: string;
    to?: string;
    customerName?: string;
    service?: string;
    area?: string;
    problem?: string;
    phone?: string;
    date?: string;
    time?: string;
    subject?: string;
    html?: string;
  }): Promise<{ success: boolean; trackingId?: string; error?: string }> {
    const res = await fetch(`${API_BASE}/send-email`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      throw new Error(data.error || 'Failed to dispatch email');
    }
    return data;
  }
};

