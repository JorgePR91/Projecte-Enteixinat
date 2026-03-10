import { Routes } from '@angular/router';
import { authGuard } from './guards/auth-guard-guard';

export const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', loadComponent: () => import('./components/app-home/app-home').then(m => m.AppHome) },
  { path: 'plantes', loadComponent: () => import('./components/plantes/app-planta-grid/app-planta-grid').then(m => m.AppPlantaGrid), canActivate: [authGuard] },
  { path: 'plantes/mapa', loadComponent: () => import('./components/plantes/app-plantes-mapa/app-planta-mapa').then(m => m.AppPlantaMapa) },
  { path: 'plantes/detall', loadComponent: () => import('./components/plantes/app-planta-table/app-planta-table').then(m => m.AppPlantasTable), data: { eliminarCamp: ['usuari', 'favorite'] } },
  { path: 'plantes/crear', loadComponent: () => import('./components/plantes/app-planta-create/app-planta-create').then(m => m.AppCreateForm), canActivate: [authGuard] },
  { path: 'planta/:id', loadComponent: () => import('./components/plantes/app-planta-detall/app-planta-detall').then(m => m.AppPlantaDetall), canActivate: [authGuard] },
  { path: 'login', loadComponent: () => import('./components/app-login/app-login').then(m => m.AppLogin) },
  { path: 'register', loadComponent: () => import('./components/app-register/app-register').then(m => m.AppRegister) },
  { path: 'profile', loadComponent: () => import('./components/app-profile/app-profile').then(m => m.AppProfile), canActivate: [authGuard] },
];
