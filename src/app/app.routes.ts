import { Routes } from '@angular/router';
import { roleGuard } from './access-security/model/access.entity';

export const routes: Routes = [
    {
        path: '',
        redirectTo: 'home',
        pathMatch: 'full',
    },
    {
        path: 'home',
        loadComponent: () =>
            import('./public/pages/home/home.component').then(
                (m) => m.HomeComponent
            ),
    },
    {
        path: 'design-lab',
        loadComponent: () =>
            import('./public/pages/design-lab/design-lab.component').then(
                (m) => m.DesignLabComponent
            ),
    },
    {
      path: 'explore',
      loadComponent: () =>
        import('./public/pages/explore/explore.component').then(
          (m)=> m.ExploreComponent
        )
    },
    {
        path: 'design-lab/create',
        loadComponent: () =>
            import('./design-lab/components/project-create/project-create.component').then(
                (m) => m.ProjectCreateComponent
            ),
    },
    {
        path: 'design-lab/:id',
        loadComponent: () =>
            import('./design-lab/components/project-preview/project-preview.component').then(
                (m) => m.ProjectPreviewComponent
            ),
    },
    {
        path: 'design-lab/:id/edit',
        loadComponent: () =>
            import('./design-lab/components/project-edit/project-edit.component').then(
                (m) => m.ProjectEditComponent
            ),
    },    {
        path: 'profile',
        loadComponent: () =>
            import('./public/pages/profile/profile.component').then(
                (m) => m.ProfileComponent
            ),
    },
    {
        path: 'shopping-cart',
        loadComponent: () =>
            import('./public/pages/shopping-cart/shopping-cart').then(
                (m) => m.ShoppingCart
            ),
    },

    {
        path: 'choose-manufacturer',
        loadComponent: () =>
            import('./public/pages/choose-manufacturer/choose-manufacturer.component').then(
                (m) => m.ChooseManufacturerComponent
            ),
    },
    {
      path: 'my-fulfillments',
      loadComponent: () =>
        import('./public/pages/my-fulfillments/my-fulfillments.component').then(
          (m) => m.FulfillmentsListComponent
        ),
    },
  {
    path: 'analytics',
    loadComponent: () =>
      import('./public/pages/analytics/analytics.component').then(
        (m) => m.AnalyticsComponent
      ),
  },
  {
    path: 'dashboard',
    redirectTo: 'analytics',
    pathMatch: 'full',
  },
  {
    path: 'manufacturer-dashboard',
    loadComponent: () =>
      import('./public/pages/manufacturer-dashboard/manufacturer-dashboard.component').then(
        (m) => m.ManufacturerDashboardComponent
      ),
    canActivate: [roleGuard(['manufacturer'])]
  },
  {
    path: 'manufacturer-orders',
    loadComponent: () =>
      import('./public/pages/manufacturer-orders/manufacturer-orders-page.component').then(
        (m) => m.ManufacturerOrdersPageComponent
      ),
    canActivate: [roleGuard(['manufacturer'])]
  },
  {
    path: 'manufacturer-orders/:id',
    loadComponent: () =>
      import('./orders-fulfillments/components/manufacturer-orders/manufacturer-orders.component').then(
        (m) => m.ManufacturerOrdersComponent
      ),
    canActivate: [roleGuard(['manufacturer'])]
  }
];
