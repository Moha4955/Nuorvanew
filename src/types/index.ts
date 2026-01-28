export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'participant' | 'support_worker' | 'admin' | 'shift_coordinator' | 'financial_admin' | 'compliance_officer';
  profileComplete: boolean;
  createdAt: Date;
  lastLoginAt?: Date;
  isActive: boolean;
  avatar?: string;
  permissions: Permission[];
  department?: string;
  managerId?: string;
}

export interface Permission {
  id: string;
  name: string;
  description: string;
  category: 'shifts' | 'financial' | 'compliance' | 'participants' | 'workers' | 'system';
}

export interface AdminRole {
  id: string;
  name: string;
  description: string;
  permissions: Permission[];
  level: number; // 1 = lowest access, 5 = highest access
}

export interface Shift {
  id: string;
  serviceRequestId: string;
  participantId: string;
  workerId?: string;
  title: string;
  description: string;
  serviceCategory: SupportCategory;
  scheduledDate: Date;
  scheduledStartTime: string;
  scheduledEndTime: string;
  actualStartTime?: string;
  actualEndTime?: string;
  duration: number; // scheduled duration in hours
  actualDuration?: number; // actual duration in hours
  location: ServiceLocation;
  status: ShiftStatus;
  urgency: 'low' | 'medium' | 'high' | 'urgent';
  riskLevel: 'low' | 'medium' | 'high';
  requirements: ServiceRequirement[];
  estimatedCost: number;
  actualCost?: number;
  createdAt: Date;
  updatedAt: Date;
  assignedAt?: Date;
  assignedBy?: string;
  confirmedAt?: Date;
  completedAt?: Date;
  cancelledAt?: Date;
  cancellationReason?: string;
  adminNotes?: string;
  workerNotes?: string;
  participantFeedback?: ParticipantFeedback;
  isRecurring: boolean;
  recurringShiftId?: string;
  parentShiftId?: string;
}

export interface RecurringShift {
  id: string;
  serviceRequestId: string;
  participantId: string;
  workerId?: string;
  title: string;
  description: string;
  serviceCategory: SupportCategory;
  recurrencePattern: RecurrencePattern;
  startDate: Date;
  endDate?: Date;
  scheduledStartTime: string;
  scheduledEndTime: string;
  duration: number;
  location: ServiceLocation;
  requirements: ServiceRequirement[];
  estimatedCostPerShift: number;
  status: 'active' | 'paused' | 'completed' | 'cancelled';
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
  assignedBy?: string;
  adminNotes?: string;
  generatedShifts: string[]; // Array of shift IDs
}

export interface RecurrencePattern {
  type: 'daily' | 'weekly' | 'monthly';
  interval: number; // e.g., every 2 weeks
  daysOfWeek?: number[]; // 0-6 for Sunday-Saturday
  dayOfMonth?: number; // for monthly recurrence
  endAfter?: number; // number of occurrences
  endDate?: Date;
}

export interface Timesheet {
  id: string;
  shiftId: string;
  workerId: string;
  participantId: string;
  serviceDate: Date;
  scheduledStartTime: string;
  scheduledEndTime: string;
  actualStartTime: string;
  actualEndTime: string;
  totalHours: number;
  breakTime: number; // in hours
  billableHours: number;
  travelTime?: number; // in minutes
  travelDistance?: number; // in kilometers
  serviceNotes: string;
  participantSignature?: string;
  workerSignature: string;
  status: TimesheetStatus;
  submittedAt: Date;
  reviewedAt?: Date;
  reviewedBy?: string;
  approvedAt?: Date;
  approvedBy?: string;
  rejectedAt?: Date;
  rejectedBy?: string;
  rejectionReason?: string;
  schadsCalculation: SchadsCalculation;
  invoiceId?: string;
}

export interface SchadsCalculation {
  classification: string;
  baseRate: number;
  regularHours: number;
  regularPay: number;
  penalties: PenaltyCalculation[];
  allowances: AllowanceCalculation[];
  totalPenalties: number;
  totalAllowances: number;
  grossPay: number;
  gstAmount: number;
  totalPay: number;
  calculatedAt: Date;
  calculatedBy: string;
}

export interface PenaltyCalculation {
  type: 'evening' | 'night' | 'weekend' | 'public_holiday' | 'overtime';
  hours: number;
  rate: number;
  multiplier: number;
  amount: number;
  description: string;
}

export interface AllowanceCalculation {
  type: 'travel' | 'meal' | 'accommodation' | 'equipment' | 'phone';
  amount: number;
  description: string;
  calculation?: string; // e.g., "25km × $0.85/km"
}

export interface ParticipantFeedback {
  rating: number; // 1-5
  comment?: string;
  categories: FeedbackCategory[];
  wouldRecommend: boolean;
  submittedAt: Date;
}

export interface FeedbackCategory {
  category: 'punctuality' | 'professionalism' | 'communication' | 'service_quality' | 'safety';
  rating: number; // 1-5
}

export type ShiftStatus = 
  | 'pending_assignment'
  | 'assigned'
  | 'pending_worker_confirmation'
  | 'confirmed'
  | 'in_progress'
  | 'completed'
  | 'cancelled'
  | 'no_show'
  | 'disputed';

export type TimesheetStatus = 
  | 'draft'
  | 'submitted'
  | 'under_review'
  | 'approved'
  | 'rejected'
  | 'requires_clarification';

// Enhanced Invoice with NDIS compliance
export interface ParticipantProfile {
  id: string;
  userId: string;
  ndisNumber: string;
  planStartDate: Date;
  planEndDate: Date;
  planManagerName?: string;
  planManagerEmail?: string;
  planManagerPhone?: string;
  address: string;
  suburb: string;
  state: string;
  postcode: string;
  phone: string;
  emergencyContact: {
    name: string;
    phone: string;
    relationship: string;
    address?: string;
  };
  communicationPreferences: CommunicationPreference[];
  supportCategories: SupportCategory[];
  accessibilityNeeds: string[];
  medicalInformation?: string;
  currentBudget: {
    totalBudget: number;
    usedBudget: number;
    remainingBudget: number;
    coreSupports: number;
    capacityBuilding: number;
    capitalSupports: number;
  };
  riskAssessment?: RiskAssessment;
}

export interface SupportWorkerProfile {
  id: string;
  userId: string;
  abn: string;
  businessName?: string;
  hourlyRate: number;
  serviceCategories: SupportCategory[];
  workingRadius: number;
  qualifications: Qualification[];
  experience: string;
  complianceStatus: ComplianceStatus;
  availability: AvailabilitySlot[];
  bankingDetails?: BankingDetails;
  insuranceDetails?: InsuranceDetails;
  performanceMetrics: PerformanceMetrics;
  preferences: WorkerPreferences;
}

export interface ComplianceStatus {
  ndisWorkerScreening: ComplianceDocument;
  wwccPoliceCheck: ComplianceDocument;
  firstAidCertification: ComplianceDocument;
  ndisWorkerOrientation: ComplianceDocument;
  professionalIndemnity?: ComplianceDocument;
  publicLiabilityInsurance?: ComplianceDocument;
  workersCompensation?: ComplianceDocument;
  overallStatus: 'compliant' | 'non_compliant' | 'pending' | 'expires_soon';
  lastReviewDate: Date;
  nextReviewDate: Date;
}

export interface ComplianceDocument {
  status: 'pending' | 'approved' | 'rejected' | 'expired' | 'expires_soon';
  expiryDate?: Date;
  uploadedAt?: Date;
  documentUrl?: string;
  documentType?: string;
  notes?: string;
  reviewedBy?: string;
  reviewedAt?: Date;
  remindersSent: number;
}

export interface AvailabilitySlot {
  dayOfWeek: number; // 0-6 (Sunday-Saturday)
  startTime: string; // HH:MM format
  endTime: string; // HH:MM format
  isRecurring: boolean;
  specificDate?: Date;
  maxHours?: number;
}

export interface ServiceRequest {
  id: string;
  participantId: string;
  title: string;
  description: string;
  serviceCategory: SupportCategory;
  urgency: 'low' | 'medium' | 'high' | 'urgent';
  location: ServiceLocation;
  preferredDate: Date;
  alternativeDates: Date[];
  duration: number; // in hours
  status: ServiceRequestStatus;
  assignedWorkerId?: string;
  createdAt: Date;
  updatedAt: Date;
  requirements: ServiceRequirement[];
  budgetAllocation: BudgetAllocation;
  riskLevel: 'low' | 'medium' | 'high';
  specialInstructions?: string;
  equipmentNeeded?: string[];
  accessibilityRequirements?: string[];
}

export interface ServiceRequestStatus {
  current: 'draft' | 'submitted' | 'under_review' | 'assigned' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled' | 'disputed';
  history: StatusChange[];
}

export interface StatusChange {
  status: string;
  timestamp: Date;
  changedBy: string;
  reason?: string;
  notes?: string;
}

export interface ServiceLocation {
  type: 'participant_home' | 'community' | 'provider_location' | 'virtual';
  address?: string;
  suburb?: string;
  state?: string;
  postcode?: string;
  coordinates?: {
    latitude: number;
    longitude: number;
  };
  accessibilityFeatures?: string[];
  parkingAvailable?: boolean;
  publicTransportAccess?: boolean;
}

export interface Message {
  id: string;
  conversationId: string;
  fromId: string;
  toId: string;
  content: string;
  attachments?: MessageAttachment[];
  timestamp: Date;
  read: boolean;
  readAt?: Date;
  messageType: 'text' | 'file' | 'system' | 'urgent';
  priority: 'low' | 'normal' | 'high' | 'urgent';
  relatedServiceId?: string;
  isEncrypted: boolean;
}

export interface MessageAttachment {
  id: string;
  filename: string;
  fileType: string;
  fileSize: number;
  url: string;
  uploadedAt: Date;
  isSecure: boolean;
}

export interface Conversation {
  id: string;
  participants: string[];
  title?: string;
  lastMessage?: Message;
  unreadCount: number;
  isArchived: boolean;
  createdAt: Date;
  updatedAt: Date;
  conversationType: 'direct' | 'group' | 'support_ticket';
}

export interface Invoice {
  id: string;
  invoiceNumber: string;
  participantId: string;
  workerId: string;
  timesheetIds: string[];
  shiftIds: string[];
  amount: number;
  gstAmount: number;
  totalAmount: number;
  lineItems: InvoiceLineItem[];
  status: InvoiceStatus;
  issueDate: Date;
  dueDate: Date;
  paidDate?: Date;
  paymentMethod?: string;
  paymentReference?: string;
  notes?: string;
  planManagerDetails?: PlanManagerDetails;
  ndisClaimNumber?: string;
  schadsAwardDetails: SchadsAwardDetails;
  sentAt?: Date;
  sentBy?: string;
  viewedAt?: Date;
  remindersSent: number;
  lastReminderSent?: Date;
  paymentIntentId?: string; // Stripe payment intent ID
  stripeInvoiceId?: string; // Stripe invoice ID
  downloadUrl?: string;
  auditTrail: InvoiceAuditEntry[];
}

export interface InvoiceAuditEntry {
  id: string;
  action: 'created' | 'sent' | 'viewed' | 'paid' | 'overdue' | 'cancelled' | 'disputed';
  timestamp: Date;
  userId: string;
  userRole: string;
  details?: string;
  metadata?: Record<string, any>;
}

export interface InvoiceLineItem {
  id: string;
  description: string;
  serviceCode: string;
  quantity: number;
  unitRate: number;
  totalAmount: number;
  dateOfService: Date;
  startTime: string;
  endTime: string;
  supportCategory: SupportCategory;
  gstApplicable: boolean;
}

export interface InvoiceStatus {
  current: 'draft' | 'sent' | 'viewed' | 'approved' | 'paid' | 'overdue' | 'disputed' | 'cancelled';
  history: StatusChange[];
}

export interface SchadsAwardDetails {
  classification: string;
  baseRate: number;
  penalties: PenaltyRate[];
  allowances: Allowance[];
  overtimeRate?: number;
  casualLoading?: number;
}

export interface PenaltyRate {
  type: 'evening' | 'night' | 'weekend' | 'public_holiday';
  multiplier: number;
  applicableHours: number;
}

export interface Allowance {
  type: 'travel' | 'meal' | 'accommodation' | 'equipment';
  amount: number;
  description: string;
}

export interface Document {
  id: string;
  ownerId: string;
  filename: string;
  originalFilename: string;
  fileType: string;
  fileSize: number;
  category: DocumentCategory;
  url: string;
  uploadedAt: Date;
  uploadedBy: string;
  isSecure: boolean;
  accessLevel: 'private' | 'shared' | 'public';
  sharedWith?: string[];
  expiryDate?: Date;
  tags: string[];
  metadata: DocumentMetadata;
}

export interface DocumentMetadata {
  description?: string;
  relatedServiceId?: string;
  relatedInvoiceId?: string;
  complianceType?: string;
  reviewRequired?: boolean;
  reviewedBy?: string;
  reviewedAt?: Date;
  version: number;
  isLatestVersion: boolean;
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: NotificationType;
  priority: 'low' | 'normal' | 'high' | 'urgent';
  read: boolean;
  readAt?: Date;
  createdAt: Date;
  expiresAt?: Date;
  actionUrl?: string;
  actionText?: string;
  relatedEntityId?: string;
  relatedEntityType?: string;
  metadata?: Record<string, any>;
}

export interface AuditLog {
  id: string;
  userId: string;
  action: string;
  entityType: string;
  entityId: string;
  oldValues?: Record<string, any>;
  newValues?: Record<string, any>;
  timestamp: Date;
  ipAddress?: string;
  userAgent?: string;
  sessionId?: string;
  outcome: 'success' | 'failure' | 'partial';
  errorMessage?: string;
}

export interface SystemMetrics {
  totalUsers: number;
  activeParticipants: number;
  activeWorkers: number;
  pendingApplications: number;
  monthlyRevenue: number;
  servicesCompleted: number;
  complianceIssues: number;
  averageResponseTime: number;
  systemUptime: number;
  lastUpdated: Date;
}

export interface PerformanceMetrics {
  totalServicesCompleted: number;
  averageRating: number;
  onTimePercentage: number;
  cancellationRate: number;
  complaintCount: number;
  complimentCount: number;
  responseTime: number; // in minutes
  lastServiceDate?: Date;
  preferredByParticipants: string[];
  specializations: string[];
}

// Enums and Types
export type SupportCategory = 
  | 'core_supports_daily_activities'
  | 'core_supports_transport'
  | 'core_supports_consumables'
  | 'capacity_building_support_coordination'
  | 'capacity_building_improved_living_arrangements'
  | 'capacity_building_increased_social_community_participation'
  | 'capacity_building_finding_keeping_job'
  | 'capacity_building_improved_relationships'
  | 'capacity_building_improved_health_wellbeing'
  | 'capacity_building_improved_learning'
  | 'capacity_building_improved_life_choices'
  | 'capacity_building_improved_daily_living_skills'
  | 'capital_supports_assistive_technology'
  | 'capital_supports_home_modifications'
  | 'capital_supports_specialist_disability_accommodation';

export type CommunicationPreference = 
  | 'email'
  | 'sms'
  | 'phone'
  | 'in_person'
  | 'video_call'
  | 'written_notes'
  | 'sign_language'
  | 'easy_read'
  | 'large_print'
  | 'audio';

export type DocumentCategory = 
  | 'compliance'
  | 'service_agreement'
  | 'invoice'
  | 'care_plan'
  | 'assessment'
  | 'incident_report'
  | 'progress_note'
  | 'medical_certificate'
  | 'identification'
  | 'insurance'
  | 'qualification'
  | 'other';

export type NotificationType = 
  | 'service_request'
  | 'service_update'
  | 'compliance_reminder'
  | 'payment_due'
  | 'payment_received'
  | 'message_received'
  | 'system_update'
  | 'security_alert'
  | 'document_expiry'
  | 'performance_review'
  | 'incident_report'
  | 'general';

export interface Qualification {
  id: string;
  name: string;
  issuingOrganization: string;
  issueDate: Date;
  expiryDate?: Date;
  credentialNumber?: string;
  verificationStatus: 'pending' | 'verified' | 'expired' | 'invalid';
  documentUrl?: string;
}

export interface BankingDetails {
  accountName: string;
  bsb: string;
  accountNumber: string;
  bankName: string;
  isVerified: boolean;
  verifiedAt?: Date;
}

export interface InsuranceDetails {
  publicLiability: {
    provider: string;
    policyNumber: string;
    coverageAmount: number;
    expiryDate: Date;
    documentUrl?: string;
  };
  professionalIndemnity: {
    provider: string;
    policyNumber: string;
    coverageAmount: number;
    expiryDate: Date;
    documentUrl?: string;
  };
  workersCompensation?: {
    provider: string;
    policyNumber: string;
    expiryDate: Date;
    documentUrl?: string;
  };
}

export interface WorkerPreferences {
  preferredServiceCategories: SupportCategory[];
  maximumTravelDistance: number;
  preferredWorkingHours: {
    weekdays: { start: string; end: string; };
    weekends: { start: string; end: string; };
  };
  unavailableDates: Date[];
  specialRequirements: string[];
  communicationPreferences: CommunicationPreference[];
}

export interface ServiceRequirement {
  id: string;
  type: 'mandatory' | 'preferred' | 'optional';
  description: string;
  category: 'skill' | 'qualification' | 'equipment' | 'accessibility' | 'other';
  priority: number;
}

export interface BudgetAllocation {
  supportCategory: SupportCategory;
  allocatedAmount: number;
  estimatedCost: number;
  fundingSource: 'core' | 'capacity_building' | 'capital' | 'self_managed';
  approvalRequired: boolean;
  approvedBy?: string;
  approvedAt?: Date;
}

export interface RiskAssessment {
  id: string;
  participantId: string;
  overallRiskLevel: 'low' | 'medium' | 'high' | 'extreme';
  riskFactors: RiskFactor[];
  mitigationStrategies: MitigationStrategy[];
  reviewDate: Date;
  assessedBy: string;
  assessedAt: Date;
  approvedBy?: string;
  approvedAt?: Date;
}

export interface RiskFactor {
  id: string;
  category: 'medical' | 'behavioral' | 'environmental' | 'social' | 'financial';
  description: string;
  likelihood: 'rare' | 'unlikely' | 'possible' | 'likely' | 'almost_certain';
  impact: 'insignificant' | 'minor' | 'moderate' | 'major' | 'catastrophic';
  riskLevel: 'low' | 'medium' | 'high' | 'extreme';
}

export interface MitigationStrategy {
  id: string;
  riskFactorId: string;
  strategy: string;
  responsibility: string;
  timeline: string;
  status: 'planned' | 'in_progress' | 'completed' | 'on_hold';
  effectiveness?: 'low' | 'medium' | 'high';
}

export interface PlanManagerDetails {
  name: string;
  organization?: string;
  email: string;
  phone: string;
  address?: string;
  abn?: string;
  registrationNumber?: string;
}

// Dashboard specific types
export interface DashboardStats {
  participant: {
    upcomingServices: number;
    totalBudget: number;
    usedBudget: number;
    remainingBudget: number;
    activeWorkers: number;
    unreadMessages: number;
    pendingInvoices: number;
    planExpiryDays: number;
  };
  worker: {
    weeklyEarnings: number;
    hoursWorked: number;
    upcomingShifts: number;
    activeParticipants: number;
    averageRating: number;
    complianceStatus: 'compliant' | 'non_compliant' | 'expires_soon';
    pendingTimesheets: number;
    unreadMessages: number;
  };
  admin: {
    totalParticipants: number;
    activeWorkers: number;
    pendingApplications: number;
    monthlyRevenue: number;
    servicesCompleted: number;
    complianceIssues: number;
    systemAlerts: number;
    averageResponseTime: number;
  };
}

export interface QuickAction {
  id: string;
  title: string;
  description: string;
  icon: string;
  action: string;
  url?: string;
  badge?: {
    text: string;
    variant: 'success' | 'warning' | 'error' | 'info';
  };
  permissions?: string[];
}