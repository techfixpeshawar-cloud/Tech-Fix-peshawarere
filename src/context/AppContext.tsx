import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  Service,
  ServiceRequest,
  Booking,
  FAQItem,
  ServiceArea,
  RealServiceCase,
  WebsiteSettings,
  DashboardStats,
} from '../types';
import { api } from '../services/api';

interface AppContextType {
  // Public data
  settings: WebsiteSettings | null;
  services: Service[];
  faq: FAQItem[];
  faqs: FAQItem[]; // Convenient alias so destructuring { faqs } or { faq } both work
  areas: ServiceArea[];
  cases: RealServiceCase[];
  isLoading: boolean;
  error: string | null;
  refreshPublicData: () => Promise<void>;

  // Routing & View
  isAdminRoute: boolean;
  setIsAdminRoute: (val: boolean) => void;
  adminTab: string;
  setAdminTab: (tab: string) => void;
  isTrackingRoute: boolean;
  setIsTrackingRoute: (val: boolean) => void;
  trackingRefQuery: string;
  setTrackingRefQuery: (ref: string) => void;
  navigateToTrack: (refId?: string) => void;
  navigateToHome: () => void;
  selectedProblemForBooking: string;
  setSelectedProblemForBooking: (prob: string) => void;

  // Admin session
  isAdminAuthenticated: boolean;
  isAuthenticated: boolean; // Alias for ease of access in admin views
  adminUser: any;
  loginAdmin: (email: string, pass: string) => Promise<void>;
  logoutAdmin: () => void;

  // CRUD Operations
  addService: (service: Partial<Service>) => Promise<Service>;
  updateService: (id: string, updates: Partial<Service>) => Promise<Service>;
  deleteService: (id: string, permanent?: boolean) => Promise<void>;

  addFAQ: (item: Partial<FAQItem>) => Promise<FAQItem>;
  updateFAQ: (id: string, updates: Partial<FAQItem>) => Promise<FAQItem>;
  deleteFAQ: (id: string) => Promise<void>;

  addArea: (area: Partial<ServiceArea>) => Promise<ServiceArea>;
  updateArea: (id: string, updates: Partial<ServiceArea>) => Promise<ServiceArea>;
  deleteArea: (id: string) => Promise<void>;

  addCase: (caseItem: Partial<RealServiceCase>) => Promise<RealServiceCase>;
  updateCase: (id: string, updates: Partial<RealServiceCase>) => Promise<RealServiceCase>;
  deleteCase: (id: string) => Promise<void>;

  updateSettings: (newSettings: Partial<WebsiteSettings>) => Promise<WebsiteSettings>;
  deleteRequest: (id: string) => Promise<void>;

  // Helpers
  generateWhatsAppLink: (customMessage?: string, device?: string, problem?: string, area?: string) => string;
  submitServiceRequest: (request: Partial<ServiceRequest>) => Promise<ServiceRequest>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<WebsiteSettings | null>(null);
  const [services, setServices] = useState<Service[]>([]);
  const [faq, setFaq] = useState<FAQItem[]>([]);
  const [areas, setAreas] = useState<ServiceArea[]>([]);
  const [cases, setCases] = useState<RealServiceCase[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Check URL hash for admin or track
  const [isAdminRoute, setIsAdminRoute] = useState<boolean>(() => {
    return window.location.hash.startsWith('#admin') || window.location.pathname.startsWith('/admin');
  });
  const [adminTab, setAdminTab] = useState<string>('dashboard');
  const [isTrackingRoute, setIsTrackingRoute] = useState<boolean>(() => {
    return window.location.hash.startsWith('#track') || window.location.pathname.startsWith('/track');
  });
  const [trackingRefQuery, setTrackingRefQuery] = useState<string>(() => {
    const hash = window.location.hash;
    if (hash.startsWith('#track/')) {
      return decodeURIComponent(hash.replace('#track/', ''));
    }
    const params = new URLSearchParams(window.location.search);
    return params.get('ref') || params.get('track') || '';
  });
  const [selectedProblemForBooking, setSelectedProblemForBooking] = useState<string>('');

  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState<boolean>(() => {
    return api.isAuthenticated();
  });
  const [adminUser, setAdminUser] = useState<any>(() => api.getStoredUser());

  const navigateToTrack = useCallback((refId?: string) => {
    setIsAdminRoute(false);
    setIsTrackingRoute(true);
    if (refId) {
      setTrackingRefQuery(refId);
      window.location.hash = `#track/${encodeURIComponent(refId)}`;
    } else {
      window.location.hash = '#track';
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const navigateToHome = useCallback(() => {
    setIsAdminRoute(false);
    setIsTrackingRoute(false);
    setTrackingRefQuery('');
    window.location.hash = '';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  // Listen to hash changes for smooth navigation
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash;
      if (hash.startsWith('#admin')) {
        setIsAdminRoute(true);
        setIsTrackingRoute(false);
        const parts = hash.split('/');
        if (parts[1]) {
          setAdminTab(parts[1]);
        }
      } else if (hash.startsWith('#track')) {
        setIsTrackingRoute(true);
        setIsAdminRoute(false);
        const parts = hash.split('/');
        if (parts[1]) {
          setTrackingRefQuery(decodeURIComponent(parts[1]));
        }
      } else {
        setIsAdminRoute(false);
        setIsTrackingRoute(false);
      }
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const refreshPublicData = useCallback(async () => {
    try {
      setIsLoading(true);
      // Fetch all items so admin panels and drafts/unpublished tab never lose items
      const [sett, srvs, fqs, ars, cs] = await Promise.all([
        api.getSettings(),
        api.getServices(true),
        api.getFAQ(true),
        api.getAreas(),
        api.getCases(true),
      ]);
      setSettings(sett);
      setServices(srvs);
      setFaq(fqs);
      setAreas(ars);
      setCases(cs);
      setError(null);
    } catch (err: any) {
      console.error('Failed to load initial data:', err);
      setError('Unable to connect to server. Retrying...');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshPublicData();
  }, [refreshPublicData]);

  const loginAdmin = async (email: string, pass: string) => {
    const data = await api.login(email, pass);
    setIsAdminAuthenticated(true);
    setAdminUser(data.user);
    await refreshPublicData();
  };

  const logoutAdmin = () => {
    api.logout();
    setIsAdminAuthenticated(false);
    setAdminUser(null);
    setIsAdminRoute(false);
    window.location.hash = '#';
  };

  const generateWhatsAppLink = (customMessage?: string, device?: string, problem?: string, area?: string) => {
    const rawNumber = settings?.whatsappNumber || '+923129876543';
    // Clean to digits only for wa.me
    const cleanNumber = rawNumber.replace(/\D/g, '');
    let text = '';

    if (customMessage) {
      text = customMessage;
    } else {
      text = `Hello Safiullah! I need on-site computer support in Peshawar.\n` +
        `• Device: ${device || 'PC / Laptop'}\n` +
        `• Problem: ${problem || 'Computer requires troubleshooting'}\n` +
        `• Area: ${area || 'Peshawar'}\n` +
        `Please let me know when you are available for an on-site visit.`;
    }

    return `https://wa.me/${cleanNumber}?text=${encodeURIComponent(text)}`;
  };

  const submitServiceRequest = async (request: Partial<ServiceRequest>) => {
    const res = await api.submitRequest(request);
    return res.request;
  };

  // CRUD Implementations
  const addService = async (newSrv: Partial<Service>) => {
    const created = await api.createService(newSrv);
    setServices(prev => [...prev, created]);
    return created;
  };

  const updateService = async (id: string, updates: Partial<Service>) => {
    const updated = await api.updateService(id, updates);
    setServices(prev => prev.map(s => s.id === id ? updated : s));
    return updated;
  };

  const deleteService = async (id: string, permanent?: boolean) => {
    await api.deleteService(id, permanent);
    setServices(prev => prev.filter(s => s.id !== id));
  };

  const addFAQ = async (item: Partial<FAQItem>) => {
    const created = await api.createFAQ(item);
    setFaq(prev => [...prev, created]);
    return created;
  };

  const updateFAQ = async (id: string, updates: Partial<FAQItem>) => {
    const updated = await api.updateFAQ(id, updates);
    setFaq(prev => prev.map(f => f.id === id ? updated : f));
    return updated;
  };

  const deleteFAQ = async (id: string) => {
    await api.deleteFAQ(id);
    setFaq(prev => prev.filter(f => f.id !== id));
  };

  const addArea = async (area: Partial<ServiceArea>) => {
    const created = await api.createArea(area);
    setAreas(prev => [...prev, created]);
    return created;
  };

  const updateArea = async (id: string, updates: Partial<ServiceArea>) => {
    const updated = await api.updateArea(id, updates);
    setAreas(prev => prev.map(a => a.id === id ? updated : a));
    return updated;
  };

  const deleteArea = async (id: string) => {
    await api.deleteArea(id);
    setAreas(prev => prev.filter(a => a.id !== id));
  };

  const addCase = async (caseItem: Partial<RealServiceCase>) => {
    const created = await api.createCase(caseItem);
    setCases(prev => [created, ...prev]);
    return created;
  };

  const updateCase = async (id: string, updates: Partial<RealServiceCase>) => {
    const updated = await api.updateCase(id, updates);
    setCases(prev => prev.map(c => c.id === id ? updated : c));
    return updated;
  };

  const deleteCase = async (id: string) => {
    await api.deleteCase(id);
    setCases(prev => prev.filter(c => c.id !== id));
  };

  const updateSettings = async (newSettings: Partial<WebsiteSettings>) => {
    const updated = await api.updateSettings(newSettings);
    setSettings(updated);
    return updated;
  };

  const deleteRequest = async (id: string) => {
    await api.deleteRequest(id);
  };

  return (
    <AppContext.Provider
      value={{
        settings,
        services,
        faq,
        faqs: faq,
        areas,
        cases,
        isLoading,
        error,
        refreshPublicData,
        isAdminRoute,
        setIsAdminRoute,
        adminTab,
        setAdminTab,
        isTrackingRoute,
        setIsTrackingRoute,
        trackingRefQuery,
        setTrackingRefQuery,
        navigateToTrack,
        navigateToHome,
        selectedProblemForBooking,
        setSelectedProblemForBooking,
        isAdminAuthenticated,
        isAuthenticated: isAdminAuthenticated,
        adminUser,
        loginAdmin,
        logoutAdmin,
        addService,
        updateService,
        deleteService,
        addFAQ,
        updateFAQ,
        deleteFAQ,
        addArea,
        updateArea,
        deleteArea,
        addCase,
        updateCase,
        deleteCase,
        updateSettings,
        deleteRequest,
        generateWhatsAppLink,
        submitServiceRequest,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
