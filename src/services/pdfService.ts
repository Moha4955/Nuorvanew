export interface InvoicePDFData {
  invoiceNumber: string;
  issueDate: string;
  dueDate: string;
  participantName: string;
  participantAddress?: string;
  participantNDIS?: string;
  items: Array<{
    description: string;
    quantity: number;
    rate: number;
    amount: number;
  }>;
  subtotal: number;
  gst: number;
  total: number;
  notes?: string;
}

export interface TimesheetPDFData {
  workerName: string;
  periodStart: string;
  periodEnd: string;
  entries: Array<{
    date: string;
    participant: string;
    startTime: string;
    endTime: string;
    hours: number;
    rate: number;
    total: number;
  }>;
  totalHours: number;
  totalAmount: number;
}

class PDFService {
  generateInvoiceHTML(data: InvoicePDFData): string {
    return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Invoice ${data.invoiceNumber}</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: Arial, sans-serif; color: #333; line-height: 1.6; padding: 40px; }
    .invoice-container { max-width: 800px; margin: 0 auto; border: 2px solid #10b981; border-radius: 8px; padding: 40px; }
    .header { display: flex; justify-content: space-between; align-items: start; margin-bottom: 40px; padding-bottom: 20px; border-bottom: 2px solid #10b981; }
    .logo { font-size: 28px; font-weight: bold; color: #10b981; }
    .invoice-details { text-align: right; }
    .invoice-number { font-size: 24px; font-weight: bold; color: #10b981; margin-bottom: 10px; }
    .date-info { font-size: 14px; color: #666; }
    .date-info div { margin-bottom: 5px; }
    .party-info { display: flex; justify-content: space-between; margin-bottom: 40px; }
    .party-section { flex: 1; }
    .party-section h3 { color: #10b981; margin-bottom: 10px; font-size: 16px; }
    .party-section p { font-size: 14px; margin-bottom: 5px; }
    .items-table { width: 100%; border-collapse: collapse; margin-bottom: 30px; }
    .items-table thead { background-color: #10b981; color: white; }
    .items-table th { padding: 12px; text-align: left; font-weight: 600; }
    .items-table td { padding: 12px; border-bottom: 1px solid #e5e7eb; }
    .items-table tbody tr:hover { background-color: #f3f4f6; }
    .text-right { text-align: right; }
    .totals-section { margin-left: auto; width: 300px; }
    .totals-row { display: flex; justify-content: space-between; padding: 8px 0; font-size: 14px; }
    .totals-row.subtotal { border-top: 1px solid #e5e7eb; }
    .totals-row.total { border-top: 2px solid #10b981; margin-top: 10px; padding-top: 10px; font-size: 18px; font-weight: bold; color: #10b981; }
    .notes-section { margin-top: 40px; padding-top: 20px; border-top: 1px solid #e5e7eb; }
    .notes-section h3 { color: #10b981; margin-bottom: 10px; font-size: 16px; }
    .notes-section p { font-size: 14px; color: #666; }
    .footer { margin-top: 40px; padding-top: 20px; border-top: 1px solid #e5e7eb; text-align: center; font-size: 12px; color: #999; }
    @media print {
      body { padding: 0; }
      .invoice-container { border: none; }
    }
  </style>
</head>
<body>
  <div class="invoice-container">
    <div class="header">
      <div>
        <div class="logo">Nurova Australia</div>
        <p style="color: #666; font-size: 14px;">NDIS Support Services</p>
        <p style="color: #666; font-size: 12px; margin-top: 5px;">ABN: 12 345 678 901</p>
      </div>
      <div class="invoice-details">
        <div class="invoice-number">INVOICE</div>
        <div class="invoice-number" style="font-size: 18px;">#${data.invoiceNumber}</div>
        <div class="date-info">
          <div><strong>Issue Date:</strong> ${data.issueDate}</div>
          <div><strong>Due Date:</strong> ${data.dueDate}</div>
        </div>
      </div>
    </div>

    <div class="party-info">
      <div class="party-section">
        <h3>From:</h3>
        <p><strong>Nurova Australia</strong></p>
        <p>Level 1, 123 Collins Street</p>
        <p>Melbourne VIC 3000</p>
        <p>Phone: 1800 NUROVA</p>
        <p>Email: finance@nurova.com.au</p>
      </div>
      <div class="party-section">
        <h3>Bill To:</h3>
        <p><strong>${data.participantName}</strong></p>
        ${data.participantAddress ? `<p>${data.participantAddress}</p>` : ''}
        ${data.participantNDIS ? `<p>NDIS Number: ${data.participantNDIS}</p>` : ''}
      </div>
    </div>

    <table class="items-table">
      <thead>
        <tr>
          <th>Description</th>
          <th class="text-right">Quantity</th>
          <th class="text-right">Rate</th>
          <th class="text-right">Amount</th>
        </tr>
      </thead>
      <tbody>
        ${data.items.map(item => `
          <tr>
            <td>${item.description}</td>
            <td class="text-right">${item.quantity}</td>
            <td class="text-right">$${item.rate.toFixed(2)}</td>
            <td class="text-right">$${item.amount.toFixed(2)}</td>
          </tr>
        `).join('')}
      </tbody>
    </table>

    <div class="totals-section">
      <div class="totals-row subtotal">
        <span>Subtotal:</span>
        <span>$${data.subtotal.toFixed(2)}</span>
      </div>
      <div class="totals-row">
        <span>GST (10%):</span>
        <span>$${data.gst.toFixed(2)}</span>
      </div>
      <div class="totals-row total">
        <span>Total:</span>
        <span>$${data.total.toFixed(2)}</span>
      </div>
    </div>

    ${data.notes ? `
      <div class="notes-section">
        <h3>Notes:</h3>
        <p>${data.notes}</p>
      </div>
    ` : ''}

    <div class="footer">
      <p>Thank you for choosing Nurova Australia for your NDIS support services.</p>
      <p style="margin-top: 10px;">Payment is due within 14 days. Please reference invoice number ${data.invoiceNumber}.</p>
      <p style="margin-top: 10px;">This invoice is NDIS compliant and includes all required information for claiming.</p>
    </div>
  </div>
</body>
</html>
    `;
  }

  async downloadInvoicePDF(data: InvoicePDFData): Promise<void> {
    const html = this.generateInvoiceHTML(data);
    const blob = new Blob([html], { type: 'text/html' });
    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.download = `invoice_${data.invoiceNumber}.html`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  async printInvoice(data: InvoicePDFData): Promise<void> {
    const html = this.generateInvoiceHTML(data);
    const printWindow = window.open('', '_blank');

    if (printWindow) {
      printWindow.document.write(html);
      printWindow.document.close();
      printWindow.focus();

      setTimeout(() => {
        printWindow.print();
      }, 250);
    }
  }

  generateTimesheetHTML(data: {
    workerName: string;
    periodStart: string;
    periodEnd: string;
    entries: Array<{
      date: string;
      participant: string;
      startTime: string;
      endTime: string;
      hours: number;
      rate: number;
      total: number;
    }>;
    totalHours: number;
    totalAmount: number;
  }): string {
    return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Timesheet - ${data.workerName}</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: Arial, sans-serif; color: #333; line-height: 1.6; padding: 40px; }
    .timesheet-container { max-width: 900px; margin: 0 auto; border: 2px solid #10b981; border-radius: 8px; padding: 40px; }
    .header { text-align: center; margin-bottom: 30px; padding-bottom: 20px; border-bottom: 2px solid #10b981; }
    .logo { font-size: 28px; font-weight: bold; color: #10b981; margin-bottom: 10px; }
    .timesheet-info { display: flex; justify-content: space-between; margin-bottom: 30px; }
    .entries-table { width: 100%; border-collapse: collapse; margin-bottom: 30px; }
    .entries-table thead { background-color: #10b981; color: white; }
    .entries-table th { padding: 12px; text-align: left; font-weight: 600; font-size: 14px; }
    .entries-table td { padding: 12px; border-bottom: 1px solid #e5e7eb; font-size: 14px; }
    .text-right { text-align: right; }
    .totals { margin-left: auto; width: 400px; }
    .totals-row { display: flex; justify-content: space-between; padding: 12px; font-size: 16px; }
    .totals-row.grand-total { background-color: #10b981; color: white; font-weight: bold; font-size: 18px; border-radius: 4px; margin-top: 10px; }
    @media print {
      body { padding: 0; }
      .timesheet-container { border: none; }
    }
  </style>
</head>
<body>
  <div class="timesheet-container">
    <div class="header">
      <div class="logo">Nurova Australia</div>
      <h2>Support Worker Timesheet</h2>
    </div>

    <div class="timesheet-info">
      <div>
        <p><strong>Worker:</strong> ${data.workerName}</p>
      </div>
      <div>
        <p><strong>Period:</strong> ${data.periodStart} to ${data.periodEnd}</p>
      </div>
    </div>

    <table class="entries-table">
      <thead>
        <tr>
          <th>Date</th>
          <th>Participant</th>
          <th>Start Time</th>
          <th>End Time</th>
          <th class="text-right">Hours</th>
          <th class="text-right">Rate</th>
          <th class="text-right">Amount</th>
        </tr>
      </thead>
      <tbody>
        ${data.entries.map(entry => `
          <tr>
            <td>${entry.date}</td>
            <td>${entry.participant}</td>
            <td>${entry.startTime}</td>
            <td>${entry.endTime}</td>
            <td class="text-right">${entry.hours.toFixed(2)}</td>
            <td class="text-right">$${entry.rate.toFixed(2)}</td>
            <td class="text-right">$${entry.total.toFixed(2)}</td>
          </tr>
        `).join('')}
      </tbody>
    </table>

    <div class="totals">
      <div class="totals-row">
        <span>Total Hours:</span>
        <span>${data.totalHours.toFixed(2)}</span>
      </div>
      <div class="totals-row grand-total">
        <span>Total Amount:</span>
        <span>$${data.totalAmount.toFixed(2)}</span>
      </div>
    </div>
  </div>
</body>
</html>
    `;
  }
}

export const pdfService = new PDFService();
export default pdfService;
