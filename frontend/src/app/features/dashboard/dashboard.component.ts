import { Component, inject, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../core/services/api.service';
import { AuthService } from '../../core/services/auth.service';

type DashTab = 'rfq' | 'po' | 'gr';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="fade-in">
      <!-- ─── Stat Cards ──────────────────────────── -->
      <div class="stats-row">
        <div class="stat-card">
          <div class="stat-icon" style="background:linear-gradient(135deg,#dbeafe,#bfdbfe);">
            <svg width="22" height="22" fill="none" stroke="#1d4ed8" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/>
            </svg>
          </div>
          <div>
            <div class="stat-label">RFQ Records</div>
            <div class="stat-value">{{ rfqData.length }}</div>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon" style="background:linear-gradient(135deg,#d1fae5,#a7f3d0);">
            <svg width="22" height="22" fill="none" stroke="#065f46" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"/>
            </svg>
          </div>
          <div>
            <div class="stat-label">Purchase Orders</div>
            <div class="stat-value">{{ poData.length }}</div>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon" style="background:linear-gradient(135deg,#fef3c7,#fde68a);">
            <svg width="22" height="22" fill="none" stroke="#92400e" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/>
            </svg>
          </div>
          <div>
            <div class="stat-label">Goods Receipts</div>
            <div class="stat-value">{{ grData.length }}</div>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon" style="background:linear-gradient(135deg,#ede9fe,#ddd6fe);">
            <svg width="22" height="22" fill="none" stroke="#5b21b6" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
          </div>
          <div>
            <div class="stat-label">Vendor ID</div>
            <div class="stat-value" style="font-size:16px;">{{ lifnr }}</div>
          </div>
        </div>
      </div>

      <!-- ─── Tabs ────────────────────────────────── -->
      <div class="vp-card" style="margin-top:24px;">
        <div class="section-header">
          <div>
            <div class="section-title">Transaction Overview</div>
            <div class="section-subtitle">Real-time data from SAP OData service</div>
          </div>
          <div class="vp-tabs">
            <button class="vp-tab" [class.active]="activeTab==='rfq'" (click)="switchTab('rfq')">
              RFQ
            </button>
            <button class="vp-tab" [class.active]="activeTab==='po'" (click)="switchTab('po')">
              Purchase Orders
            </button>
            <button class="vp-tab" [class.active]="activeTab==='gr'" (click)="switchTab('gr')">
              Goods Receipts
            </button>
          </div>
        </div>

        <!-- Loading -->
        <div class="vp-spinner" *ngIf="isLoading">
          <div class="spinner-ring"></div>
          <span>Loading {{ tabLabel }} data from SAP…</span>
        </div>

        <!-- Error -->
        <div class="vp-error-banner" *ngIf="currentError && !isLoading">
          <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
          </svg>
          {{ currentError }}
          <button class="btn btn-sm" (click)="loadAll()" style="margin-left:10px; padding:2px 8px; font-size:11px;">Retry</button>
        </div>

        <!-- RFQ Table -->
        <div *ngIf="activeTab==='rfq' && !isLoading && !currentError">
          <div class="vp-table-wrapper" *ngIf="rfqData.length > 0; else emptyRFQ">
            <table class="vp-table">
              <thead>
                <tr>
                  <th>RFQ Number</th>
                  <th>Category</th>
                  <th>Type</th>
                  <th>Purch. Org</th>
                  <th>Purch. Group</th>
                  <th>Doc. Date</th>
                  <th>Currency</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                <tr *ngFor="let r of rfqData">
                  <td><strong>{{ r.Ebeln || '—' }}</strong></td>
                  <td>{{ r.Bstyp || '—' }}</td>
                  <td>{{ r.Bsart || '—' }}</td>
                  <td>{{ r.Ekorg || '—' }}</td>
                  <td>{{ r.Ekgrp || '—' }}</td>
                  <td>{{ formatDate(r.Bedat) }}</td>
                  <td>{{ r.Waers || '—' }}</td>
                  <td>
                    <span class="badge" [class]="getBadgeClass(r.Statu || '')">
                      {{ r.Statu === 'A' ? 'Active' : (r.Statu || 'Open') }}
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <ng-template #emptyRFQ>
            <div class="vp-empty">
              <svg width="48" height="48" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/>
              </svg>
              <p>No RFQ records found for Vendor {{ lifnr }}</p>
            </div>
          </ng-template>
        </div>

        <!-- PO Table -->
        <div *ngIf="activeTab==='po' && !isLoading && !currentError">
          <div class="vp-table-wrapper" *ngIf="poData.length > 0; else emptyPO">
            <table class="vp-table">
              <thead>
                <tr>
                  <th>PO Number</th><th>Vendor</th><th>Item</th><th>Description</th>
                  <th>Qty</th><th>UOM</th><th>Net Value</th><th>Currency</th><th>Delivery Date</th><th>Status</th>
                </tr>
              </thead>
              <tbody>
                <tr *ngFor="let r of poData">
                  <td><strong>{{ r.Ebeln || r.Ponumber || '—' }}</strong></td>
                  <td>{{ r.Lifnr || r.Vendor || '—' }}</td>
                  <td>{{ r.Ebelp || r.Item || '—' }}</td>
                  <td>{{ r.Txz01 || r.Description || '—' }}</td>
                  <td>{{ r.Menge || r.Qty || '—' }}</td>
                  <td>{{ r.Meins || r.Uom || '—' }}</td>
                  <td>{{ r.Netwr || r.Netvalue || r.NetValue || '—' }}</td>
                  <td>{{ r.Waers || r.Currency || '—' }}</td>
                  <td>{{ formatDate(r.Eindt || r.Deliverydate || r.DeliveryDate) }}</td>
                  <td><span class="badge" [class]="getBadgeClass(r.Elikz || r.Status || '')">{{ r.Status || getPoStatus(r.Elikz) }}</span></td>
                </tr>
              </tbody>
            </table>
          </div>
          <ng-template #emptyPO>
            <div class="vp-empty">
              <svg width="48" height="48" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"/>
              </svg>
              <p>No Purchase Orders found for Vendor {{ lifnr }}</p>
            </div>
          </ng-template>
        </div>

        <!-- GR Table -->
        <div *ngIf="activeTab==='gr' && !isLoading && !currentError">
          <div class="vp-table-wrapper" *ngIf="grData.length > 0; else emptyGR">
            <table class="vp-table">
              <thead>
                <tr>
                  <th>GR Number</th><th>PO Number</th><th>Material</th><th>Description</th>
                  <th>Qty</th><th>UOM</th><th>Plant</th><th>Storage Loc</th><th>Posting Date</th><th>Status</th>
                </tr>
              </thead>
              <tbody>
                <tr *ngFor="let r of grData">
                  <td><strong>{{ r.Mblnr || r.Grnumber || '—' }}</strong></td>
                  <td>{{ r.Ebeln || r.Ponumber || '—' }}</td>
                  <td>{{ r.Matnr || r.Material || '—' }}</td>
                  <td>{{ r.Maktx || r.Description || '—' }}</td>
                  <td>{{ r.Erfmg || r.Qty || r.Menge || '—' }}</td>
                  <td>{{ r.Meins || r.Uom || '—' }}</td>
                  <td>{{ r.Werks || r.Plant || '—' }}</td>
                  <td>{{ r.Lgort || r.Storageloc || '—' }}</td>
                  <td>{{ formatDate(r.Budat || r.Postingdate) }}</td>
                  <td><span class="badge badge-success">Posted</span></td>
                </tr>
              </tbody>
            </table>
          </div>
          <ng-template #emptyGR>
            <div class="vp-empty">
              <svg width="48" height="48" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/>
              </svg>
              <p>No Goods Receipts found for Vendor {{ lifnr }}</p>
            </div>
          </ng-template>
        </div>

      </div>
    </div>
  `,
  styles: [`
    .stats-row { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; }
    @media (max-width: 1100px) { .stats-row { grid-template-columns: repeat(2,1fr); } }
  `]
})
export class DashboardComponent implements OnInit {
  api = inject(ApiService);
  auth = inject(AuthService);
  cdr = inject(ChangeDetectorRef);

  activeTab: DashTab = 'rfq';
  
  // Granular states
  loading = { rfq: false, po: false, gr: false };
  errors = { rfq: '', po: '', gr: '' };

  rfqData: any[] = [];
  poData: any[] = [];
  grData: any[] = [];

  get lifnr(): string { return this.auth.currentUserValue?.lifnr ?? ''; }
  get tabLabel(): string { return { rfq: 'RFQ', po: 'Purchase Order', gr: 'Goods Receipt' }[this.activeTab]; }
  
  // Helpers for template
  get isLoading(): boolean { return this.loading[this.activeTab]; }
  get currentError(): string { return this.errors[this.activeTab]; }

  ngOnInit(): void { this.loadAll(); }

  loadAll(): void {
    this.loadRFQ();
    this.loadPO();
    this.loadGR();
  }

  switchTab(tab: DashTab): void {
    this.activeTab = tab;
  }

  loadRFQ(): void {
    this.loading.rfq = true; this.errors.rfq = '';
    this.api.get<any>(`dashboard/rfq/${this.lifnr}`).subscribe({
      next: (r) => { 
        this.rfqData = r ?? []; 
        this.loading.rfq = false; 
        this.cdr.detectChanges();
      },
      error: (e) => { 
        this.errors.rfq = e.error?.error || 'Unable to fetch RFQs. SAP service might be unavailable.'; 
        this.loading.rfq = false; 
        this.cdr.detectChanges();
      }
    });
  }

  loadPO(): void {
    this.loading.po = true; this.errors.po = '';
    this.api.get<any>(`dashboard/po/${this.lifnr}`).subscribe({
      next: (r) => { 
        this.poData = r ?? []; 
        this.loading.po = false; 
        this.cdr.detectChanges();
      },
      error: (e) => { 
        this.errors.po = 'PO Service Error (500): The SAP server encountered an internal error while fetching Purchase Orders.';
        this.loading.po = false; 
        this.cdr.detectChanges();
      }
    });
  }

  loadGR(): void {
    this.loading.gr = true; this.errors.gr = '';
    this.api.get<any>(`dashboard/gr/${this.lifnr}`).subscribe({
      next: (r) => { 
        this.grData = r ?? []; 
        this.loading.gr = false; 
        this.cdr.detectChanges();
      },
      error: (e) => { 
        this.errors.gr = e.error?.error || 'Unable to fetch Goods Receipts.';
        this.loading.gr = false; 
        this.cdr.detectChanges();
      }
    });
  }

  formatDate(val: any): string {
    if (!val) return '—';
    // SAP OData date: /Date(1234567890000)/ or T00:00:00
    const match = String(val).match(/\/Date\((\d+)\)\//);
    if (match) return new Date(parseInt(match[1])).toLocaleDateString('en-IN');
    return String(val).substring(0, 10);
  }

  getBadgeClass(status: string): string {
    const s = (status || '').toLowerCase();
    if (['open', 'new', 'pending', 'a'].includes(s)) return 'badge badge-info';
    if (['posted', 'completed', 'success', 'x'].includes(s)) return 'badge badge-success';
    if (['partial'].includes(s)) return 'badge badge-warning';
    if (['cancelled', 'rejected'].includes(s)) return 'badge badge-danger';
    return 'badge badge-gray';
  }

  getPoStatus(elikz: string): string {
    if (!elikz) return 'Open';
    return elikz === 'X' ? 'Delivered' : 'Partial';
  }
}
