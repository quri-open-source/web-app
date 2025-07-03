import { Routes } from '@angular/router';
import { roleGuard } from './access-security/model/access.entity';
import { authenticationGuard } from './iam/services/authentication.guard';
import { redirectAuthenticatedGuard } from './iam/services/redirect-authenticated.guard';

export const routes: Routes = [
    {
        path: '',
        redirectTo: 'home',
        pathMatch: 'full',
    },
    {
        path: 'sign-in',
        loadComponent: () =>
            import('./iam/pages/sign-in/sign-in.component').then(
                (m) => m.SignInComponent
            ),
        canActivate: [redirectAuthenticatedGuard]
    },
    {
        path: 'sign-up',
        loadComponent: () =>
            import('./iam/pages/sign-up/sign-up.component').then(
                (m) => m.SignUpComponent
            ),
        canActivate: [redirectAuthenticatedGuard]
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
        canActivate: [authenticationGuard]
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
        canActivate: [authenticationGuard]
    },
    {
        path: 'design-lab/:id',
        loadComponent: () =>
            import('./design-lab/components/project-preview/project-preview.component').then(
                (m) => m.ProjectPreviewComponent
            ),
        canActivate: [authenticationGuard]
    },
    {
        path: 'design-lab/:id/edit',
        loadComponent: () =>
            import('./design-lab/components/project-edit/project-edit.component').then(
                (m) => m.ProjectEditComponent
            ),
        canActivate: [authenticationGuard]
    },    {
        path: 'profile',
        loadComponent: () =>
            import('./iam/components/user-profile/user-profile.component').then(
                (m) => m.UserProfileComponent
            ),
        canActivate: [authenticationGuard]
    },
    {
        path: 'shopping-cart',
        loadComponent: () =>
            import('./public/pages/shopping-cart/shopping-cart').then(
                (m) => m.ShoppingCart
            ),
        canActivate: [authenticationGuard]
    },

    {
        path: 'choose-manufacturer',
        loadComponent: () =>
            import('./public/pages/choose-manufacturer/choose-manufacturer.component').then(
                (m) => m.ChooseManufacturerComponent
            ),
        canActivate: [authenticationGuard]
    },
    {
      path: 'my-fulfillments',
      loadComponent: () =>
        import('./public/pages/my-fulfillments/my-fulfillments.component').then(
          (m) => m.FulfillmentsListComponent
        ),
      canActivate: [authenticationGuard]
    },
  {
    path: 'analytics',
    loadComponent: () =>
      import('./public/pages/analytics/analytics.component').then(
        (m) => m.AnalyticsComponent
      ),
    canActivate: [authenticationGuard]
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
    canActivate: [authenticationGuard, roleGuard(['manufacturer'])]
  },
  {
    path: 'manufacturer-orders',
    loadComponent: () =>
      import('./public/pages/manufacturer-orders/manufacturer-orders-page.component').then(
        (m) => m.ManufacturerOrdersPageComponent
      ),
    canActivate: [authenticationGuard, roleGuard(['manufacturer'])]
  },
  {
    path: 'manufacturer-orders/:id',
    loadComponent: () =>
      import('./orders-fulfillments/components/manufacturer-orders/manufacturer-orders.component').then(
        (m) => m.ManufacturerOrdersComponent
      ),
    canActivate: [authenticationGuard, roleGuard(['manufacturer'])]
  }
];
