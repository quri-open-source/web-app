import { Component, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { MatSidenavModule } from '@angular/material/sidenav';
import { RouterLinkActive } from '@angular/router';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { filter, Subscription } from 'rxjs';
import { MediaMatcher } from '@angular/cdk/layout';
import { MatMenuModule } from '@angular/material/menu';
import { ShoppingCartPopoverComponent } from '../app/orders-fulfillments/components/shopping-cart-popover/shopping-cart-popover.component';
import { AuthenticationService } from './iam/services/authentication.service';

export interface AppRoute {
  path: string;
  label: string;
  icon: string;
}

@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet,
    MatSidenavModule,
    RouterLinkActive,
    RouterLink,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    ShoppingCartPopoverComponent,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class App implements OnDestroy, OnInit {
  protected title = 'quri';
  protected readonly isMobile = signal(true);
  protected readonly isOpened = signal(true);
  private readonly _mobileQuery: MediaQueryList;
  private readonly _mobileQueryListener: () => void;
  private routerSubscription: Subscription;
  private authSubscription: Subscription;

  currentPage = '';
  currentPath = '';
  routes: AppRoute[] = [];

  private customerRoutes: AppRoute[] = [
    {
      path: 'home',
      label: 'Home',
      icon: 'home',
    },
    {
      path: 'analytics',
      label: 'Analytics',
      icon: 'bar_chart',
    },
    {
      path: 'explore',
      label: 'Explore',
      icon: 'explore',
    },
    {
      path: 'design-lab',
      label: 'Design Lab',
      icon: 'brush',
    },
    {
      path: 'settings',
      label: 'Settings',
      icon: 'settings',
    },
  ];

  private manufacturerRoutes: AppRoute[] = [
    {
      path: 'home',
      label: 'Home',
      icon: 'home',
    },
    {
      path: 'manufacturer-dashboard',
      label: 'Dashboard',
      icon: 'dashboard',
    },
    {
      path: 'manufacturer-orders',
      label: 'Order Management',
      icon: 'list_alt',
    },
    {
      path: 'dashboard',
      label: 'Analytics',
      icon: 'bar_chart',
    },
    {
      path: 'explore',
      label: 'Explore',
      icon: 'explore',
    },
    {
      path: 'design-lab',
      label: 'Design Lab',
      icon: 'brush',
    },
    {
      path: 'settings',
      label: 'Settings',
      icon: 'settings',
    },
  ];
  constructor(
    private router: Router,
    private authService: AuthenticationService
  ) {
    console.log('🚀 [DEBUG] App Component - Constructor initialized with IAM');

    // Get user role and set initial routes
    console.log(
      '🚀 [DEBUG] About to call updateRoutesBasedOnRole from constructor'
    );
    this.updateRoutesBasedOnRole();

    // Listen for navigation events to update current page
    this.routerSubscription = this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe(() => {
        const currentPath = this.router.url.substring(1);
        this.currentPath = this.router.url;
        const currentPage = this.routes.find((p) =>
          currentPath.startsWith(p.path)
        );
        this.currentPage = currentPage ? currentPage.label : '';

        console.log(
          '🔄 [DEBUG] Navigation event detected, path:',
          this.currentPath
        );
        // Check role again after navigation in case it was changed
        console.log(
          '🔄 [DEBUG] About to call updateRoutesBasedOnRole from navigation event'
        );
        this.updateRoutesBasedOnRole();
      });

    const media = inject(MediaMatcher);

    this._mobileQuery = media.matchMedia('(max-width: 600px)');
    this.isMobile.set(this._mobileQuery.matches);
    this._mobileQueryListener = () => {
      this.updateLayout();
    };
    this._mobileQuery.addEventListener('change', this._mobileQueryListener);

    // Subscribe to authentication changes instead of role changes
    this.authSubscription = this.authService.isSignedIn.subscribe(
      (isSignedIn: boolean) => {
        console.log(
          '🔔 [DEBUG] Authentication change subscription triggered, signed in:',
          isSignedIn
        );
        if (isSignedIn) {
          console.log(
            '🔔 [DEBUG] User signed in, about to call updateRoutesBasedOnRole'
          );
          this.updateRoutesBasedOnRole();
        } else {
          console.log('🔔 [DEBUG] User not signed in, setting default routes');
          this.routes = [...this.customerRoutes]; // Default to customer routes when not signed in
        }
      }
    );
  }
  private updateRoutesBasedOnRole(): void {
    // Get role from localStorage (could be set by role switcher or sign-in process)
    const userRole = localStorage.getItem('quri_user_role');
    console.log('🔍 [DEBUG] App Component - updateRoutesBasedOnRole called');
    console.log('🔍 [DEBUG] Current user role from localStorage:', userRole);
    console.log('🔍 [DEBUG] User role type:', typeof userRole);
    console.log(
      '🔍 [DEBUG] Is role ROLE_MANUFACTURER?',
      userRole === 'ROLE_MANUFACTURER'
    );
    console.log(
      '🔍 [DEBUG] Current routes array length before update:',
      this.routes.length
    );

    if (userRole === 'ROLE_MANUFACTURER') {
      console.log('✅ [DEBUG] CONDITION MET: Setting manufacturer routes');
      console.log(
        '✅ [DEBUG] Manufacturer routes to set:',
        this.manufacturerRoutes
      );
      this.routes = [...this.manufacturerRoutes];
      console.log(
        '✅ [DEBUG] Routes array after setting manufacturer routes:',
        this.routes
      );
    } else {
      console.log(
        '❌ [DEBUG] CONDITION NOT MET: Setting customer routes (default when no role or ROLE_CUSTOMER)'
      );
      console.log('❌ [DEBUG] Customer routes to set:', this.customerRoutes);
      this.routes = [...this.customerRoutes];
      console.log(
        '❌ [DEBUG] Routes array after setting customer routes:',
        this.routes
      );
    }

    console.log('🔍 [DEBUG] Final routes array length:', this.routes.length);
    console.log('🔍 [DEBUG] Final routes array:', this.routes);
  }

  updateLayout() {
    if (!this._mobileQuery.matches) {
      this.isOpened.set(true);
    }
    if (this._mobileQuery.matches && this.isOpened() === true) {
      this.isOpened.set(false);
    }

    this.isMobile.set(this._mobileQuery.matches);
  }

  ngOnDestroy(): void {
    this._mobileQuery.removeEventListener('change', this._mobileQueryListener);

    if (this.routerSubscription) {
      this.routerSubscription.unsubscribe();
    }
    if (this.authSubscription) {
      this.authSubscription.unsubscribe();
    }
  }

  ngOnInit(): void {
    console.log('🎯 [DEBUG] ngOnInit called');
    this.updateLayout();
    // Update routes based on current role
    console.log(
      '🎯 [DEBUG] About to call updateRoutesBasedOnRole from ngOnInit'
    );
    this.updateRoutesBasedOnRole();
  }

  // Debug method to expose routing info
  getDebugInfo(): string {
    const userRole = localStorage.getItem('quri_user_role');
    const routeCount = this.routes.length;
    return `Role: ${userRole}, Routes: ${routeCount}`;
  }

  // Method to trigger a manual route update (useful for debugging)
  forceRouteUpdate(): void {
    console.log('🔧 [DEBUG] Manual route update triggered');
    this.updateRoutesBasedOnRole();
  }
}
