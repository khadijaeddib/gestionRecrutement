import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LockScreenComponent } from './components/account/lock-screen/lock-screen.component';
import { LoginComponent } from './components/account/login/login.component';
import { SignupComponent } from './components/account/signup/signup.component';
import { HomeComponent } from './components/admin/home/home.component';


const routes: Routes = [
  { path: 'signup', component: SignupComponent },
  { path: 'login', component: LoginComponent },
  { path: 'lockScreen', component: LockScreenComponent },
  { path: 'admin', component: HomeComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
