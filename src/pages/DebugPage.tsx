import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

const DebugPage: React.FC = () => {
  const { user, loading, getDashboardStats } = useAuth();
  const stats = getDashboardStats();

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Debug Information</h1>

        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Authentication Status</h2>
          <div className="space-y-2">
            <p><strong>Loading:</strong> {loading ? 'Yes' : 'No'}</p>
            <p><strong>User Logged In:</strong> {user ? 'Yes' : 'No'}</p>
          </div>
        </div>

        {user && (
          <>
            <div className="bg-white rounded-lg shadow p-6 mb-6">
              <h2 className="text-xl font-semibold mb-4">User Information</h2>
              <pre className="bg-gray-100 p-4 rounded overflow-auto text-sm">
                {JSON.stringify(user, null, 2)}
              </pre>
            </div>

            <div className="bg-white rounded-lg shadow p-6 mb-6">
              <h2 className="text-xl font-semibold mb-4">Dashboard Stats</h2>
              <pre className="bg-gray-100 p-4 rounded overflow-auto text-sm">
                {JSON.stringify(stats, null, 2)}
              </pre>
            </div>

            <div className="bg-white rounded-lg shadow p-6 mb-6">
              <h2 className="text-xl font-semibold mb-4">Navigation Links</h2>
              <div className="space-y-2">
                {user.role === 'participant' && (
                  <>
                    <Link to="/participant/dashboard" className="block text-blue-600 hover:underline">Participant Dashboard</Link>
                    <Link to="/participant/services" className="block text-blue-600 hover:underline">Services</Link>
                  </>
                )}
                {user.role === 'support_worker' && (
                  <>
                    <Link to="/worker/dashboard" className="block text-blue-600 hover:underline">Worker Dashboard</Link>
                    <Link to="/worker/shifts" className="block text-blue-600 hover:underline">Shifts</Link>
                  </>
                )}
                {(user.role === 'admin' || user.role === 'team_leader' || user.role === 'compliance') && (
                  <>
                    <Link to="/admin/dashboard" className="block text-blue-600 hover:underline">Admin Dashboard</Link>
                    <Link to="/admin/workers" className="block text-blue-600 hover:underline">Workers</Link>
                  </>
                )}
              </div>
            </div>
          </>
        )}

        {!user && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
            <p className="text-yellow-800">No user logged in. <Link to="/login" className="text-blue-600 hover:underline">Go to login</Link></p>
          </div>
        )}
      </div>
    </div>
  );
};

export default DebugPage;
