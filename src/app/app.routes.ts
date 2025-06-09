import { Routes } from '@angular/router';

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
        path: 'design-lab/:id',
        loadComponent: () =>
            import('./design-lab/components/project-preview/project-preview.component').then(
                (m) => m.ProjectPreview
            ),
    },
    {
        path: 'profile',
        loadComponent: () =>
            import('./public/pages/profile/profile.component').then(
                (m) => m.ProfileComponent
            ),
    }
];
