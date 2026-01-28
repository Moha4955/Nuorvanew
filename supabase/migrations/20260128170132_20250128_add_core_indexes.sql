/*
  # Add Core Performance Indexes

  Creates indexes on the most important lookup columns.
*/

DO $$
BEGIN
  -- Participant Indexes
  CREATE INDEX IF NOT EXISTS idx_participants_user_id ON participants(user_id);
  EXCEPTION WHEN others THEN NULL;
END $$;

DO $$
BEGIN
  CREATE INDEX IF NOT EXISTS idx_participants_ndis_number ON participants(ndis_number);
  EXCEPTION WHEN others THEN NULL;
END $$;

DO $$
BEGIN
  CREATE INDEX IF NOT EXISTS idx_participants_status ON participants(status);
  EXCEPTION WHEN others THEN NULL;
END $$;

DO $$
BEGIN
  -- Support Worker Indexes
  CREATE INDEX IF NOT EXISTS idx_support_workers_user_id ON support_workers(user_id);
  EXCEPTION WHEN others THEN NULL;
END $$;

DO $$
BEGIN
  CREATE INDEX IF NOT EXISTS idx_support_workers_application_status ON support_workers(application_status);
  EXCEPTION WHEN others THEN NULL;
END $$;

DO $$
BEGIN
  -- Shift Indexes
  CREATE INDEX IF NOT EXISTS idx_shifts_worker_id ON shifts(worker_id);
  EXCEPTION WHEN others THEN NULL;
END $$;

DO $$
BEGIN
  CREATE INDEX IF NOT EXISTS idx_shifts_participant_id ON shifts(participant_id);
  EXCEPTION WHEN others THEN NULL;
END $$;

DO $$
BEGIN
  CREATE INDEX IF NOT EXISTS idx_shifts_status ON shifts(status);
  EXCEPTION WHEN others THEN NULL;
END $$;

DO $$
BEGIN
  -- Timesheet Indexes
  CREATE INDEX IF NOT EXISTS idx_timesheets_worker_id ON timesheets(worker_id);
  EXCEPTION WHEN others THEN NULL;
END $$;

DO $$
BEGIN
  CREATE INDEX IF NOT EXISTS idx_timesheets_shift_id ON timesheets(shift_id);
  EXCEPTION WHEN others THEN NULL;
END $$;

DO $$
BEGIN
  CREATE INDEX IF NOT EXISTS idx_timesheets_status ON timesheets(status);
  EXCEPTION WHEN others THEN NULL;
END $$;

DO $$
BEGIN
  -- Invoice Indexes
  CREATE INDEX IF NOT EXISTS idx_invoices_participant_id ON invoices(participant_id);
  EXCEPTION WHEN others THEN NULL;
END $$;

DO $$
BEGIN
  CREATE INDEX IF NOT EXISTS idx_invoices_status ON invoices(status);
  EXCEPTION WHEN others THEN NULL;
END $$;

DO $$
BEGIN
  -- Form Submission Indexes
  CREATE INDEX IF NOT EXISTS idx_form_submissions_participant_id ON form_submissions(participant_id);
  EXCEPTION WHEN others THEN NULL;
END $$;

DO $$
BEGIN
  CREATE INDEX IF NOT EXISTS idx_form_submissions_status ON form_submissions(status);
  EXCEPTION WHEN others THEN NULL;
END $$;

DO $$
BEGIN
  -- Document Indexes
  CREATE INDEX IF NOT EXISTS idx_documents_user_id ON documents(user_id);
  EXCEPTION WHEN others THEN NULL;
END $$;

DO $$
BEGIN
  CREATE INDEX IF NOT EXISTS idx_documents_expiry_date ON documents(expiry_date);
  EXCEPTION WHEN others THEN NULL;
END $$;

DO $$
BEGIN
  -- Audit Log Indexes
  CREATE INDEX IF NOT EXISTS idx_audit_logs_user_id ON audit_logs(user_id);
  EXCEPTION WHEN others THEN NULL;
END $$;

DO $$
BEGIN
  -- User Profile Indexes
  CREATE INDEX IF NOT EXISTS idx_user_profiles_role ON user_profiles(role);
  EXCEPTION WHEN others THEN NULL;
END $$;
