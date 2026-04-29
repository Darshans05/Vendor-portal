import { Component, inject, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../core/services/api.service';
import { AuthService } from '../../core/services/auth.service';

type FinanceTab = 'invoice' | 'payaging' | 'cdmemo';

@Component({
  selector: 'app-finance',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="fade-in">

      <!-- ─── Finance Summary Cards ─────────────── -->
      <div class="stats-row">
        <div class="stat-card">
          <div class="stat-icon" style="background:linear-gradient(135deg,#dbeafe,#bfdbfe);">
            <svg width="22" height="22" fill="none" stroke="#1d4ed8" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
            </svg>
          </div>
          <div>
            <div class="stat-label">Invoices</div>
            <div class="stat-value">{{ invoiceData.length }}</div>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon" style="background:linear-gradient(135deg,#fef3c7,#fde68a);">
            <svg width="22" height="22" fill="none" stroke="#92400e" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
          </div>
          <div>
            <div class="stat-label">Pay Aging Records</div>
            <div class="stat-value">{{ payAgingData.length }}</div>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon" style="background:linear-gradient(135deg,#ede9fe,#ddd6fe);">
            <svg width="22" height="22" fill="none" stroke="#5b21b6" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"/>
            </svg>
          </div>
          <div>
            <div class="stat-label">CR/DR Memos</div>
            <div class="stat-value">{{ cdMemoData.length }}</div>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon" style="background:linear-gradient(135deg,#fee2e2,#fecaca);">
            <svg width="22" height="22" fill="none" stroke="#991b1b" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10"/>
            </svg>
          </div>
          <div>
            <div class="stat-label">Invoice PDF</div>
            <div class="stat-value" style="font-size:14px;margin-top:6px;">
              <button class="btn btn-danger" style="font-size:12px;padding:8px 14px;" (click)="downloadPDF()" [disabled]="pdfLoading">
                <span class="spinner-ring" *ngIf="pdfLoading" style="width:12px;height:12px;border-width:2px;"></span>
                {{ pdfLoading ? 'Loading…' : 'Download PDF' }}
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- PDF Error -->
      <div class="vp-error-banner" style="margin-top:16px;" *ngIf="pdfError">
        <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
        </svg>
        {{ pdfError }}
      </div>

      <!-- ─── Finance Tabs ───────────────────────── -->
      <div class="vp-card" style="margin-top:24px;">
        <div class="section-header">
          <div>
            <div class="section-title">Financial Sheet</div>
            <div class="section-subtitle">Invoice, Payment Aging & Credit/Debit Memos</div>
          </div>
          <div class="vp-tabs">
            <button class="vp-tab" [class.active]="activeTab==='invoice'" (click)="switchTab('invoice')">Invoice</button>
            <button class="vp-tab" [class.active]="activeTab==='payaging'" (click)="switchTab('payaging')">Pay Aging</button>
            <button class="vp-tab" [class.active]="activeTab==='cdmemo'" (click)="switchTab('cdmemo')">CR/DR Memo</button>
          </div>
        </div>

        <!-- Loading -->
        <div class="vp-spinner" *ngIf="loading">
          <div class="spinner-ring"></div>
          <span>Loading financial data from SAP…</span>
        </div>

        <!-- Error -->
        <div class="vp-error-banner" *ngIf="error && !loading">
          <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
          </svg>
          {{ error }}
        </div>

        <!-- ── Invoice Table ── -->
        <div *ngIf="activeTab==='invoice' && !loading && !error">
          <div class="vp-table-wrapper" *ngIf="invoiceData.length > 0; else emptyInvoice">
            <table class="vp-table">
              <thead>
                <tr>
                  <th>Invoice No</th>
                  <th>CoCode</th>
                  <th>Fiscal Year</th>
                  <th>Vendor</th>
                  <th>Amount (Gross)</th>
                  <th>Currency</th>
                  <th>Doc Date</th>
                  <th>Posting Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr *ngFor="let r of invoiceData">
                  <td><strong>{{ r.Belnr || '—' }}</strong></td>
                  <td>{{ r.Bukrs || '—' }}</td>
                  <td>{{ r.Gjahr || '—' }}</td>
                  <td>{{ r.Lifnr || '—' }}</td>
                  <td class="text-right"><strong>{{ r.Wrbtr || r.Dmbtr || '—' }}</strong></td>
                  <td><span class="badge badge-info">{{ r.Waers || '—' }}</span></td>
                  <td>{{ formatDate(r.Bldat) }}</td>
                  <td>{{ formatDate(r.Budat) }}</td>
                  <td>
                    <button class="btn btn-outline-danger" style="padding:4px 8px;font-size:11px;" (click)="downloadPDF(r.Belnr)">
                      <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                      </svg>
                      PDF
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <ng-template #emptyInvoice>
            <div class="vp-empty">
              <svg width="48" height="48" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
              </svg>
              <p>No Invoices found for Vendor {{ lifnr }}</p>
            </div>
          </ng-template>
        </div>

        <!-- ── Pay Aging Table ── -->
        <div *ngIf="activeTab==='payaging' && !loading && !error">
          <div class="vp-table-wrapper" *ngIf="payAgingData.length > 0; else emptyPay">
            <table class="vp-table">
              <thead>
                <tr>
                  <th>Doc No</th><th>Vendor</th><th>Doc Type</th><th>Amount</th>
                  <th>Currency</th><th>Overdue Days</th><th>Due Date</th><th>Posting Date</th><th>Aging Bucket</th>
                </tr>
              </thead>
              <tbody>
                <tr *ngFor="let r of payAgingData">
                  <td><strong>{{ r.Belnr || r.DocNo || '—' }}</strong></td>
                  <td>{{ r.Lifnr || r.Vendor || '—' }}</td>
                  <td>{{ r.Blart || r.DocType || '—' }}</td>
                  <td class="text-right"><strong>{{ r.Dmbtr || r.Amount || '—' }}</strong></td>
                  <td>{{ r.Waers || r.Currency || '—' }}</td>
                  <td>
                    <span class="badge" [class]="getAgingBadge(r.Overdue || r.Overdudays || '0')">
                      {{ r.Overdue || r.Overdudays || '0' }} days
                    </span>
                  </td>
                  <td>{{ formatDate(r.Zfbdt || r.DueDate) }}</td>
                  <td>{{ formatDate(r.Budat || r.Postingdate) }}</td>
                  <td><span class="badge" [class]="getAgingBadge(r.Overdue || '0')">{{ getAgingLabel(r.Overdue || r.Overdudays || '0') }}</span></td>
                </tr>
              </tbody>
            </table>
          </div>
          <ng-template #emptyPay>
            <div class="vp-empty">
              <svg width="48" height="48" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
              <p>No Payment Aging records found for Vendor {{ lifnr }}</p>
            </div>
          </ng-template>
        </div>

        <!-- ── CR/DR Memo Table ── -->
        <div *ngIf="activeTab==='cdmemo' && !loading && !error">
          <div class="vp-table-wrapper" *ngIf="cdMemoData.length > 0; else emptyMemo">
            <table class="vp-table">
              <thead>
                <tr>
                  <th>Memo No</th><th>Vendor</th><th>Type</th><th>Reference</th>
                  <th>Amount</th><th>Currency</th><th>Document Date</th><th>Posting Date</th><th>Text</th>
                </tr>
              </thead>
              <tbody>
                <tr *ngFor="let r of cdMemoData">
                  <td><strong>{{ r.Belnr || r.MemoNo || '—' }}</strong></td>
                  <td>{{ r.Lifnr || r.Vendor || '—' }}</td>
                  <td>
                    <span class="badge" [class]="r.Blart === 'KG' || r.Type === 'CR' ? 'badge-success' : 'badge-warning'">
                      {{ r.Blart || r.Type || '—' }}
                    </span>
                  </td>
                  <td>{{ r.Xblnr || r.Reference || '—' }}</td>
                  <td class="text-right">{{ r.Dmbtr || r.Amount || '—' }}</td>
                  <td>{{ r.Waers || r.Currency || '—' }}</td>
                  <td>{{ formatDate(r.Bldat || r.DocDate) }}</td>
                  <td>{{ formatDate(r.Budat || r.Postingdate) }}</td>
                  <td>{{ r.Sgtxt || r.Text || '—' }}</td>
                </tr>
              </tbody>
            </table>
          </div>
          <ng-template #emptyMemo>
            <div class="vp-empty">
              <svg width="48" height="48" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"/>
              </svg>
              <p>No CR/DR Memos found for Vendor {{ lifnr }}</p>
            </div>
          </ng-template>
        </div>

      </div>
    </div>
  `,
  styles: [`
    .stats-row { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; }
    @media (max-width: 1100px) { .stats-row { grid-template-columns: repeat(2,1fr); } }
    .text-right { text-align: right; font-family: monospace; }
  `]
})
export class FinanceComponent implements OnInit {
  api = inject(ApiService);
  auth = inject(AuthService);
  cdr = inject(ChangeDetectorRef);

  activeTab: FinanceTab = 'invoice';
  loading = false;
  error = '';
  pdfLoading = false;
  pdfError = '';

  invoiceData: any[] = [];
  payAgingData: any[] = [];
  cdMemoData: any[] = [];

  get lifnr(): string { return this.auth.currentUserValue?.lifnr ?? ''; }

  ngOnInit(): void { this.loadAll(); }

  loadAll(): void {
    this.loading = true; this.error = '';
    let done = 0;
    const check = () => { 
      if (++done === 3) {
        this.loading = false;
        this.cdr.detectChanges();
      }
    };

    this.api.get<any>(`finance/invoice/${this.lifnr}`).subscribe({
      next: (r) => { this.invoiceData = r ?? []; check(); },
      error: (e) => { this.error = e.error?.error || 'Failed to load invoice data'; check(); }
    });

    this.api.get<any>(`finance/payaging/${this.lifnr}`).subscribe({
      next: (r) => { this.payAgingData = r ?? []; check(); },
      error: () => check()
    });

    this.api.get<any>(`finance/cdmemo/${this.lifnr}`).subscribe({
      next: (r) => { this.cdMemoData = r ?? []; check(); },
      error: () => check()
    });
  }

  switchTab(tab: FinanceTab): void { this.activeTab = tab; }

  downloadPDF(belnr?: string): void {
    const targetBelnr = belnr || (this.invoiceData.length > 0 ? this.invoiceData[0].Belnr : null);
    if (!targetBelnr) {
      this.pdfError = 'Please select a valid invoice to download its PDF.';
      return;
    }
    this.pdfLoading = true; this.pdfError = '';
    this.api.getBlob(`finance/invoice-pdf/${this.lifnr}/${targetBelnr}`).subscribe({
      next: (blob) => {
        this.pdfLoading = false;
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `invoice_${this.lifnr}_${targetBelnr}.pdf`;
        a.click();
        // Also open in new tab for preview
        window.open(url, '_blank');
        setTimeout(() => URL.revokeObjectURL(url), 10000);
      },
      error: (e) => {
        this.pdfLoading = false;
        this.pdfError = e.error?.message || 'Invoice PDF not available. Ensure the OData entity supports $value stream.';
      }
    });
  }

  formatDate(val: any): string {
    if (!val) return '—';
    const match = String(val).match(/\/Date\((\d+)\)\//);
    if (match) return new Date(parseInt(match[1])).toLocaleDateString('en-IN');
    return String(val).substring(0, 10);
  }

  getBadgeClass(status: string): string {
    const s = (status || '').toLowerCase();
    if (['open', 'pending'].includes(s)) return 'badge badge-info';
    if (['paid', 'cleared', 'posted'].includes(s)) return 'badge badge-success';
    if (['partial'].includes(s)) return 'badge badge-warning';
    if (['blocked', 'rejected'].includes(s)) return 'badge badge-danger';
    return 'badge badge-gray';
  }

  getAgingBadge(days: any): string {
    const d = parseInt(String(days)) || 0;
    if (d <= 0) return 'badge badge-success';
    if (d <= 30) return 'badge badge-warning';
    if (d <= 60) return 'badge badge-danger';
    return 'badge badge-danger';
  }

  getAgingLabel(days: any): string {
    const d = parseInt(String(days)) || 0;
    if (d <= 0) return 'Current';
    if (d <= 30) return '1–30 days';
    if (d <= 60) return '31–60 days';
    if (d <= 90) return '61–90 days';
    return '90+ days';
  }
}
