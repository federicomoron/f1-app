import type { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./home/home.component').then((m) => m.HomeComponent),
  },
  {
    path: 'teams',
    loadComponent: () =>
      import('./features/teams/team-list/teams-list.component').then((m) => m.TeamsListComponent),
  },
  {
    path: 'teams/:teamId',
    loadComponent: () =>
      import('./features/teams/team-detail/team-detail.component').then(
        (m) => m.TeamDetailComponent
      ),
  },
  {
    path: 'drivers',
    loadComponent: () =>
      import('./features/drivers/drivers-search.component').then((m) => m.DriversSearchComponent),
  },
  {
    path: 'charts',
    loadComponent: () =>
      import('./features/charts/charts-season.component').then((m) => m.ChartsSeasonComponent),
  },
  { path: '**', redirectTo: '' },
];
