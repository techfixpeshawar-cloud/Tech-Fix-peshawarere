export type ServiceCategory =
  | 'Windows'
  | 'Troubleshooting'
  | 'Data Recovery'
  | 'SSD / OS Migration'
  | 'Office Services'
  | 'Software Setup'
  | 'Account Recovery'
  | 'Bulk Deployment';

export type ServiceStatus = 'draft' | 'published' | 'unpublished' | 'archived';
export type PriceType = 'starting' | 'fixed' | 'quote' | 'diagnostic';
export type TargetCustomer = 'all' | 'student' | 'home' | 'office' | 'bulk';

export interface Service {
  id: string;
  name: string;
  shortDescription: string;
  fullDescription: string;
  icon: string;
  coverImage?: string;
  startingPrice: number | string;
  priceType: PriceType;
  serviceDuration: string;
  category: ServiceCategory;
  targetCustomer: TargetCustomer;
  status: ServiceStatus;
  published?: boolean;
  isPublished?: boolean;
  displayOrder: number;
  featured: boolean;
  seoTitle?: string;
  seoDescription?: string;
  workflowSteps?: string[];
  keyPoints?: string[];
  warningMessage?: string;
}

export type RequestStatus =
  | 'new'
  | 'contacted'
  | 'appointment_requested'
  | 'confirmed'
  | 'in_progress'
  | 'waiting_for_parts'
  | 'completed'
  | 'cancelled'
  | 'rejected'
  | 'archived';

export type UrgencyLevel = 'normal' | 'high' | 'urgent';
export type DeviceType = 'laptop' | 'desktop' | 'all-in-one' | 'other';

export interface ServiceRequest {
  id: string;
  trackingId?: string;
  customerName: string;
  email?: string;
  phone: string;
  whatsapp: string;
  area: string;
  deviceType: DeviceType;
  computerBrandModel: string;
  operatingSystem: string;
  requestedService: string;
  problemDescription: string;
  importantData: boolean;
  preferredDate: string;
  preferredTime: string;
  urgency: UrgencyLevel;
  status: RequestStatus;
  adminNotes?: string;
  emailSent?: boolean;
  emailError?: string;
  createdAt: string;
  updatedAt: string;
}

export type BookingStatus =
  | 'requested'
  | 'pending'
  | 'confirmed'
  | 'on_the_way'
  | 'in_progress'
  | 'completed'
  | 'cancelled'
  | 'no_show';

export type PaymentStatus = 'pending' | 'paid' | 'waived';

export interface Booking {
  id: string;
  requestId?: string;
  trackingId?: string;
  customerName: string;
  email?: string;
  phone: string;
  whatsapp: string;
  addressArea: string;
  device: string;
  problem: string;
  service: string;
  date: string;
  time: string;
  status: BookingStatus;
  technician: string;
  price: number | string;
  paymentStatus: PaymentStatus;
  notes?: string;
  emailSent?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Customer {
  id: string;
  name: string;
  phone: string;
  whatsapp: string;
  email?: string;
  area: string;
  notes?: string;
  requestCount: number;
  completedCount: number;
  totalRequests?: number;
  completedVisits?: number;
  lastServiceDate?: string;
  createdAt: string;
}

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: string;
  displayOrder?: number;
  published?: boolean;
  isPublished?: boolean;
}

export interface ServiceArea {
  id: string;
  name: string;
  status: 'active' | 'inactive';
  active?: boolean;
  travelFee: number;
  notes: string;
  displayOrder?: number;
}

export interface RealServiceCase {
  id: string;
  title: string;
  problem: string;
  diagnosis: string;
  solution: string;
  result: string;
  serviceType: string;
  customerType?: string;
  beforeImage?: string;
  afterImage?: string;
  date: string;
  published?: boolean;
  isPublished?: boolean;
  createdAt?: string;
}

export type ServiceCase = RealServiceCase;

export interface MediaItem {
  id: string;
  name: string;
  url: string;
  size: string;
  altText: string;
  title: string;
  createdAt: string;
}

export interface SectionVisibility {
  hero: boolean;
  whyOnSite: boolean;
  problemSelector: boolean;
  services: boolean;
  bulkDeployment: boolean;
  realCases: boolean;
  technicianBio: boolean;
  serviceAreas: boolean;
  faqs: boolean;
  whoWeServe: boolean;
  trust: boolean;
  requestForm: boolean;
}

export interface DiagnosticProblem {
  id: string;
  title: string;
  subtitle: string;
  serviceName: string;
  urgency: 'normal' | 'high' | 'urgent';
  icon?: string;
  accent?: string;
  published?: boolean;
  displayOrder?: number;
}

export interface HowItWorksStep {
  id: string;
  stepNumber: string;
  title: string;
  desc: string;
  icon?: string;
  color?: string;
  bg?: string;
  displayOrder?: number;
}

export interface WhyOnSitePoint {
  id: string;
  category: 'shop' | 'onsite'; // 'shop' = The Old Way, 'onsite' = Our Method
  title: string;
  description: string;
  icon?: string;
  displayOrder?: number;
}

export interface AudienceCard {
  id: string;
  badge: string;
  title: string;
  subtitle: string;
  description: string;
  perks: string[];
  icon?: string;
  color?: string;
  displayOrder?: number;
}

export interface TrustRule {
  id: string;
  title: string;
  description: string;
  icon?: string;
  displayOrder?: number;
}

export interface InstitutionalDeployment {
  id: string;
  title: string;
  pcRange: string;
  description: string;
  displayOrder?: number;
}

export interface WebsiteSettings {
  businessName: string;
  tagline: string;
  phone: string;
  whatsappNumber: string;
  whatsappDefaultMsg: string;
  email: string;
  location: string;
  businessHours: string;
  onSiteVisitFee: number;
  diagnosticFee?: number;
  baseVisitFee?: number;
  heroHeadline: string;
  heroSubtitle: string;
  heroDescription: string;
  primaryButtonText: string;
  primaryButtonLink: string;
  secondaryButtonText: string;
  secondaryButtonLink: string;
  heroBadge: string;
  technicianName: string;
  technicianTitle: string;
  technicianExperience: string;
  technicianBio: string;
  technicianPhoto: string;
  technicianDisplay: boolean;
  bulkServiceTitle: string;
  bulkServiceDescription: string;
  bulkServiceMinPCs: number;
  bulkServicePricingNote: string;
  footerCopyright: string;
  footerDescription: string;
  seoTitle: string;
  seoDescription: string;
  emergencyAvailable: boolean;
  maintenanceMode: boolean;
  pagePublished?: boolean; // false = unpublish public page / offline notice
  sectionVisibility?: Partial<SectionVisibility>;
  sectionTitles?: {
    services?: string;
    technician?: string;
    bulk?: string;
    cases?: string;
    areas?: string;
    faq?: string;
    whyOnSite?: string;
    problems?: string;
  };
  // Section-wise CMS content
  diagnosticProblems?: DiagnosticProblem[];
  howItWorksSteps?: HowItWorksStep[];
  whyOnSitePoints?: WhyOnSitePoint[];
  audienceCards?: AudienceCard[];
  trustRules?: TrustRule[];
  institutionalDeployments?: InstitutionalDeployment[];
  resendApiKey?: string;
  resendSenderEmail?: string;
}

export interface TrackingResult {
  found: boolean;
  trackingId?: string;
  type?: 'request' | 'booking';
  customerName?: string;
  service?: string;
  status?: string;
  statusLabel?: string;
  scheduledDate?: string;
  scheduledTime?: string;
  confirmedDate?: string;
  confirmedTime?: string;
  area?: string;
  device?: string;
  technician?: string;
  technicianPhone?: string;
  stepIndex?: number;
  notes?: string;
  updatedAt?: string;
  emailSent?: boolean;
}

export interface DashboardStats {
  totalServices: number;
  activeServices: number;
  newRequests: number;
  pendingBookings: number;
  confirmedBookings: number;
  completedJobs: number;
  faqItems: number;
  publishedCases: number;
}
