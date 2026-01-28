/*
  # Create users and profiles tables

  1. New Tables
    - `user_profiles` - Extended user information beyond Supabase auth
    - `participants` - NDIS participant specific data
    - `support_workers` - Support worker specific data
    - `form_submissions` - Form assignment and tracking
    - `service_requests` - Service booking requests
    - `shifts` - Assigned work shifts
    - `timesheets` - Time tracking for services
    - `invoices` - Billing and payment tracking
    - `messages` - Communication between users
    - `documents` - File storage metadata
    - `notifications` - System notifications
    - `audit_logs` - Compliance audit trail

  2. Security
    - Enable RLS on all tables
    - Add policies for role-based access
    - Ensure participants only see their own data
    - Workers only see assigned participant data
    - Admins have full access
*/

-- User profiles (extends Supabase auth.users)
CREATE TABLE IF NOT EXISTS user_profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  role text NOT NULL CHECK (role IN ('participant', 'support_worker', 'admin', 'team_leader', 'compliance')),
  first_name text NOT NULL,
  last_name text NOT NULL,
  phone text,
  avatar_url text,
  is_active boolean DEFAULT true,
  profile_complete boolean DEFAULT false,
  onboarding_completed boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- NDIS Participants
CREATE TABLE IF NOT EXISTS participants (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES user_profiles(id) ON DELETE CASCADE,
  ndis_number text UNIQUE NOT NULL,
  date_of_birth date NOT NULL,
  address jsonb NOT NULL,
  emergency_contact jsonb NOT NULL,
  support_coordinator jsonb,
  cultural_background text,
  communication_preferences text[] DEFAULT '{}',
  disability_type text,
  support_needs text,
  plan_start_date date,
  plan_end_date date,
  plan_budget numeric(10,2),
  status text DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'suspended')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Support Workers
CREATE TABLE IF NOT EXISTS support_workers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES user_profiles(id) ON DELETE CASCADE,
  abn text UNIQUE NOT NULL,
  business_name text,
  hourly_rate numeric(6,2) NOT NULL,
  working_radius integer DEFAULT 10,
  qualifications jsonb DEFAULT '[]',
  skills text[] DEFAULT '{}',
  certifications jsonb DEFAULT '[]',
  availability jsonb DEFAULT '[]',
  experience_years integer DEFAULT 0,
  languages text[] DEFAULT '{"English"}',
  transport_available boolean DEFAULT false,
  working_with_children_check text,
  police_check text,
  application_status text DEFAULT 'pending' CHECK (application_status IN ('pending', 'approved', 'rejected', 'suspended')),
  compliance_status jsonb DEFAULT '{}',
  performance_metrics jsonb DEFAULT '{}',
  banking_details jsonb,
  insurance_details jsonb,
  preferences jsonb DEFAULT '{}',
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'active', 'inactive', 'suspended')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Form Submissions
CREATE TABLE IF NOT EXISTS form_submissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  participant_id uuid REFERENCES participants(id) ON DELETE CASCADE,
  form_type text NOT NULL CHECK (form_type IN ('service_agreement', 'risk_assessment', 'incident_report', 'support_plan')),
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'completed', 'overdue')),
  assigned_by uuid REFERENCES user_profiles(id),
  assigned_to uuid REFERENCES user_profiles(id),
  due_date timestamptz,
  completed_date timestamptz,
  priority text DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high')),
  notes text,
  form_data jsonb DEFAULT '{}',
  reminder_sent boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Service Requests
CREATE TABLE IF NOT EXISTS service_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  participant_id uuid REFERENCES participants(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text NOT NULL,
  service_category text NOT NULL,
  urgency text DEFAULT 'medium' CHECK (urgency IN ('low', 'medium', 'high', 'urgent')),
  location_type text NOT NULL CHECK (location_type IN ('participant_home', 'community', 'provider_location', 'virtual')),
  location_details jsonb NOT NULL,
  preferred_date date NOT NULL,
  alternative_dates date[] DEFAULT '{}',
  duration numeric(4,2) NOT NULL,
  status text DEFAULT 'submitted' CHECK (status IN ('submitted', 'under_review', 'assigned', 'confirmed', 'completed', 'cancelled')),
  assigned_worker_id uuid REFERENCES support_workers(id),
  requirements text[] DEFAULT '{}',
  budget_allocation jsonb,
  risk_level text DEFAULT 'low' CHECK (risk_level IN ('low', 'medium', 'high')),
  special_instructions text,
  equipment_needed text[] DEFAULT '{}',
  accessibility_requirements text[] DEFAULT '{}',
  estimated_cost numeric(8,2),
  admin_notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Shifts
CREATE TABLE IF NOT EXISTS shifts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  service_request_id uuid REFERENCES service_requests(id) ON DELETE CASCADE,
  participant_id uuid REFERENCES participants(id) ON DELETE CASCADE,
  worker_id uuid REFERENCES support_workers(id),
  title text NOT NULL,
  description text,
  service_category text NOT NULL,
  scheduled_date date NOT NULL,
  scheduled_start_time time NOT NULL,
  scheduled_end_time time NOT NULL,
  actual_start_time time,
  actual_end_time time,
  duration numeric(4,2) NOT NULL,
  actual_duration numeric(4,2),
  location_details jsonb NOT NULL,
  status text DEFAULT 'pending_assignment' CHECK (status IN ('pending_assignment', 'assigned', 'pending_worker_confirmation', 'confirmed', 'in_progress', 'completed', 'cancelled', 'no_show', 'disputed')),
  urgency text DEFAULT 'medium' CHECK (urgency IN ('low', 'medium', 'high', 'urgent')),
  risk_level text DEFAULT 'low' CHECK (risk_level IN ('low', 'medium', 'high')),
  requirements text[] DEFAULT '{}',
  estimated_cost numeric(8,2),
  actual_cost numeric(8,2),
  assigned_at timestamptz,
  assigned_by uuid REFERENCES user_profiles(id),
  confirmed_at timestamptz,
  completed_at timestamptz,
  cancelled_at timestamptz,
  cancellation_reason text,
  admin_notes text,
  worker_notes text,
  participant_feedback jsonb,
  is_recurring boolean DEFAULT false,
  recurring_shift_id uuid,
  parent_shift_id uuid,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Timesheets
CREATE TABLE IF NOT EXISTS timesheets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  shift_id uuid REFERENCES shifts(id) ON DELETE CASCADE,
  worker_id uuid REFERENCES support_workers(id) ON DELETE CASCADE,
  participant_id uuid REFERENCES participants(id) ON DELETE CASCADE,
  service_date date NOT NULL,
  scheduled_start_time time NOT NULL,
  scheduled_end_time time NOT NULL,
  actual_start_time time NOT NULL,
  actual_end_time time NOT NULL,
  total_hours numeric(4,2) NOT NULL,
  break_time numeric(4,2) DEFAULT 0,
  billable_hours numeric(4,2) NOT NULL,
  travel_time integer, -- in minutes
  travel_distance numeric(6,2), -- in kilometers
  service_notes text NOT NULL,
  participant_signature text,
  worker_signature text NOT NULL,
  status text DEFAULT 'draft' CHECK (status IN ('draft', 'submitted', 'under_review', 'approved', 'rejected', 'requires_clarification')),
  submitted_at timestamptz,
  reviewed_at timestamptz,
  reviewed_by uuid REFERENCES user_profiles(id),
  approved_at timestamptz,
  approved_by uuid REFERENCES user_profiles(id),
  rejected_at timestamptz,
  rejected_by uuid REFERENCES user_profiles(id),
  rejection_reason text,
  schads_calculation jsonb,
  invoice_id uuid,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Invoices
CREATE TABLE IF NOT EXISTS invoices (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  invoice_number text UNIQUE NOT NULL,
  participant_id uuid REFERENCES participants(id) ON DELETE CASCADE,
  worker_id uuid REFERENCES support_workers(id) ON DELETE CASCADE,
  timesheet_ids uuid[] DEFAULT '{}',
  shift_ids uuid[] DEFAULT '{}',
  amount numeric(10,2) NOT NULL,
  gst_amount numeric(10,2) NOT NULL,
  total_amount numeric(10,2) NOT NULL,
  line_items jsonb NOT NULL DEFAULT '[]',
  status text DEFAULT 'generated' CHECK (status IN ('generated', 'sent', 'viewed', 'approved', 'paid', 'overdue', 'disputed', 'cancelled')),
  issue_date date NOT NULL DEFAULT CURRENT_DATE,
  due_date date NOT NULL,
  paid_date date,
  payment_method text,
  payment_reference text,
  notes text,
  plan_manager_details jsonb,
  ndis_claim_number text,
  schads_award_details jsonb,
  sent_at timestamptz,
  sent_by uuid REFERENCES user_profiles(id),
  viewed_at timestamptz,
  reminders_sent integer DEFAULT 0,
  last_reminder_sent timestamptz,
  payment_intent_id text,
  stripe_invoice_id text,
  download_url text,
  audit_trail jsonb DEFAULT '[]',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Messages
CREATE TABLE IF NOT EXISTS messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id uuid NOT NULL,
  from_id uuid REFERENCES user_profiles(id) ON DELETE CASCADE,
  to_id uuid REFERENCES user_profiles(id) ON DELETE CASCADE,
  content text NOT NULL,
  attachments jsonb DEFAULT '[]',
  message_type text DEFAULT 'text' CHECK (message_type IN ('text', 'file', 'system', 'urgent')),
  priority text DEFAULT 'normal' CHECK (priority IN ('low', 'normal', 'high', 'urgent')),
  related_service_id uuid,
  is_encrypted boolean DEFAULT false,
  read boolean DEFAULT false,
  read_at timestamptz,
  created_at timestamptz DEFAULT now()
);

-- Documents
CREATE TABLE IF NOT EXISTS documents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id uuid REFERENCES user_profiles(id) ON DELETE CASCADE,
  participant_id uuid REFERENCES participants(id),
  document_type text NOT NULL CHECK (document_type IN ('service_agreement', 'risk_assessment', 'incident_report', 'support_plan', 'compliance', 'medical', 'identification', 'other')),
  filename text NOT NULL,
  original_filename text NOT NULL,
  file_type text NOT NULL,
  file_size bigint NOT NULL,
  file_path text NOT NULL,
  access_permissions text[] DEFAULT '{}',
  is_secure boolean DEFAULT true,
  access_level text DEFAULT 'private' CHECK (access_level IN ('private', 'shared', 'public')),
  shared_with uuid[] DEFAULT '{}',
  expiry_date date,
  tags text[] DEFAULT '{}',
  metadata jsonb DEFAULT '{}',
  uploaded_by uuid REFERENCES user_profiles(id),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Notifications
CREATE TABLE IF NOT EXISTS notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES user_profiles(id) ON DELETE CASCADE,
  title text NOT NULL,
  message text NOT NULL,
  type text NOT NULL CHECK (type IN ('form_assignment', 'form_reminder', 'compliance_alert', 'system_update', 'incident_alert', 'service_update', 'payment_due', 'payment_received', 'message_received')),
  priority text DEFAULT 'normal' CHECK (priority IN ('low', 'normal', 'high', 'urgent')),
  read boolean DEFAULT false,
  action_required boolean DEFAULT false,
  action_url text,
  expires_at timestamptz,
  metadata jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now()
);

-- Audit Logs
CREATE TABLE IF NOT EXISTS audit_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES user_profiles(id),
  table_name text NOT NULL,
  record_id text NOT NULL,
  action text NOT NULL CHECK (action IN ('create', 'update', 'delete', 'view')),
  old_values jsonb,
  new_values jsonb,
  ip_address inet,
  user_agent text,
  session_id text,
  outcome text DEFAULT 'success' CHECK (outcome IN ('success', 'failure', 'partial')),
  error_message text,
  metadata jsonb DEFAULT '{}',
  timestamp timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE support_workers ENABLE ROW LEVEL SECURITY;
ALTER TABLE form_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE service_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE shifts ENABLE ROW LEVEL SECURITY;
ALTER TABLE timesheets ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- RLS Policies for user_profiles
CREATE POLICY "Users can read own profile"
  ON user_profiles
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON user_profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Admins can read all profiles"
  ON user_profiles
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles 
      WHERE id = auth.uid() 
      AND role IN ('admin', 'team_leader', 'compliance')
    )
  );

-- RLS Policies for participants
CREATE POLICY "Participants can read own data"
  ON participants
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Participants can update own data"
  ON participants
  FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Workers can read assigned participants"
  ON participants
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM shifts s
      JOIN support_workers sw ON s.worker_id = sw.id
      WHERE s.participant_id = participants.id
      AND sw.user_id = auth.uid()
    )
  );

CREATE POLICY "Admins can manage all participants"
  ON participants
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles 
      WHERE id = auth.uid() 
      AND role IN ('admin', 'team_leader', 'compliance')
    )
  );

-- RLS Policies for support_workers
CREATE POLICY "Workers can read own data"
  ON support_workers
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Workers can update own data"
  ON support_workers
  FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Admins can manage all workers"
  ON support_workers
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles 
      WHERE id = auth.uid() 
      AND role IN ('admin', 'team_leader', 'compliance')
    )
  );

-- RLS Policies for service_requests
CREATE POLICY "Participants can manage own requests"
  ON service_requests
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM participants p
      WHERE p.id = service_requests.participant_id
      AND p.user_id = auth.uid()
    )
  );

CREATE POLICY "Workers can read assigned requests"
  ON service_requests
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM support_workers sw
      WHERE sw.id = service_requests.assigned_worker_id
      AND sw.user_id = auth.uid()
    )
  );

CREATE POLICY "Admins can manage all requests"
  ON service_requests
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles 
      WHERE id = auth.uid() 
      AND role IN ('admin', 'team_leader', 'compliance')
    )
  );

-- RLS Policies for notifications
CREATE POLICY "Users can read own notifications"
  ON notifications
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can update own notifications"
  ON notifications
  FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Admins can create notifications"
  ON notifications
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM user_profiles 
      WHERE id = auth.uid() 
      AND role IN ('admin', 'team_leader', 'compliance')
    )
  );

-- Functions for updated_at timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers for updated_at
CREATE TRIGGER update_user_profiles_updated_at BEFORE UPDATE ON user_profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_participants_updated_at BEFORE UPDATE ON participants FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_support_workers_updated_at BEFORE UPDATE ON support_workers FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_form_submissions_updated_at BEFORE UPDATE ON form_submissions FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_service_requests_updated_at BEFORE UPDATE ON service_requests FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_shifts_updated_at BEFORE UPDATE ON shifts FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_timesheets_updated_at BEFORE UPDATE ON timesheets FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_invoices_updated_at BEFORE UPDATE ON invoices FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_documents_updated_at BEFORE UPDATE ON documents FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();