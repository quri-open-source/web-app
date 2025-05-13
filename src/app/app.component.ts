import { Component } from '@angular/core';
import {
  NavigationEnd,
  Router,
  RouterLink,
  RouterLinkActive,
  RouterOutlet,
} from '@angular/router';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { filter } from 'rxjs';

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
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  title = 'open-source-web-app-TEST';
  currentPage = '';
  currentPath = '';  routes: AppRoute[] = [
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
      path: 'templates',
      label: 'Templates',
      icon: 'app_registration',
    },
    {
      path: 'favorites',
      label: 'Favorites',
      icon: 'favorite',
    },    {
      path: 'explore',
      label: 'Explore',
      icon: 'explore',
    },
    {
      path: 'projects',
      label: 'Projects',
      icon: 'folder',
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
        const currentPath = this.router.url.substring(1); // Remove leading slash
        this.currentPath = this.router.url;
        const currentPage = this.routes.find((p) =>
          currentPath.startsWith(p.path)
        );
        this.currentPage = currentPage ? currentPage.label : '';
      });
  }
}