import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { RecipeListComponent } from './components/recipe-list/recipe-list.component';
import { RecipeFormComponent } from './components/recipe-form/recipe-form.component';
import { RecipeDetailComponent } from './components/recipe-detail/recipe-detail.component';
import { AdminDashboardComponent } from './components/admin-dashboard/admin-dashboard.component';

import { authGuard } from './guards/auth.guard';
import { adminGuard } from './guards/admin.guard';

export const routes: Routes = [
    { path: '', component: HomeComponent },
    { path: 'login', component: LoginComponent },
    { path: 'register', component: RegisterComponent },
    { path: 'recipes', component: RecipeListComponent, canActivate: [authGuard] },
    { path: 'recipes/new', component: RecipeFormComponent, canActivate: [authGuard] },
    { path: 'recipes/:id', component: RecipeDetailComponent, canActivate: [authGuard] },
    { path: 'recipes/:id/edit', component: RecipeFormComponent, canActivate: [authGuard] },
    { path: 'admin', component: AdminDashboardComponent, canActivate: [adminGuard] },

    // fallback
    { path: '**', redirectTo: '' }
];
