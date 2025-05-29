import { Routes } from '@angular/router';

export const routes: Routes = [  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: 'dashboard',
    loadComponent: () => import('./public/pages/dashboard/dashboard.component').then(m => m.AnalyticsDashboardComponent)
  },
  {
    path: 'home',
    loadComponent: () => import('./public/pages/home/home.component').then(m => m.HomeComponent)
  },
  {
    path: 'templates',
    loadComponent: () => import('./public/pages/templates/templates.component').then(m => m.TemplatesComponent)
  },
  {
    path: 'favorites',
    loadComponent: () => import('./public/pages/favorites/favorites.component').then(m => m.FavoritesComponent)
  },
  {
    path: 'explore',
    loadComponent: () => import('./public/pages/explore/explore.component').then(m => m.ExploreComponent)
  },  {
    path: 'projects',
    loadComponent: () => import('./public/pages/projects/projects.component').then(m => m.ProjectsComponent)
  },
  {
    path: 'settings',
    loadComponent: () => import('./public/pages/settings/settings.component').then(m => m.SettingsComponent)
  },
  {
    path: 'design-lab',
    loadComponent: () => import('./public/pages/design-lab/design-lab.component').then(m => m.DesignLabComponent)
  },
  {
    path: 'design-lab/new',
    loadComponent: () => import('./design-lab/components/project-create/project-create.component').then(m => m.ProjectCreateComponent)
  },
  {
    path: 'design-lab/:id',
    loadComponent: () => import('./design-lab/components/project-detail/project-detail.component').then(m => m.ProjectDetailComponent)
  },
  {
    path: 'design-lab/:id/edit',
    loadComponent: () => import('./design-lab/components/project-edit/project-edit.component').then(m => m.ProjectEditComponent)
  },
  {
    path: 'profile',
    loadComponent: () => import('./public/pages/user-profile/user-profile.component').then(m => m.UserProfileComponent)
  }
];