import { Component, inject } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive, Router } from '@angular/router';
import { AuthService } from '../core/services/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive, CommonModule],
  template: `
    <div class="app-shell">
      <!-- ─── Sidebar ─────────────────────────────────────────────────── -->
      <aside class="sidebar">
        <!-- Logo -->
        <div class="sidebar-logo">
          <div class="logo-icon">
            <svg width="22" height="22" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/>
            </svg>
          </div>
          <div>
            <div class="logo-title">Vendor Portal</div>
            <div class="logo-sub">SAP OData Integration</div>
          </div>
        </div>

        <!-- Nav -->
        <nav class="sidebar-nav">
          <a routerLink="/dashboard" routerLinkActive="active" class="nav-item">
            <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"/>
            </svg>
            <span>Dashboard</span>
          </a>
          <a routerLink="/profile" routerLinkActive="active" class="nav-item">
            <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
            </svg>
            <span>Profile</span>
          </a>
          <a routerLink="/finance" routerLinkActive="active" class="nav-item">
            <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
            <span>Financial Sheet</span>
          </a>
        </nav>

        <!-- User Footer -->
        <div class="sidebar-footer">
          <div class="user-avatar">{{ lifnrInitials }}</div>
          <div class="user-info">
            <div class="user-id">ID: {{ lifnr }}</div>
            <button class="logout-btn" (click)="logout()">
              <svg width="13" height="13" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/>
              </svg>
              Logout
            </button>
          </div>
        </div>
      </aside>

      <!-- ─── Main Area ──────────────────────────────────────────────── -->
      <div class="main-area">
        <header class="topbar">
          <div class="topbar-left">
            <span class="topbar-title">Welcome back, Vendor {{ lifnr }}</span>
          </div>
          <div class="topbar-right">
            <div class="topbar-badge">
              <span class="online-dot"></span>
              SAP Connected
            </div>
          </div>
        </header>
        <main class="content-area">
          <router-outlet />
        </main>
      </div>
    </div>
  `,
  styles: [`
    .app-shell { display: flex; height: 100vh; overflow: hidden; background: var(--vp-bg); }

    /* Sidebar */
    .sidebar {
      width: 256px; flex-shrink: 0;
      background: var(--vp-sidebar);
      display: flex; flex-direction: column;
      box-shadow: 4px 0 24px rgba(0,0,0,0.15);
      z-index: 10;
    }

    .sidebar-logo {
      display: flex; align-items: center; gap: 12px;
      padding: 24px 20px;
      border-bottom: 1px solid rgba(255,255,255,0.07);
    }
    .logo-icon {
      width: 40px; height: 40px; border-radius: 10px;
      background: linear-gradient(135deg, var(--vp-primary), var(--vp-primary-light));
      display: flex; align-items: center; justify-content: center;
      color: #fff; flex-shrink: 0;
      box-shadow: 0 4px 12px rgba(26,86,219,0.4);
    }
    .logo-title { color: #fff; font-size: 15px; font-weight: 700; line-height: 1.3; }
    .logo-sub { color: #64748b; font-size: 11px; margin-top: 1px; }

    .sidebar-nav { flex: 1; padding: 16px 12px; display: flex; flex-direction: column; gap: 4px; }
    .nav-item {
      display: flex; align-items: center; gap: 12px;
      padding: 12px 14px;
      border-radius: 10px;
      color: #94a3b8;
      text-decoration: none;
      font-size: 14px; font-weight: 500;
      transition: var(--vp-transition);
    }
    .nav-item:hover { background: var(--vp-sidebar-hover); color: #e2e8f0; }
    .nav-item.active {
      background: linear-gradient(135deg, var(--vp-primary), var(--vp-primary-light));
      color: #fff;
      box-shadow: 0 4px 12px rgba(26,86,219,0.3);
    }

    .sidebar-footer {
      display: flex; align-items: center; gap: 12px;
      padding: 16px 20px;
      border-top: 1px solid rgba(255,255,255,0.07);
      background: rgba(0,0,0,0.15);
    }
    .user-avatar {
      width: 36px; height: 36px; border-radius: 50%;
      background: linear-gradient(135deg, var(--vp-primary), var(--vp-accent));
      display: flex; align-items: center; justify-content: center;
      color: #fff; font-size: 13px; font-weight: 700;
      flex-shrink: 0;
    }
    .user-id { color: #e2e8f0; font-size: 13px; font-weight: 600; }
    .logout-btn {
      display: flex; align-items: center; gap: 5px;
      color: #64748b; font-size: 12px;
      background: none; border: none; cursor: pointer;
      margin-top: 4px; transition: var(--vp-transition);
    }
    .logout-btn:hover { color: #ef4444; }

    /* Main */
    .main-area { flex: 1; display: flex; flex-direction: column; overflow: hidden; }

    .topbar {
      height: 60px; background: #fff;
      border-bottom: 1px solid var(--vp-border);
      display: flex; align-items: center; justify-content: space-between;
      padding: 0 28px;
      box-shadow: 0 1px 4px rgba(0,0,0,0.04);
      flex-shrink: 0;
    }
    .topbar-title { font-size: 15px; font-weight: 600; color: var(--vp-text); }
    .topbar-badge {
      display: flex; align-items: center; gap: 7px;
      font-size: 12px; font-weight: 600;
      color: #065f46; background: #d1fae5;
      padding: 5px 12px; border-radius: 20px;
    }
    .online-dot {
      width: 8px; height: 8px; border-radius: 50%;
      background: #10b981;
      box-shadow: 0 0 6px #10b981;
      animation: pulse 2s infinite;
    }
    @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.4; } }

    .content-area { flex: 1; overflow-y: auto; padding: 28px; }
  `]
})
export class MainLayoutComponent {
  auth = inject(AuthService);
  router = inject(Router);

  get lifnr(): string { return this.auth.currentUserValue?.lifnr ?? 'Guest'; }
  get lifnrInitials(): string { return this.lifnr.slice(-2).toUpperCase(); }

  logout(): void { this.auth.logout(); }
}
