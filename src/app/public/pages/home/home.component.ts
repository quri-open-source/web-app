import { Component, OnInit, OnDestroy, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatDividerModule } from '@angular/material/divider';
import { Router, RouterModule, NavigationEnd } from '@angular/router';
import { AuthenticationService } from '../../../iam/services/authentication.service';
import { Subject, takeUntil } from 'rxjs';
import { filter } from 'rxjs/operators';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { LanguageSwitcherComponent } from '../../../shared/components/language-switcher.component';
import { CartService } from '../../../shared/services/cart.service';
import { MatBadgeModule } from '@angular/material/badge';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';

interface NavigationLink {
    name: string;
    nameKey: string;
    route: string;
    icon: string;
}

@Component({
    selector: 'app-home',
    standalone: true,
    imports: [
        CommonModule,
        MatCardModule,
        MatButtonModule,
        MatIconModule,
        MatGridListModule,
        MatSidenavModule,
        MatListModule,
        MatToolbarModule,
        MatDividerModule,
        MatBadgeModule,
        MatSnackBarModule,
        MatTooltipModule,
        RouterModule,
        TranslateModule,
        LanguageSwitcherComponent,
    ],
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit, OnDestroy, AfterViewInit {
    private destroy$ = new Subject<void>();
    currentPageTitle = 'Dashboard';
    navigationLinks: NavigationLink[] = [];
    private readonly routeTitleMap = new Map<string, string>([
        ['', 'navigation.dashboard'],
        ['dashboard', 'navigation.dashboard'],
        ['catalog', 'navigation.catalog'],
        ['design-lab', 'navigation.designLab'],
        ['cart', 'navigation.cart'],
    ]);
    isMobile = false;
    private resizeListener = this.checkScreenSize.bind(this);

    constructor(
        private authService: AuthenticationService,
        private router: Router,
        private translateService: TranslateService,
        public cartService: CartService,
        private snackBar: MatSnackBar
    ) {}

    ngAfterViewInit() {
        this.checkScreenSize();
        window.addEventListener('resize', this.resizeListener);
    }

    ngOnDestroy() {
        window.removeEventListener('resize', this.resizeListener);
        this.destroy$.next();
        this.destroy$.complete();
    }

    checkScreenSize() {
        this.isMobile = window.innerWidth <= 768;
    }

    isMobileScreen(): boolean {
        return this.isMobile;
    }

    ngOnInit() {
        this.navigationLinks = [
            {
                name: 'Dashboard',
                nameKey: 'navigation.dashboard',
                route: 'dashboard',
                icon: 'dashboard',
            },
            {
                name: 'Catalog',
                nameKey: 'navigation.catalog',
                route: 'catalog',
                icon: 'storefront',
            },
            {
                name: 'Design Lab',
                nameKey: 'navigation.designLab',
                route: 'design-lab',
                icon: 'palette',
            },
            {
                name: 'Cart',
                nameKey: 'navigation.cart',
                route: 'cart',
                icon: 'shopping_cart',
            },
            {
                name: 'Profile',
                nameKey: 'navigation.profile',
                route: 'profile',
                icon: 'account_circle',
            },
        ];
        const roles = JSON.parse(localStorage.getItem('roles') || '[]');
        if (roles.includes('ROLE_MANUFACTURER')) {
            this.navigationLinks.push({
                name: 'Fulfillments',
                nameKey: 'navigation.fulfillments',
                route: 'fulfillments',
                icon: 'local_shipping',
            });
        }


        this.router.events
            .pipe(
                filter(
                    (event): event is NavigationEnd =>
                        event instanceof NavigationEnd
                ),
                takeUntil(this.destroy$)
            )
            .subscribe((event: NavigationEnd) => {
                this.updatePageTitle(event.urlAfterRedirects);
            });


        this.updatePageTitle(this.router.url);
    }

    private updatePageTitle(url: string) {

        const routeMatch = url.match(/\/home\/?(.*)/);
        const route = routeMatch ? routeMatch[1] : '';

        const titleKey =
            this.routeTitleMap.get(route) || 'navigation.dashboard';


        const translatedTitle = this.translateService.instant(titleKey);
        this.currentPageTitle = translatedTitle || titleKey;
    }

    getCurrentPageTitle(): string {
        return this.currentPageTitle;
    }

    onNavigate(link: NavigationLink) {
        this.router.navigate(['/home', link.route]);
    }

    navigateToSection(section: string) {
        this.router.navigate(['/home', section]);
    }

    signOut() {
        this.authService.signOut();
        this.router.navigate(['/sign-in']);
    }
    viewCart() {
        this.router.navigate(['/home/cart']);
    }

    isManufacturer(): boolean {
        const roles = JSON.parse(localStorage.getItem('roles') || '[]');
        return roles.includes('ROLE_MANUFACTURER');
    }
}
