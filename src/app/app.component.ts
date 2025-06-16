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
import { UserService } from './user-management/services/user.service';

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
            path: 'dashboard',
            label: 'Dashboard',
            icon: 'dashboard',
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
    constructor(private router: Router, public userService: UserService) {
        console.log('App Component - Constructor initialized');
        
        // Get user role and set initial routes
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
                
                // Check role again after navigation in case it was changed
                this.updateRoutesBasedOnRole();
            });

        const media = inject(MediaMatcher);

        this._mobileQuery = media.matchMedia('(max-width: 600px)');
        this.isMobile.set(this._mobileQuery.matches);
        this._mobileQueryListener = () => {
            this.updateLayout();
        };
        this._mobileQuery.addEventListener('change', this._mobileQueryListener);
    }
    
    private updateRoutesBasedOnRole(): void {
        const userRole = this.userService.getUserRole();
        console.log('App Component - Updating routes based on role:', userRole);
        
        if (userRole === 'manufacturer') {
            console.log('App Component - Setting manufacturer routes');
            this.routes = [...this.manufacturerRoutes];
        } else {
            console.log('App Component - Setting customer routes');
            this.routes = [...this.customerRoutes];
        }
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
        this._mobileQuery.removeEventListener(
            'change',
            this._mobileQueryListener
        );
        
        if (this.routerSubscription) {
            this.routerSubscription.unsubscribe();
        }
    }
    
    ngOnInit(): void {
        this.updateLayout();
        // Update routes based on current role
        this.updateRoutesBasedOnRole();
    }
}
