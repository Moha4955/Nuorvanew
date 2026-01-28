class ExportService {
  exportToCSV(data: any[], filename: string, headers?: string[]): void {
    if (data.length === 0) {
      throw new Error('No data to export');
    }

    const csvHeaders = headers || Object.keys(data[0]);
    const csvRows = data.map(row =>
      csvHeaders.map(header => {
        const value = row[header];
        if (value === null || value === undefined) return '';
        if (typeof value === 'string' && (value.includes(',') || value.includes('"') || value.includes('\n'))) {
          return `"${value.replace(/"/g, '""')}"`;
        }
        return value;
      }).join(',')
    );

    const csv = [
      csvHeaders.join(','),
      ...csvRows
    ].join('\n');

    this.downloadFile(csv, `${filename}.csv`, 'text/csv');
  }

  exportWorkersToCSV(workers: any[]): void {
    const exportData = workers.map(worker => ({
      'Worker ID': worker.id,
      'First Name': worker.first_name,
      'Last Name': worker.last_name,
      'Email': worker.email,
      'Phone': worker.phone,
      'Status': worker.status,
      'Compliance Status': worker.compliance_status,
      'Date Joined': new Date(worker.created_at).toLocaleDateString('en-AU'),
      'Total Shifts': worker.completed_shifts || 0,
      'Rating': worker.rating || 'N/A'
    }));

    this.exportToCSV(exportData, `workers_export_${Date.now()}`);
  }

  exportParticipantsToCSV(participants: any[]): void {
    const exportData = participants.map(participant => ({
      'Participant ID': participant.id,
      'First Name': participant.first_name,
      'Last Name': participant.last_name,
      'Email': participant.email,
      'Phone': participant.phone,
      'NDIS Number': participant.ndis_number || 'N/A',
      'Plan Status': participant.plan_status,
      'Budget Remaining': participant.budget_remaining,
      'Date Registered': new Date(participant.created_at).toLocaleDateString('en-AU'),
      'Active Services': participant.active_services || 0
    }));

    this.exportToCSV(exportData, `participants_export_${Date.now()}`);
  }

  exportShiftsToCSV(shifts: any[]): void {
    const exportData = shifts.map(shift => ({
      'Shift ID': shift.id,
      'Date': new Date(shift.shift_date).toLocaleDateString('en-AU'),
      'Start Time': shift.start_time,
      'End Time': shift.end_time,
      'Worker': shift.worker_name,
      'Participant': shift.participant_name,
      'Service Type': shift.service_type,
      'Status': shift.status,
      'Hours': shift.hours,
      'Rate': `$${shift.rate}`,
      'Total': `$${shift.total}`
    }));

    this.exportToCSV(exportData, `shifts_export_${Date.now()}`);
  }

  exportInvoicesToCSV(invoices: any[]): void {
    const exportData = invoices.map(invoice => ({
      'Invoice Number': invoice.invoice_number,
      'Issue Date': new Date(invoice.issue_date).toLocaleDateString('en-AU'),
      'Due Date': new Date(invoice.due_date).toLocaleDateString('en-AU'),
      'Participant': invoice.participant_name,
      'Subtotal': `$${invoice.subtotal.toFixed(2)}`,
      'GST': `$${invoice.gst.toFixed(2)}`,
      'Total': `$${invoice.total.toFixed(2)}`,
      'Status': invoice.status,
      'Payment Date': invoice.payment_date ? new Date(invoice.payment_date).toLocaleDateString('en-AU') : 'Unpaid'
    }));

    this.exportToCSV(exportData, `invoices_export_${Date.now()}`);
  }

  exportTimesheetsToCSV(timesheets: any[]): void {
    const exportData = timesheets.map(timesheet => ({
      'Timesheet ID': timesheet.id,
      'Worker': timesheet.worker_name,
      'Participant': timesheet.participant_name,
      'Date': new Date(timesheet.date).toLocaleDateString('en-AU'),
      'Start Time': timesheet.start_time,
      'End Time': timesheet.end_time,
      'Hours': timesheet.hours,
      'Base Rate': `$${timesheet.base_rate}`,
      'Penalties': `$${timesheet.penalties || 0}`,
      'Total': `$${timesheet.total}`,
      'Status': timesheet.status,
      'Submitted': new Date(timesheet.submitted_at).toLocaleDateString('en-AU')
    }));

    this.exportToCSV(exportData, `timesheets_export_${Date.now()}`);
  }

  exportComplianceReportToCSV(workers: any[], documents: any[]): void {
    const exportData = workers.map(worker => {
      const workerDocs = documents.filter(doc => doc.worker_id === worker.id);
      const expiredDocs = workerDocs.filter(doc => {
        if (!doc.expiry_date) return false;
        return new Date(doc.expiry_date) < new Date();
      });
      const expiringSoonDocs = workerDocs.filter(doc => {
        if (!doc.expiry_date) return false;
        const daysUntilExpiry = Math.ceil(
          (new Date(doc.expiry_date).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
        );
        return daysUntilExpiry > 0 && daysUntilExpiry <= 30;
      });

      return {
        'Worker ID': worker.id,
        'Worker Name': `${worker.first_name} ${worker.last_name}`,
        'Email': worker.email,
        'Total Documents': workerDocs.length,
        'Verified Documents': workerDocs.filter(d => d.status === 'verified').length,
        'Expired Documents': expiredDocs.length,
        'Expiring Soon (30 days)': expiringSoonDocs.length,
        'Compliance Status': expiredDocs.length > 0 ? 'Non-Compliant' : 'Compliant',
        'Last Document Upload': workerDocs.length > 0
          ? new Date(Math.max(...workerDocs.map(d => new Date(d.created_at).getTime()))).toLocaleDateString('en-AU')
          : 'Never'
      };
    });

    this.exportToCSV(exportData, `compliance_report_${Date.now()}`);
  }

  exportFinancialReportToCSV(data: {
    period: string;
    totalRevenue: number;
    totalExpenses: number;
    totalInvoices: number;
    paidInvoices: number;
    overdueInvoices: number;
    workerPayments: number;
  }): void {
    const exportData = [{
      'Reporting Period': data.period,
      'Total Revenue': `$${data.totalRevenue.toFixed(2)}`,
      'Total Expenses': `$${data.totalExpenses.toFixed(2)}`,
      'Net Profit': `$${(data.totalRevenue - data.totalExpenses).toFixed(2)}`,
      'Total Invoices': data.totalInvoices,
      'Paid Invoices': data.paidInvoices,
      'Overdue Invoices': data.overdueInvoices,
      'Worker Payments': `$${data.workerPayments.toFixed(2)}`,
      'Generated': new Date().toLocaleDateString('en-AU')
    }];

    this.exportToCSV(exportData, `financial_report_${Date.now()}`);
  }

  private downloadFile(content: string, filename: string, mimeType: string): void {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  exportToJSON(data: any, filename: string): void {
    const json = JSON.stringify(data, null, 2);
    this.downloadFile(json, `${filename}.json`, 'application/json');
  }

  exportTableToExcel(tableId: string, filename: string): void {
    const table = document.getElementById(tableId);
    if (!table) {
      throw new Error('Table not found');
    }

    let html = '<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel">';
    html += '<head><meta charset="UTF-8"><!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets>';
    html += '<x:ExcelWorksheet><x:Name>Sheet1</x:Name><x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions>';
    html += '</x:ExcelWorksheet></x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]--></head><body>';
    html += table.outerHTML;
    html += '</body></html>';

    this.downloadFile(html, `${filename}.xls`, 'application/vnd.ms-excel');
  }
}

export const exportService = new ExportService();
export default exportService;
