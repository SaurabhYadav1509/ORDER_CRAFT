import { Routes } from '@angular/router';
import { Customers } from './components/customers/customers';
import { Login } from './components/login/login';
import { Signup } from './components/signup/signup';
import { AdminDashboard } from './components/admin-dashboard/admin-dashboard';
import { UserDashboard } from './components/user-dashboard/user-dashboard';
import { Products } from './components/products/products';
import { Materials } from './components/materials/materials';
import { Suppliers } from './components/suppliers/suppliers';
import { InventoryComponent } from './components/inventory/inventory';
import { authGuard } from './guards/auth.guard';
import { adminGuard } from './guards/admin.guard';

export const routes: Routes = [
  {
    path: 'login',
    component: Login
  },
  {
    path: 'signup',
    component: Signup
  },
  {
    path: 'admin',
    component: AdminDashboard,
    canActivate: [adminGuard]
  },
  {
    path: 'dashboard',
    component: UserDashboard,
    canActivate: [authGuard]
  },
  {
    path: 'customers',
    component: Customers,
    canActivate: [adminGuard]
  },
  {
    path: 'products',
    component: Products,
    canActivate: [adminGuard]
  },
  {
    path: 'materials',
    component: Materials,
    canActivate: [adminGuard]
  },
  {
    path: 'suppliers',
    component: Suppliers,
    canActivate: [adminGuard]
  },
  {
    path: 'inventory',
    component: InventoryComponent,
    canActivate: [adminGuard]
  },
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: '**',
    redirectTo: 'login'
  }
];
