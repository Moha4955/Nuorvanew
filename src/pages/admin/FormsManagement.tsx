import React from 'react';
import DashboardLayout from '../../components/Layout/DashboardLayout';
import ComplianceDashboard from '../../components/admin/ComplianceDashboard';
import PermissionGuard from '../../components/PermissionGuard';
import { PERMISSIONS } from '../../utils/permissions';

const FormsManagement: React.FC = () => {
  return (
    <DashboardLayout>
      <PermissionGuard 
        permissions={[PERMISSIONS.MANAGE_COMPLIANCE, PERMISSIONS.VIEW_PARTICIPANTS]}
        fallback={
          <div className="text-center py-12">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Access Restricted</h2>
            <p className="text-gray-600">You don't have permission to access form management.</p>
          </div>
        }
        showFallback={true}
      >
        <ComplianceDashboard />
      </PermissionGuard>
    </DashboardLayout>
  );
};

export default FormsManagement;