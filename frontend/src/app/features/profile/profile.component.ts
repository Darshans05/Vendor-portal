import { Component, inject, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../core/services/api.service';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="profile-container">
      <!-- Hero Banner -->
      <div class="profile-banner">
        <div class="banner-bg"></div>
        <div class="banner-content">
          <div class="vendor-avatar">
            <svg width="44" height="44" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
                d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/>
            </svg>
          </div>
          <div class="banner-info">
            <div class="vendor-name">{{ profile?.Name1 || 'Vendor Name' }}</div>
            <div class="vendor-id">LIFNR: {{ lifnr }}</div>
            <span class="badge badge-success" style="margin-top:8px;">Active Vendor</span>
          </div>
        </div>
      </div>

      <!-- Loading -->
      <div class="vp-spinner vp-card" style="margin-top:24px;" *ngIf="loading">
        <div class="spinner-ring"></div>
        <span>Fetching vendor master data from SAP…</span>
      </div>

      <!-- Error -->
      <div class="vp-card" style="margin-top:24px;" *ngIf="error && !loading">
        <div class="vp-error-banner">
          <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
          </svg>
          {{ error }}
        </div>
      </div>

      <!-- Profile Info Grid -->
      <div class="profile-grid" *ngIf="profile">
        <!-- Company Info -->
        <div class="vp-card">
          <div class="card-head">
            <div class="card-icon" style="background:linear-gradient(135deg,#dbeafe,#bfdbfe);">
              <svg width="18" height="18" fill="none" stroke="#1d4ed8" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/>
              </svg>
            </div>
            <div class="card-title">Company Information</div>
          </div>
          <div class="profile-fields">
            <div class="pf-row">
              <span class="pf-label">Company Name</span>
              <span class="pf-val">{{ profile.Name1 || '—' }}</span>
            </div>
            <div class="pf-row">
              <span class="pf-label">Vendor ID (LIFNR)</span>
              <span class="pf-val">{{ profile.Lifnr || lifnr }}</span>
            </div>
            <div class="pf-row">
              <span class="pf-label">Status</span>
              <span><span class="badge badge-success">Active Vendor</span></span>
            </div>
          </div>
        </div>

        <!-- Address Details -->
        <div class="vp-card">
          <div class="card-head">
            <div class="card-icon" style="background:linear-gradient(135deg,#d1fae5,#a7f3d0);">
              <svg width="18" height="18" fill="none" stroke="#065f46" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
              </svg>
            </div>
            <div class="card-title">Address Details</div>
          </div>
          <div class="profile-fields">
            <div class="pf-row">
              <span class="pf-label">Street/House</span>
              <span class="pf-val">{{ profile.Stras || '—' }}</span>
            </div>
            <div class="pf-row">
              <span class="pf-label">City</span>
              <span class="pf-val">{{ profile.Ort01 || '—' }}</span>
            </div>
            <div class="pf-row">
              <span class="pf-label">Postal Code</span>
              <span class="pf-val">{{ profile.Pstlz || '—' }}</span>
            </div>
            <div class="pf-row">
              <span class="pf-label">Country Code</span>
              <span class="pf-val">{{ profile.Land1 || '—' }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .profile-banner {
      border-radius: var(--vp-radius);
      overflow: hidden;
      position: relative;
      background: linear-gradient(135deg, var(--vp-dark), #1e3a5f);
      padding: 36px;
    }
    .banner-bg {
      position: absolute; inset: 0;
      background: radial-gradient(ellipse at top right, rgba(26,86,219,0.3) 0%, transparent 60%);
    }
    .banner-content { display: flex; align-items: center; gap: 24px; position: relative; z-index: 1; }
    .vendor-avatar {
      width: 88px; height: 88px;
      border-radius: 20px;
      background: linear-gradient(135deg, var(--vp-primary), var(--vp-accent));
      display: flex; align-items: center; justify-content: center;
      color: #fff; flex-shrink: 0;
      box-shadow: 0 8px 24px rgba(26,86,219,0.4);
    }
    .vendor-name { color: #fff; font-size: 26px; font-weight: 800; }
    .vendor-id { color: #94a3b8; font-size: 14px; margin-top: 4px; }

    .profile-grid {
      display: grid; grid-template-columns: repeat(2, 1fr);
      gap: 16px; margin-top: 24px;
    }
    @media(max-width: 900px) { .profile-grid { grid-template-columns: 1fr; } }

    .card-head { display: flex; align-items: center; gap: 12px; margin-bottom: 20px; }
    .card-icon { width: 38px; height: 38px; border-radius: 10px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
    .card-title { font-size: 15px; font-weight: 700; color: var(--vp-text); }

    .profile-fields { display: flex; flex-direction: column; gap: 0; }
    .pf-row {
      display: flex; align-items: center; justify-content: space-between;
      padding: 11px 0;
      border-bottom: 1px solid var(--vp-border);
      gap: 12px;
    }
    .pf-row:last-child { border-bottom: none; }
    .pf-label { font-size: 12px; font-weight: 600; color: var(--vp-text-muted); text-transform: uppercase; letter-spacing: 0.4px; flex-shrink: 0; }
    .pf-val { font-size: 13px; color: var(--vp-text); font-weight: 500; text-align: right; word-break: break-all; }
  `]
})
export class ProfileComponent implements OnInit {
  api = inject(ApiService);
  auth = inject(AuthService);
  cdr = inject(ChangeDetectorRef);

  profile: any = null;
  loading = false;
  error = '';

  get lifnr(): string { return this.auth.currentUserValue?.lifnr ?? ''; }

  ngOnInit(): void {
    const targetLifnr = this.lifnr;
    if (!targetLifnr) {
      this.error = 'No Vendor ID found. Please log in again.';
      return;
    }

    this.loading = true;
    this.api.get<any>(`profile/${targetLifnr}`).subscribe({
      next: (res) => {
        this.profile = res;
        this.loading = false;
        this.cdr.detectChanges(); // 🔥 Force UI update to resolve zone issues
      },
      error: (err) => {
        this.error = err.error?.message || err.message || 'Failed to load profile';
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }
}
