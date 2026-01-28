import { supabase } from '../lib/supabase';
import { DashboardStats } from '../types';

class DashboardService {
  async getParticipantStats(participantId: string): Promise<DashboardStats['participant']> {
    if (!supabase) {
      return {
        upcomingServices: 3,
        totalBudget: 45000,
        usedBudget: 12500,
        remainingBudget: 32500,
        activeWorkers: 2,
        unreadMessages: 2,
        pendingInvoices: 1,
        planExpiryDays: 287
      };
    }

    const { data: participant } = await supabase
      .from('participants')
      .select('plan_budget, plan_end_date')
      .eq('id', participantId)
      .maybeSingle();

    const { count: upcomingShifts } = await supabase
      .from('shifts')
      .select('*', { count: 'exact', head: true })
      .eq('participant_id', participantId)
      .in('status', ['confirmed', 'assigned'])
      .gte('scheduled_date', new Date().toISOString().split('T')[0]);

    const { data: invoices } = await supabase
      .from('invoices')
      .select('total_amount, status')
      .eq('participant_id', participantId);

    const totalBudget = participant?.plan_budget || 0;
    const usedBudget = invoices?.filter(inv => ['sent', 'approved', 'paid'].includes(inv.status))
      .reduce((sum, inv) => sum + Number(inv.total_amount), 0) || 0;
    const pendingInvoices = invoices?.filter(inv => ['sent', 'viewed'].includes(inv.status)).length || 0;

    const { count: unreadMessages } = await supabase
      .from('messages')
      .select('*', { count: 'exact', head: true })
      .eq('to_id', participantId)
      .eq('read', false);

    const { data: activeWorkersData } = await supabase
      .from('shifts')
      .select('worker_id')
      .eq('participant_id', participantId)
      .in('status', ['confirmed', 'completed'])
      .not('worker_id', 'is', null);

    const uniqueWorkers = new Set(activeWorkersData?.map(s => s.worker_id));

    const planExpiryDate = participant?.plan_end_date ? new Date(participant.plan_end_date) : null;
    const planExpiryDays = planExpiryDate
      ? Math.ceil((planExpiryDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
      : 0;

    return {
      upcomingServices: upcomingShifts || 0,
      totalBudget,
      usedBudget,
      remainingBudget: totalBudget - usedBudget,
      activeWorkers: uniqueWorkers.size,
      unreadMessages: unreadMessages || 0,
      pendingInvoices,
      planExpiryDays
    };
  }

  async getWorkerStats(workerId: string): Promise<DashboardStats['worker']> {
    if (!supabase) {
      return {
        weeklyEarnings: 1248.50,
        hoursWorked: 28.5,
        upcomingShifts: 4,
        activeParticipants: 8,
        averageRating: 4.8,
        complianceStatus: 'compliant',
        pendingTimesheets: 2,
        unreadMessages: 3
      };
    }

    const weekStart = new Date();
    weekStart.setDate(weekStart.getDate() - weekStart.getDay());
    const weekStartStr = weekStart.toISOString().split('T')[0];

    const { data: timesheets } = await supabase
      .from('timesheets')
      .select('billable_hours, schads_calculation, status')
      .eq('worker_id', workerId)
      .gte('service_date', weekStartStr);

    const hoursWorked = timesheets?.reduce((sum, ts) => sum + Number(ts.billable_hours), 0) || 0;
    const weeklyEarnings = timesheets?.filter(ts => ts.status === 'approved')
      .reduce((sum, ts) => {
        const calc = ts.schads_calculation as any;
        return sum + (calc?.total_payment || 0);
      }, 0) || 0;

    const { count: upcomingShifts } = await supabase
      .from('shifts')
      .select('*', { count: 'exact', head: true })
      .eq('worker_id', workerId)
      .in('status', ['assigned', 'confirmed'])
      .gte('scheduled_date', new Date().toISOString().split('T')[0]);

    const { data: participantsData } = await supabase
      .from('shifts')
      .select('participant_id')
      .eq('worker_id', workerId)
      .in('status', ['confirmed', 'completed']);

    const uniqueParticipants = new Set(participantsData?.map(s => s.participant_id));

    const { count: pendingTimesheets } = await supabase
      .from('timesheets')
      .select('*', { count: 'exact', head: true })
      .eq('worker_id', workerId)
      .eq('status', 'draft');

    const { count: unreadMessages } = await supabase
      .from('messages')
      .select('*', { count: 'exact', head: true })
      .eq('to_id', workerId)
      .eq('read', false);

    const { data: worker } = await supabase
      .from('support_workers')
      .select('compliance_status')
      .eq('id', workerId)
      .maybeSingle();

    const complianceStatus = worker?.compliance_status?.status || 'compliant';

    return {
      weeklyEarnings,
      hoursWorked,
      upcomingShifts: upcomingShifts || 0,
      activeParticipants: uniqueParticipants.size,
      averageRating: 4.8,
      complianceStatus,
      pendingTimesheets: pendingTimesheets || 0,
      unreadMessages: unreadMessages || 0
    };
  }

  async getAdminStats(): Promise<DashboardStats['admin']> {
    if (!supabase) {
      return {
        totalParticipants: 342,
        activeWorkers: 156,
        pendingApplications: 23,
        monthlyRevenue: 145820,
        servicesCompleted: 1247,
        complianceIssues: 8,
        systemAlerts: 4,
        averageResponseTime: 2.3
      };
    }

    const { count: totalParticipants } = await supabase
      .from('participants')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'active');

    const { count: activeWorkers } = await supabase
      .from('support_workers')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'active');

    const { count: pendingApplications } = await supabase
      .from('support_workers')
      .select('*', { count: 'exact', head: true })
      .eq('application_status', 'pending');

    const monthStart = new Date();
    monthStart.setDate(1);
    const monthStartStr = monthStart.toISOString().split('T')[0];

    const { data: monthlyInvoices } = await supabase
      .from('invoices')
      .select('total_amount')
      .gte('issue_date', monthStartStr)
      .eq('status', 'paid');

    const monthlyRevenue = monthlyInvoices?.reduce((sum, inv) => sum + Number(inv.total_amount), 0) || 0;

    const { count: servicesCompleted } = await supabase
      .from('shifts')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'completed')
      .gte('scheduled_date', monthStartStr);

    const { data: expiredDocs } = await supabase
      .from('documents')
      .select('id')
      .not('expiry_date', 'is', null)
      .lt('expiry_date', new Date().toISOString().split('T')[0]);

    const { count: systemAlerts } = await supabase
      .from('notifications')
      .select('*', { count: 'exact', head: true })
      .eq('type', 'system_update')
      .eq('read', false);

    return {
      totalParticipants: totalParticipants || 0,
      activeWorkers: activeWorkers || 0,
      pendingApplications: pendingApplications || 0,
      monthlyRevenue,
      servicesCompleted: servicesCompleted || 0,
      complianceIssues: expiredDocs?.length || 0,
      systemAlerts: systemAlerts || 0,
      averageResponseTime: 2.3
    };
  }

  async getDashboardStats(userId: string, role: string, roleSpecificId?: string): Promise<DashboardStats | null> {
    try {
      switch (role) {
        case 'participant':
          if (!roleSpecificId) return null;
          return {
            participant: await this.getParticipantStats(roleSpecificId)
          };

        case 'support_worker':
          if (!roleSpecificId) return null;
          return {
            worker: await this.getWorkerStats(roleSpecificId)
          };

        case 'admin':
        case 'team_leader':
        case 'compliance':
          return {
            admin: await this.getAdminStats()
          };

        default:
          return null;
      }
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      return null;
    }
  }
}

export const dashboardService = new DashboardService();
export default dashboardService;
