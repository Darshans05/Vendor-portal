import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from '../../core/services/api.service';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="login-shell">
      <!-- Left Panel -->
      <div class="login-left">
        <div class="login-brand">
          <div class="brand-icon">
            <svg width="36" height="36" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8"
                d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/>
            </svg>
          </div>
          <span class="brand-name">Vendor Portal</span>
        </div>

        <div class="login-hero">
          <h1 class="hero-title">Welcome to<br><span class="hero-accent">SAP Vendor Portal</span></h1>
          <p class="hero-sub">Access your purchase orders, goods receipts, invoices, and financial data — all in one place.</p>
        </div>

        <div class="feature-list">
          <div class="feature-item" *ngFor="let f of features">
            <div class="feature-dot" [style.background]="f.color"></div>
            <span>{{ f.label }}</span>
          </div>
        </div>

        <div class="login-footer-text">
          Powered by SAP OData V2 — ZG_VENDORPORTAL_DS_SRV
        </div>
      </div>

      <!-- Right Panel (Form) -->
      <div class="login-right">
        <div class="login-card">
          <div class="login-card-header">
            <h2>Vendor Sign In</h2>
            <p>Enter your Vendor ID and password to access your portal</p>
          </div>

          <div class="vp-error-banner" *ngIf="error">
            <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
            {{ error }}
          </div>

          <form (ngSubmit)="onLogin()" class="login-form">
            <div class="form-group">
              <label class="vp-label" for="lifnr">Vendor ID (LIFNR)</label>
              <div class="input-with-icon">
                <svg class="input-icon" width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2"/>
                </svg>
                <input id="lifnr" class="vp-input input-padded" type="text"
                  [(ngModel)]="lifnr" name="lifnr"
                  placeholder="e.g. 100000"
                  autocomplete="username" required />
              </div>
            </div>

            <div class="form-group">
              <label class="vp-label" for="password">Password</label>
              <div class="input-with-icon">
                <svg class="input-icon" width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
                </svg>
                <input id="password" class="vp-input input-padded" [type]="showPw ? 'text' : 'password'"
                  [(ngModel)]="password" name="password"
                  placeholder="Enter your password"
                  autocomplete="current-password" required />
                <button type="button" class="pw-toggle" (click)="showPw = !showPw">
                  <svg *ngIf="!showPw" width="15" height="15" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
                  </svg>
                  <svg *ngIf="showPw" width="15" height="15" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"/>
                  </svg>
                </button>
              </div>
            </div>

            <button type="submit" class="btn btn-primary login-submit" [disabled]="loading">
              <span class="spinner-ring" *ngIf="loading" style="width:16px;height:16px;border-width:2px;"></span>
              <span>{{ loading ? 'Signing in…' : 'Sign In' }}</span>
              <svg *ngIf="!loading" width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3"/>
              </svg>
            </button>
          </form>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .login-shell {
      display: flex; height: 100vh;
      font-family: 'Inter', sans-serif;
    }

    /* ─── Left ─────────────────────────────────── */
    .login-left {
      flex: 0 0 480px;
      background: linear-gradient(160deg, var(--vp-dark) 0%, #1e3a5f 60%, #1a56db 100%);
      display: flex; flex-direction: column;
      padding: 40px 48px;
      position: relative; overflow: hidden;
    }
    .login-left::before {
      content: '';
      position: absolute; top: -100px; right: -100px;
      width: 400px; height: 400px;
      background: radial-gradient(circle, rgba(26,86,219,0.3) 0%, transparent 70%);
      border-radius: 50%;
    }
    .login-left::after {
      content: '';
      position: absolute; bottom: -80px; left: -80px;
      width: 300px; height: 300px;
      background: radial-gradient(circle, rgba(245,158,11,0.2) 0%, transparent 70%);
      border-radius: 50%;
    }

    .login-brand { display: flex; align-items: center; gap: 14px; z-index: 1; }
    .brand-icon {
      width: 54px; height: 54px; border-radius: 14px;
      background: linear-gradient(135deg, var(--vp-primary), var(--vp-accent));
      display: flex; align-items: center; justify-content: center;
      color: #fff;
      box-shadow: 0 8px 24px rgba(26,86,219,0.4);
    }
    .brand-name { color: #fff; font-size: 20px; font-weight: 800; letter-spacing: -0.5px; }

    .login-hero { margin-top: 64px; z-index: 1; }
    .hero-title { color: #fff; font-size: 38px; font-weight: 800; line-height: 1.2; letter-spacing: -1px; }
    .hero-accent {
      background: linear-gradient(90deg, var(--vp-accent), #fb923c);
      -webkit-background-clip: text; -webkit-text-fill-color: transparent;
    }
    .hero-sub { color: #94a3b8; font-size: 15px; line-height: 1.6; margin-top: 16px; max-width: 340px; }

    .feature-list { margin-top: 40px; display: flex; flex-direction: column; gap: 14px; z-index: 1; }
    .feature-item { display: flex; align-items: center; gap: 12px; color: #cbd5e1; font-size: 14px; font-weight: 500; }
    .feature-dot { width: 10px; height: 10px; border-radius: 50%; flex-shrink: 0; }

    .login-footer-text {
      margin-top: auto;
      color: #475569; font-size: 11px; z-index: 1;
    }

    /* ─── Right ─────────────────────────────────── */
    .login-right {
      flex: 1;
      background: #f8fafc;
      display: flex; align-items: center; justify-content: center;
      padding: 40px;
    }

    .login-card {
      width: 100%; max-width: 440px;
      background: #fff;
      border-radius: 20px;
      padding: 40px;
      box-shadow: 0 20px 60px rgba(0,0,0,0.08);
      border: 1px solid var(--vp-border);
    }

    .login-card-header { margin-bottom: 28px; }
    .login-card-header h2 { font-size: 24px; font-weight: 800; color: var(--vp-text); }
    .login-card-header p { color: var(--vp-text-muted); font-size: 14px; margin-top: 6px; line-height: 1.5; }

    .login-form { display: flex; flex-direction: column; gap: 20px; }
    .form-group { display: flex; flex-direction: column; }

    .input-with-icon { position: relative; display: flex; align-items: center; }
    .input-icon { position: absolute; left: 14px; color: #94a3b8; pointer-events: none; }
    .input-padded { padding-left: 42px !important; }
    .pw-toggle {
      position: absolute; right: 12px;
      background: none; border: none; cursor: pointer;
      color: #94a3b8; padding: 4px;
      transition: color 0.2s;
    }
    .pw-toggle:hover { color: var(--vp-primary); }

    .login-submit {
      width: 100%; justify-content: center;
      padding: 14px; font-size: 15px;
      border-radius: 10px;
      margin-top: 4px;
    }
  `]
})
export class LoginComponent {
  api = inject(ApiService);
  auth = inject(AuthService);
  router = inject(Router);

  lifnr = '';
  password = '';
  loading = false;
  error = '';
  showPw = false;

  features = [
    { label: 'RFQ & Purchase Orders', color: '#3b82f6' },
    { label: 'Goods Receipts (GR)', color: '#10b981' },
    { label: 'Invoice & Payment Aging', color: '#f59e0b' },
    { label: 'Credit / Debit Memos', color: '#8b5cf6' },
    { label: 'Invoice PDF Download', color: '#ef4444' }
  ];

  onLogin(): void {
    this.error = '';
    if (!this.lifnr.trim() || !this.password.trim()) {
      this.error = 'Vendor ID and password are required.';
      return;
    }
    this.loading = true;
    this.api.post<any>('login', { lifnr: this.lifnr.trim(), password: this.password }).subscribe({
      next: (res) => {
        this.loading = false;
        if (res.success) {
          this.auth.setUser({ lifnr: res.lifnr, message: res.message });
          this.router.navigate(['/dashboard']);
        } else {
          this.error = res.message || 'Login failed.';
        }
      },
      error: (err) => {
        this.loading = false;
        this.error = err.error?.message || 'Unable to connect. Check your network.';
      }
    });
  }
}
