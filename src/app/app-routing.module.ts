import { NgModule } from '@angular/core';
import { Routes, RouterModule  } from '@angular/router';
import { LockScreenComponent } from './components/account/lock-screen/lock-screen.component';
import { LoginComponent } from './components/account/login/login.component';
import { SignupComponent } from './components/account/signup/signup.component';
import { DashboardComponent } from './components/admin/home/home/dashboard/dashboard.component';
import { HomeComponent } from './components/admin/home/home.component';
import { CandidatesComponent } from './components/admin/home/home/candidates/candidates.component';
import { RecruitersComponent } from './components/admin/home/home/recruiters/recruiters.component';
import { OffersComponent } from './components/admin/home/home/offers/offers.component';
import { CompaniesComponent } from './components/admin/home/home/companies/companies.component';
import { CandidaturesComponent } from './components/admin/home/home/candidatures/candidatures.component';
import { InterviewsComponent } from './components/admin/home/home/interviews/interviews.component';


const routes: Routes = [
  { path: 'signup', component: SignupComponent },
  { path: 'login', component: LoginComponent },
  { path: 'lockScreen', component: LockScreenComponent },
  { path: 'admin',
    component: HomeComponent,
    children:[
      { path: 'dashboard', component: DashboardComponent },
      { path: '',   redirectTo: '/admin/dashboard', pathMatch: 'full' },
      { path: 'recruiters', component: RecruitersComponent },
      { path: 'candidates', component: CandidatesComponent },
      { path: 'offers', component: OffersComponent },
      { path: 'companies', component: CompaniesComponent },
      { path: 'candidatures', component: CandidaturesComponent },
      { path: 'interviews', component: InterviewsComponent }
    ] },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
