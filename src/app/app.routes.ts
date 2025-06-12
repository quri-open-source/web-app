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
    },    {
        path: 'design-lab',
        loadComponent: () =>
            import('./public/pages/design-lab/design-lab.component').then(
                (m) => m.DesignLabComponent
            ),
    },
    {
        path: 'design-lab/create',
        loadComponent: () =>
            import('./design-lab/components/project-create/project-create.component').then(
                (m) => m.ProjectCreateComponent
            ),
    },{
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
    },
    {
        path: 'profile',
        loadComponent: () =>
            import('./public/pages/profile/profile.component').then(
                (m) => m.ProfileComponent
            ),
    }
];
