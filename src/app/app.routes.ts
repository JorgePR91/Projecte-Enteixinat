import { Routes } from '@angular/router';
import { AppHome } from './components/app-home/app-home';
import { AppPlantaDetall } from './components/plantes/app-planta-detall/app-planta-detall';
import { AppLogin } from './components/app-login/app-login';
import { AppProfile } from './components/app-profile/app-profile';
import { AppRegister } from './components/app-register/app-register';
import { AppPlantasTable } from './components/plantes/app-planta-table/app-planta-table';
import { AppCreateForm } from './components/plantes/app-planta-create/app-planta-create';
import { AppPlantaMapa } from './components/plantes/app-plantes-mapa/app-planta-mapa';
import { AppPlantaGrid } from './components/plantes/app-planta-grid/app-planta-grid';
import { authGuard } from './guards/auth-guard-guard';

export const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', component: AppHome },
  { path: 'plantes', component: AppPlantaGrid, canActivate: [authGuard] },
  { path: 'plantes/mapa', component: AppPlantaMapa},
  { path: 'plantes/detall', component: AppPlantasTable, data:{eliminarCamp:['usuari','favorite']} },
  { path: 'plantes/crear', component: AppCreateForm, canActivate: [authGuard]},
  { path: 'planta/:id', component: AppPlantaDetall, canActivate: [authGuard] },
  { path: 'login', component: AppLogin },
  { path: 'register', component: AppRegister },
  { path: 'profile', component: AppProfile, canActivate: [authGuard] },
];
