import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { useAuth } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import DashboardRedirect from './components/DashboardRedirect';

// Import existing pages
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import AboutUs from './pages/AboutUs';
import ContactUs from './pages/ContactUs';
import HelpCenter from './pages/HelpCenter';
import HowItWorks from './pages/HowItWorks';
import PrivacyPolicy from './pages/legal/PrivacyPolicy';
import TermsOfService from './pages/legal/TermsOfService';

// Participant pages
import ParticipantDashboard from './pages/participant/ParticipantDashboard';
import ParticipantOnboarding from './pages/participant/ParticipantOnboarding';
import ParticipantProfile from './pages/participant/ParticipantProfile';
import ParticipantMessages from './pages/participant/ParticipantMessages';
import ParticipantDocuments from './pages/participant/ParticipantDocuments';
import ParticipantInvoices from './pages/participant/ParticipantInvoices';
import ServiceRequests from './pages/participant/ServiceRequests';

// Worker pages
import WorkerDashboard from './pages/worker/WorkerDashboard';
import WorkerOnboarding from './pages/worker/WorkerOnboarding';
import WorkerProfile from './pages/worker/WorkerProfile';
import WorkerShifts from './pages/worker/WorkerShifts';
import WorkerMessages from './pages/worker/WorkerMessages';
import WorkerCompliance from './pages/worker/WorkerCompliance';
import WorkerTimesheets from './pages/worker/WorkerTimesheets';
import ApplicationPending from './pages/worker/ApplicationPending';

// Admin pages
import AdminDashboard from './pages/admin/AdminDashboard';
import WorkerManagement from './pages/admin/WorkerManagement';
import ParticipantManagement from './pages/admin/ParticipantManagement';
import ShiftAssignment from './pages/admin/ShiftAssignment';
import ServiceManagement from './pages/admin/ServiceManagement';
import TimesheetApproval from './pages/admin/TimesheetApproval';
import InvoiceManagement from './pages/admin/InvoiceManagement';
import ComplianceManagement from './pages/admin/ComplianceManagement';
import FinancialManagement from './pages/admin/FinancialManagement';
import ReportsAnalytics from './pages/admin/ReportsAnalytics';
import NotificationCenter from './pages/admin/NotificationCenter';
import UserManagement from './pages/admin/UserManagement';
import SystemSettings from './pages/admin/SystemSettings';
import AuditLogs from './pages/admin/AuditLogs';
import FormsManagement from './pages/admin/FormsManagement';
import MarketingManagement from './pages/admin/MarketingManagement';
import ComplianceStandards from './pages/admin/ComplianceStandards';
import AdminCommunications from './pages/admin/AdminCommunications';

// Form pages
import ServiceAgreementPage from './pages/forms/ServiceAgreementPage';
import RiskAssessmentPage from './pages/forms/RiskAssessmentPage';

// Debug page
import DebugPage from './pages/DebugPage';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/about" element={<AboutUs />} />
          <Route path="/contact" element={<ContactUs />} />
          <Route path="/help" element={<HelpCenter />} />
          <Route path="/how-it-works" element={<HowItWorks />} />
          <Route path="/privacy" element={<PrivacyPolicy />} />
          <Route path="/terms" element={<TermsOfService />} />

          {/* Dashboard redirects */}
          <Route path="/dashboard" element={<DashboardRedirect />} />

          {/* Debug page */}
          <Route path="/debug" element={<DebugPage />} />

          {/* Onboarding check wrapper */}
          <Route path="/participant/*" element={
            <ProtectedRoute allowedRoles={['participant']}>
              <ParticipantRoutes />
            </ProtectedRoute>
          } />
          
          <Route path="/worker/*" element={
            <ProtectedRoute allowedRoles={['support_worker']}>
              <WorkerRoutes />
            </ProtectedRoute>
          } />
          
          <Route path="/admin/*" element={
            <ProtectedRoute allowedRoles={['admin', 'team_leader', 'compliance']}>
              <AdminRoutes />
            </ProtectedRoute>
          } />

          {/* Participant routes */}
          <Route path="/participant/dashboard" element={
            <ProtectedRoute allowedRoles={['participant']}>
              <ParticipantDashboard />
            </ProtectedRoute>
          } />
          <Route path="/participant/profile" element={
            <ProtectedRoute allowedRoles={['participant']}>
              <ParticipantProfile />
            </ProtectedRoute>
          } />
          <Route path="/participant/services" element={
            <ProtectedRoute allowedRoles={['participant']}>
              <ServiceRequests />
            </ProtectedRoute>
          } />
          <Route path="/participant/messages" element={
            <ProtectedRoute allowedRoles={['participant']}>
              <ParticipantMessages />
            </ProtectedRoute>
          } />
          <Route path="/participant/documents" element={
            <ProtectedRoute allowedRoles={['participant']}>
              <ParticipantDocuments />
            </ProtectedRoute>
          } />
          <Route path="/participant/invoices" element={
            <ProtectedRoute allowedRoles={['participant']}>
              <ParticipantInvoices />
            </ProtectedRoute>
          } />

          {/* Worker routes */}
          <Route path="/worker/onboarding" element={
            <ProtectedRoute allowedRoles={['support_worker']}>
              <WorkerOnboarding />
            </ProtectedRoute>
          } />
          <Route path="/worker/application-pending" element={
            <ProtectedRoute allowedRoles={['support_worker']}>
              <ApplicationPending />
            </ProtectedRoute>
          } />
          <Route path="/worker/dashboard" element={
            <ProtectedRoute allowedRoles={['support_worker']}>
              <WorkerDashboard />
            </ProtectedRoute>
          } />
          <Route path="/worker/profile" element={
            <ProtectedRoute allowedRoles={['support_worker']}>
              <WorkerProfile />
            </ProtectedRoute>
          } />
          <Route path="/worker/shifts" element={
            <ProtectedRoute allowedRoles={['support_worker']}>
              <WorkerShifts />
            </ProtectedRoute>
          } />
          <Route path="/worker/messages" element={
            <ProtectedRoute allowedRoles={['support_worker']}>
              <WorkerMessages />
            </ProtectedRoute>
          } />
          <Route path="/worker/compliance" element={
            <ProtectedRoute allowedRoles={['support_worker']}>
              <WorkerCompliance />
            </ProtectedRoute>
          } />
          <Route path="/worker/timesheets" element={
            <ProtectedRoute allowedRoles={['support_worker']}>
              <WorkerTimesheets />
            </ProtectedRoute>
          } />

          {/* Admin routes */}
          <Route path="/admin/dashboard" element={
            <ProtectedRoute allowedRoles={['admin', 'team_leader', 'compliance']}>
              <AdminDashboard />
            </ProtectedRoute>
          } />
          <Route path="/admin/workers" element={
            <ProtectedRoute allowedRoles={['admin', 'team_leader']}>
              <WorkerManagement />
            </ProtectedRoute>
          } />
          <Route path="/admin/participants" element={
            <ProtectedRoute allowedRoles={['admin', 'team_leader']}>
              <ParticipantManagement />
            </ProtectedRoute>
          } />
          <Route path="/admin/shifts" element={
            <ProtectedRoute allowedRoles={['admin', 'team_leader']}>
              <ShiftAssignment />
            </ProtectedRoute>
          } />
          <Route path="/admin/services" element={
            <ProtectedRoute allowedRoles={['admin', 'team_leader']}>
              <ServiceManagement />
            </ProtectedRoute>
          } />
          <Route path="/admin/timesheets" element={
            <ProtectedRoute allowedRoles={['admin', 'team_leader']}>
              <TimesheetApproval />
            </ProtectedRoute>
          } />
          <Route path="/admin/invoices" element={
            <ProtectedRoute allowedRoles={['admin', 'team_leader']}>
              <InvoiceManagement />
            </ProtectedRoute>
          } />
          <Route path="/admin/compliance" element={
            <ProtectedRoute allowedRoles={['admin', 'compliance']}>
              <ComplianceManagement />
            </ProtectedRoute>
          } />
          <Route path="/admin/financial" element={
            <ProtectedRoute allowedRoles={['admin']}>
              <FinancialManagement />
            </ProtectedRoute>
          } />
          <Route path="/admin/reports" element={
            <ProtectedRoute allowedRoles={['admin']}>
              <ReportsAnalytics />
            </ProtectedRoute>
          } />
          <Route path="/admin/notifications" element={
            <ProtectedRoute allowedRoles={['admin']}>
              <NotificationCenter />
            </ProtectedRoute>
          } />
          <Route path="/admin/users" element={
            <ProtectedRoute allowedRoles={['admin']}>
              <UserManagement />
            </ProtectedRoute>
          } />
          <Route path="/admin/settings" element={
            <ProtectedRoute allowedRoles={['admin']}>
              <SystemSettings />
            </ProtectedRoute>
          } />
          <Route path="/admin/audit" element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AuditLogs />
            </ProtectedRoute>
          } />
          <Route path="/admin/forms" element={
            <ProtectedRoute allowedRoles={['admin', 'compliance']}>
              <FormsManagement />
            </ProtectedRoute>
          } />
          <Route path="/admin/marketing" element={
            <ProtectedRoute allowedRoles={['admin']}>
              <MarketingManagement />
            </ProtectedRoute>
          } />
          <Route path="/admin/compliance-standards" element={
            <ProtectedRoute allowedRoles={['admin', 'compliance']}>
              <ComplianceStandards />
            </ProtectedRoute>
          } />
          <Route path="/admin/communications" element={
            <ProtectedRoute allowedRoles={['admin', 'team_leader']}>
              <AdminCommunications />
            </ProtectedRoute>
          } />

          {/* Form routes */}
          <Route path="/forms/service-agreement/:submissionId?" element={
            <ProtectedRoute allowedRoles={['participant', 'admin']}>
              <ServiceAgreementPage />
            </ProtectedRoute>
          } />
          <Route path="/forms/risk-assessment/:submissionId?" element={
            <ProtectedRoute allowedRoles={['participant', 'admin', 'support_worker']}>
              <RiskAssessmentPage />
            </ProtectedRoute>
          } />

          {/* Catch all redirect */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

// Route wrapper components for onboarding checks
const ParticipantRoutes: React.FC = () => {
  const { user } = useAuth();
  
  // Check if onboarding is needed
  if (!user?.profile_complete) {
    return (
      <Routes>
        <Route path="/onboarding" element={<ParticipantOnboarding />} />
        <Route path="*" element={<Navigate to="/participant/onboarding" replace />} />
      </Routes>
    );
  }
  
  return (
    <Routes>
      <Route path="/dashboard" element={<ParticipantDashboard />} />
      <Route path="/profile" element={<ParticipantProfile />} />
      <Route path="/services" element={<ServiceRequests />} />
      <Route path="/messages" element={<ParticipantMessages />} />
      <Route path="/documents" element={<ParticipantDocuments />} />
      <Route path="/invoices" element={<ParticipantInvoices />} />
      <Route path="/onboarding" element={<ParticipantOnboarding />} />
      <Route path="*" element={<Navigate to="/participant/dashboard" replace />} />
    </Routes>
  );
};

const WorkerRoutes: React.FC = () => {
  const { user } = useAuth();
  
  // Check if onboarding is needed
  if (!user?.profile_complete) {
    return (
      <Routes>
        <Route path="/onboarding" element={<WorkerOnboarding />} />
        <Route path="/application-pending" element={<ApplicationPending />} />
        <Route path="*" element={<Navigate to="/worker/onboarding" replace />} />
      </Routes>
    );
  }
  
  return (
    <Routes>
      <Route path="/dashboard" element={<WorkerDashboard />} />
      <Route path="/profile" element={<WorkerProfile />} />
      <Route path="/shifts" element={<WorkerShifts />} />
      <Route path="/messages" element={<WorkerMessages />} />
      <Route path="/compliance" element={<WorkerCompliance />} />
      <Route path="/timesheets" element={<WorkerTimesheets />} />
      <Route path="/onboarding" element={<WorkerOnboarding />} />
      <Route path="/application-pending" element={<ApplicationPending />} />
      <Route path="*" element={<Navigate to="/worker/dashboard" replace />} />
    </Routes>
  );
};

const AdminRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/dashboard" element={<AdminDashboard />} />
      <Route path="/workers" element={<WorkerManagement />} />
      <Route path="/participants" element={<ParticipantManagement />} />
      <Route path="/shifts" element={<ShiftAssignment />} />
      <Route path="/services" element={<ServiceManagement />} />
      <Route path="/timesheets" element={<TimesheetApproval />} />
      <Route path="/invoices" element={<InvoiceManagement />} />
      <Route path="/compliance" element={<ComplianceManagement />} />
      <Route path="/financial" element={<FinancialManagement />} />
      <Route path="/reports" element={<ReportsAnalytics />} />
      <Route path="/notifications" element={<NotificationCenter />} />
      <Route path="/users" element={<UserManagement />} />
      <Route path="/settings" element={<SystemSettings />} />
      <Route path="/audit" element={<AuditLogs />} />
      <Route path="/forms" element={<FormsManagement />} />
      <Route path="/marketing" element={<MarketingManagement />} />
      <Route path="/compliance-standards" element={<ComplianceStandards />} />
      <Route path="*" element={<Navigate to="/admin/dashboard" replace />} />
    </Routes>
  );
};

export default App;