// NDIS-specific types for the Nurova Australia platform
export interface NDISUser {
  id: string;
  email: string;
  password_hash?: string;
  role: 'participant' | 'support_worker' | 'team_leader' | 'admin' | 'compliance';
  first_name: string;
  last_name: string;
  phone?: string;
  is_active: boolean;
  email_verified: boolean;
  profile_complete?: boolean;
  onboarding_completed?: boolean;
  created_at: Date;
  updated_at: Date;
}

export interface NDISParticipant {
  id: string;
  user_id: string;
  ndis_number: string;
  date_of_birth: Date;
  address: Address;
  emergency_contact: EmergencyContact;
  support_coordinator?: SupportCoordinator;
  cultural_background?: string;
  communication_preferences: CommunicationPreferences;
  disability_type?: string;
  support_needs?: string;
  plan_start_date?: Date;
  plan_end_date?: Date;
  plan_budget?: number;
  status: 'active' | 'inactive' | 'suspended';
  created_at: Date;
  updated_at: Date;
}

export interface Address {
  street: string;
  suburb: string;
  state: string;
  postcode: string;
  country: string;
}

export interface EmergencyContact {
  fullName: string;
  phone: string;
  relationship: string;
  address?: string;
  email?: string;
}

export interface SupportCoordinator {
  name: string;
  phone: string;
  email: string;
  organization?: string;
}

export interface CommunicationPreferences {
  preferred_method: 'email' | 'phone' | 'sms' | 'in_person';
  language: string;
  interpreter_required: boolean;
  accessibility_needs: string[];
}

export interface SupportWorker {
  id: string;
  user_id: string;
  employee_id: string;
  qualifications: Qualification[];
  skills: string[];
  certifications: Certification[];
  availability: AvailabilitySlot[];
  hourly_rate: number;
  experience_years: number;
  languages: string[];
  transport_available: boolean;
  working_with_children_check: string;
  police_check: string;
  status: 'active' | 'inactive' | 'suspended';
  created_at: Date;
  updated_at: Date;
}

export interface Qualification {
  name: string;
  institution: string;
  date_obtained: Date;
  expiry_date?: Date;
  certificate_number?: string;
}

export interface Certification {
  name: string;
  issuing_body: string;
  date_obtained: Date;
  expiry_date?: Date;
  certificate_number: string;
}

export interface AvailabilitySlot {
  day_of_week: number; // 0-6 (Sunday-Saturday)
  start_time: string;
  end_time: string;
  is_available: boolean;
}

// Form-specific types
export interface FormSubmission {
  id: string;
  participant_id: string;
  form_type: 'service_agreement' | 'risk_assessment' | 'incident_report' | 'support_plan';
  status: 'pending' | 'in_progress' | 'completed' | 'overdue';
  assigned_by: string;
  assigned_to?: string;
  due_date?: Date;
  completed_date?: Date;
  priority: 'low' | 'medium' | 'high';
  notes?: string;
  reminder_sent: boolean;
  created_at: Date;
  updated_at: Date;
}

export interface ServiceAgreement {
  id: string;
  participant_id: string;
  agreement_number: string;
  service_types: ServiceType[];
  start_date: Date;
  review_date: Date;
  service_location: string;
  support_team: SupportTeam;
  terms_accepted: boolean;
  participant_signature?: DigitalSignature;
  guardian_signature?: DigitalSignature;
  nurova_signature?: DigitalSignature;
  status: 'draft' | 'pending_signature' | 'signed' | 'active' | 'expired';
  signed_at?: Date;
  form_data: ServiceAgreementFormData;
  pdf_url?: string;
  created_at: Date;
  updated_at: Date;
}

export interface ServiceType {
  category: 'core_supports' | 'capacity_building' | 'capital_supports';
  subcategory: string;
  description: string;
  frequency: string;
  duration: string;
}

export interface SupportTeam {
  primary_worker?: string;
  team_leader?: string;
  nurova_representative: string;
  support_coordinator?: string;
}

export interface DigitalSignature {
  signature_data: string; // Base64 encoded signature
  signed_by: string;
  signed_at: Date;
  ip_address: string;
  user_agent: string;
}

export interface ServiceAgreementFormData {
  participantInfo: {
    fullName: string;
    ndisNumber: string;
    dateOfBirth: string;
    address: Address;
    emergencyContact: EmergencyContact;
    supportCoordinator?: SupportCoordinator;
  };
  serviceDetails: {
    serviceTypes: ServiceType[];
    startDate: string;
    reviewDate: string;
    serviceLocation: string;
  };
  supportTeam: SupportTeam;
}

export interface RiskAssessment {
  id: string;
  participant_id: string;
  assessment_number: string;
  assessment_date: Date;
  assessed_by: string;
  risk_levels: RiskLevels;
  physical_health_risks?: RiskCategory;
  environmental_risks?: RiskCategory;
  behavioral_risks?: RiskCategory;
  communication_risks?: RiskCategory;
  mitigation_strategies: MitigationStrategy[];
  monitoring_procedures: MonitoringProcedure[];
  emergency_procedures: EmergencyProcedure[];
  review_date: Date;
  status: 'active' | 'under_review' | 'expired';
  form_data: RiskAssessmentFormData;
  pdf_url?: string;
  created_at: Date;
  updated_at: Date;
}

export interface RiskLevels {
  physical_health: 'low' | 'medium' | 'high';
  environmental: 'low' | 'medium' | 'high';
  behavioral: 'low' | 'medium' | 'high';
  communication: 'low' | 'medium' | 'high';
  overall: 'low' | 'medium' | 'high';
}

export interface RiskCategory {
  identified_risks: string[];
  risk_level: 'low' | 'medium' | 'high';
  likelihood: 'rare' | 'unlikely' | 'possible' | 'likely' | 'almost_certain';
  consequence: 'insignificant' | 'minor' | 'moderate' | 'major' | 'catastrophic';
  current_controls: string[];
}

export interface MitigationStrategy {
  risk_area: string;
  strategy: string;
  responsible_person: string;
  implementation_date: Date;
  review_date: Date;
  effectiveness: 'low' | 'medium' | 'high';
}

export interface MonitoringProcedure {
  area: string;
  procedure: string;
  frequency: string;
  responsible_person: string;
  documentation_required: boolean;
}

export interface EmergencyProcedure {
  scenario: string;
  immediate_actions: string[];
  contact_persons: EmergencyContact[];
  escalation_process: string;
}

export interface RiskAssessmentFormData {
  basicInfo: {
    participantName: string;
    assessmentDate: string;
    assessedBy: string;
  };
  riskIdentification: {
    physicalHealth: RiskCategory;
    environmental: RiskCategory;
    behavioral: RiskCategory;
    communication: RiskCategory;
  };
  mitigationPlanning: {
    strategies: MitigationStrategy[];
    monitoring: MonitoringProcedure[];
    emergency: EmergencyProcedure[];
  };
}

export interface IncidentReport {
  id: string;
  participant_id: string;
  report_number: string;
  incident_date: Date;
  location: string;
  reported_by: string;
  incident_type: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  immediate_actions?: string;
  injuries_sustained?: InjuryDetails[];
  witnesses?: Witness[];
  emergency_services_called: boolean;
  medical_attention_required: boolean;
  ndis_commission_notified: boolean;
  notification_date?: Date;
  investigation_findings?: string;
  corrective_actions?: CorrectiveAction[];
  prevention_measures?: string;
  status: 'reported' | 'under_investigation' | 'resolved' | 'closed';
  form_data: IncidentReportFormData;
  attachments?: Attachment[];
  pdf_url?: string;
  created_at: Date;
  updated_at: Date;
}

export interface InjuryDetails {
  person_affected: string;
  injury_type: string;
  body_part: string;
  severity: 'minor' | 'moderate' | 'serious' | 'critical';
  medical_treatment: string;
}

export interface Witness {
  name: string;
  contact_details: string;
  statement: string;
  relationship_to_participant: string;
}

export interface CorrectiveAction {
  action: string;
  responsible_person: string;
  target_date: Date;
  completion_date?: Date;
  status: 'planned' | 'in_progress' | 'completed';
}

export interface Attachment {
  filename: string;
  file_path: string;
  file_type: string;
  uploaded_by: string;
  uploaded_at: Date;
}

export interface IncidentReportFormData {
  incidentDetails: {
    incidentDate: string;
    incidentTime: string;
    location: string;
    incidentType: string;
    severity: string;
    description: string;
  };
  peopleInvolved: {
    participantInvolved: boolean;
    injuriesSustained: InjuryDetails[];
    witnesses: Witness[];
  };
  immediateResponse: {
    immediateActions: string;
    emergencyServicesCalled: boolean;
    medicalAttentionRequired: boolean;
    reportedTo: string[];
  };
  followUp: {
    investigationFindings: string;
    correctiveActions: CorrectiveAction[];
    preventionMeasures: string;
    ndisCommissionNotified: boolean;
  };
}

export interface IndividualSupportPlan {
  id: string;
  participant_id: string;
  plan_number: string;
  plan_period_start: Date;
  plan_period_end: Date;
  participant_vision: string;
  strengths_abilities: string[];
  support_preferences: SupportPreferences;
  short_term_goals: Goal[];
  medium_term_goals: Goal[];
  long_term_goals: Goal[];
  daily_living_support: SupportArea;
  community_participation: SupportArea;
  capacity_building: SupportArea;
  health_wellbeing: SupportArea;
  technology_requirements: TechnologyRequirement[];
  progress_tracking: ProgressTracking;
  review_schedule: ReviewSchedule;
  team_responsibilities: TeamResponsibility[];
  status: 'active' | 'under_review' | 'expired';
  form_data: SupportPlanFormData;
  pdf_url?: string;
  created_at: Date;
  updated_at: Date;
}

export interface Goal {
  description: string;
  target_date: Date;
  success_criteria: string[];
  support_required: string;
  responsible_person: string;
  progress_status: 'not_started' | 'in_progress' | 'achieved' | 'modified';
}

export interface SupportArea {
  current_situation: string;
  desired_outcomes: string[];
  support_strategies: string[];
  frequency: string;
  responsible_team_members: string[];
}

export interface TechnologyRequirement {
  technology_type: string;
  purpose: string;
  training_required: boolean;
  support_needed: string;
}

export interface ProgressTracking {
  review_frequency: string;
  measurement_methods: string[];
  reporting_format: string;
  stakeholders_involved: string[];
}

export interface ReviewSchedule {
  formal_reviews: ReviewEvent[];
  informal_check_ins: ReviewEvent[];
  emergency_review_triggers: string[];
}

export interface ReviewEvent {
  date: Date;
  type: 'formal' | 'informal' | 'emergency';
  attendees: string[];
  agenda_items: string[];
}

export interface TeamResponsibility {
  team_member: string;
  role: string;
  responsibilities: string[];
  contact_details: string;
}

export interface SupportPreferences {
  communication_style: string;
  learning_style: string;
  cultural_considerations: string[];
  environmental_preferences: string[];
}

export interface SupportPlanFormData {
  participantVision: {
    vision: string;
    strengths: string[];
    preferences: SupportPreferences;
  };
  goals: {
    shortTerm: Goal[];
    mediumTerm: Goal[];
    longTerm: Goal[];
  };
  supportAreas: {
    dailyLiving: SupportArea;
    community: SupportArea;
    capacityBuilding: SupportArea;
    healthWellbeing: SupportArea;
  };
  implementation: {
    technology: TechnologyRequirement[];
    tracking: ProgressTracking;
    reviews: ReviewSchedule;
    team: TeamResponsibility[];
  };
}

// Notification types
export interface NDISNotification {
  id: string;
  user_id: string;
  title: string;
  message: string;
  type: 'form_assignment' | 'form_reminder' | 'compliance_alert' | 'system_update' | 'incident_alert';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  read: boolean;
  action_required: boolean;
  action_url?: string;
  expires_at?: Date;
  created_at: Date;
}

// Compliance and audit types
export interface ComplianceEvent {
  id: string;
  participant_id: string;
  event_type: string;
  event_description: string;
  compliance_status: 'pending' | 'compliant' | 'non_compliant' | 'under_review';
  due_date?: Date;
  completed_date?: Date;
  assigned_to?: string;
  priority: 'low' | 'medium' | 'high';
  ndis_standard: string;
  evidence_required: string[];
  evidence_provided: string[];
  created_at: Date;
  updated_at: Date;
}

export interface AuditTrail {
  id: string;
  table_name: string;
  record_id: string;
  action: 'create' | 'update' | 'delete' | 'view';
  old_values?: Record<string, any>;
  new_values?: Record<string, any>;
  user_id: string;
  ip_address?: string;
  user_agent?: string;
  timestamp: Date;
}

export interface NDISDocument {
  id: string;
  participant_id?: string;
  document_type: 'service_agreement' | 'risk_assessment' | 'incident_report' | 'support_plan' | 'other';
  file_name: string;
  file_path: string;
  file_size: number;
  mime_type: string;
  encryption_key?: string;
  access_permissions: string[];
  uploaded_by: string;
  created_at: Date;
}

// Form validation schemas
export interface FormValidationError {
  field: string;
  message: string;
  code: string;
}

export interface FormValidationResult {
  isValid: boolean;
  errors: FormValidationError[];
}

// API response types
export interface APIResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  errors?: FormValidationError[];
  message?: string;
}

export interface PaginatedResponse<T> extends APIResponse<T[]> {
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}