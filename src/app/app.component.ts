import { Component, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { MatSidenavModule } from '@angular/material/sidenav';
import { RouterLinkActive } from '@angular/router';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { filter } from 'rxjs';
import { MediaMatcher } from '@angular/cdk/layout';
import { MatMenuModule } from '@angular/material/menu';
import { ShoppingCartPopoverComponent } from './shared/components/shopping-cart-popover/shopping-cart-popover.component';

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

    currentPage = '';
    currentPath = '';
    routes: AppRoute[] = [
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
    constructor(private router: Router) {
        this.router.events
            .pipe(filter((event) => event instanceof NavigationEnd))
            .subscribe(() => {
                const currentPath = this.router.url.substring(1);
                this.currentPath = this.router.url;
                const currentPage = this.routes.find((p) =>
                    currentPath.startsWith(p.path)
                );
                this.currentPage = currentPage ? currentPage.label : '';
            });

        const media = inject(MediaMatcher);

        this._mobileQuery = media.matchMedia('(max-width: 600px)');
        this.isMobile.set(this._mobileQuery.matches);
        this._mobileQueryListener = () => {
            this.updateLayout();
        };
        this._mobileQuery.addEventListener('change', this._mobileQueryListener);
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
    }
    ngOnInit(): void {
        this.updateLayout();
    }
}
