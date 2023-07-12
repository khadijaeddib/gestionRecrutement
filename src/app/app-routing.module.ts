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
import { CandidateComponent } from './components/candidate/candidate.component';
import { RecruiterComponent } from './components/recruiter/recruiter.component';
import { CandidateDashboardComponent } from './components/candidate/candidate-dashboard/candidate-dashboard.component';
import { CandidateProfileComponent } from './components/candidate/candidate-profile/candidate-profile.component';
import { RecruiterDashboardComponent } from './components/recruiter/recruiter-dashboard/recruiter-dashboard.component';
import { RecruiterCandidatesComponent } from './components/recruiter/recruiter-candidates/recruiter-candidates.component';
import { RecruiterOffersComponent } from './components/recruiter/recruiter-offers/recruiter-offers.component';
import { RecruiterCandidaturesComponent } from './components/recruiter/recruiter-candidatures/recruiter-candidatures.component';
import { CandidateOfferComponent } from './components/candidate/candidate-offer/candidate-offer.component';
import { CandidateCandidatureComponent } from './components/candidate/candidate-candidature/candidate-candidature.component';
import { CandidateInterviewComponent } from './components/candidate/candidate-interview/candidate-interview.component';
import { WelcomeComponent } from './components/welcome/welcome.component';
import { ContactComponent } from './components/welcome/contact/contact.component';
import { ShowOfferDetailsComponent } from './components/welcome/show-offer-details/show-offer-details.component';
import { OffersListComponent } from './components/welcome/offers-list/offers-list.component';
import { RecruiterInterviewComponent } from './components/recruiter/recruiter-interview/recruiter-interview.component';
import { ResetPasswordComponent } from './components/account/reset-password/reset-password.component';


const routes: Routes = [
  { path: 'signup', component: SignupComponent },
  { path: 'login', component: LoginComponent },
  { path: 'lockScreen', component: LockScreenComponent },
  { path: 'resetPassword', component: ResetPasswordComponent },
  { path: 'admin', component: HomeComponent,
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
  { path: 'candidate', component: CandidateComponent,
    children:[
      { path: 'dashboard', component:CandidateDashboardComponent },
      { path: '',   redirectTo: '/candidate/dashboard', pathMatch: 'full' },
      { path: 'profile', component: CandidateProfileComponent },
      { path: 'offers', component: CandidateOfferComponent },
      { path: 'candidatures', component: CandidateCandidatureComponent },
      { path: 'interviews', component: CandidateInterviewComponent }
    ] },
  { path: 'recruiter', component: RecruiterComponent,
  children:[
    { path: 'dashboard', component: RecruiterDashboardComponent },
    { path: '',   redirectTo: '/recruiter/dashboard', pathMatch: 'full' },
    { path: 'candidates', component: RecruiterCandidatesComponent },
    { path: 'offers', component: RecruiterOffersComponent },
    { path: 'candidatures', component: RecruiterCandidaturesComponent },
    { path: 'interviews', component: RecruiterInterviewComponent }
  ] },
  { path: 'home', component: WelcomeComponent},
  { path: 'contact', component: ContactComponent },
  { path: 'offer/:id', component: ShowOfferDetailsComponent },
  { path: 'offersList', component: OffersListComponent }
  
];

@NgModule({
  imports: [RouterModule.forRoot(routes),
    RouterModule.forRoot(routes, {
      onSameUrlNavigation: 'reload',
      scrollPositionRestoration: 'top'
    })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
