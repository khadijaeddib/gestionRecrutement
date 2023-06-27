import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import {NgbActiveModal, NgbModule} from '@ng-bootstrap/ng-bootstrap';

import { AppRoutingModule } from './app-routing.module';

import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { NgSelectModule } from '@ng-select/ng-select';
import { DatePipe } from '@angular/common';
import { NgxIntlTelInputModule } from 'ngx-intl-tel-input-gg';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppComponent } from './app.component';
import { SignupComponent } from './components/account/signup/signup.component';
import { LoginComponent } from './components/account/login/login.component';
import { LockScreenComponent } from './components/account/lock-screen/lock-screen.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HomeComponent } from './components/admin/home/home.component';
import { DashboardComponent } from './components/admin/home/home/dashboard/dashboard.component';
import { CandidatesComponent } from './components/admin/home/home/candidates/candidates.component';
import { RecruitersComponent } from './components/admin/home/home/recruiters/recruiters.component';
import { OffersComponent } from './components/admin/home/home/offers/offers.component';
import { CandidaturesComponent } from './components/admin/home/home/candidatures/candidatures.component';
import { InterviewsComponent } from './components/admin/home/home/interviews/interviews.component';
import { CompaniesComponent } from './components/admin/home/home/companies/companies.component';
import { ShowCandidateComponent } from './components/admin/home/home/candidates/show-candidate/show-candidate.component';
import { ShowRecruiterComponent } from './components/admin/home/home/recruiters/show-recruiter/show-recruiter.component';
import { AddCompanyComponent } from './components/admin/home/home/companies/add-company/add-company.component';
import { EditCompanyComponent } from './components/admin/home/home/companies/edit-company/edit-company.component';
import { RecruiterComponent } from './components/recruiter/recruiter.component';
import { CandidateComponent } from './components/candidate/candidate.component';
import { CandidateProfileComponent } from './components/candidate/candidate-profile/candidate-profile.component';
import { CandidateDashboardComponent } from './components/candidate/candidate-dashboard/candidate-dashboard.component';
import { EditCandidateComponent } from './components/admin/home/home/candidates/edit-candidate/edit-candidate.component';
import { AddCandidateComponent } from './components/admin/home/home/candidates/add-candidate/add-candidate.component';
import { AddRecruiterComponent } from './components/admin/home/home/recruiters/add-recruiter/add-recruiter.component';
import { RecruiterDashboardComponent } from './components/recruiter/recruiter-dashboard/recruiter-dashboard.component';
import { RecruiterCandidatesComponent } from './components/recruiter/recruiter-candidates/recruiter-candidates.component';
import { RecruiterOffersComponent } from './components/recruiter/recruiter-offers/recruiter-offers.component';
import { RecruiterCandidaturesComponent } from './components/recruiter/recruiter-candidatures/recruiter-candidatures.component';
import { RecruiterInterviewsComponent } from './components/recruiter/recruiter-interviews/recruiter-interviews.component';
import { AddOfferComponent } from './components/recruiter/recruiter-offers/add-offer/add-offer.component';
import { EditOfferComponent } from './components/recruiter/recruiter-offers/edit-offer/edit-offer.component';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { EditRecruiterComponent } from './components/admin/home/home/recruiters/edit-recruiter/edit-recruiter.component';
import { CandidateOfferComponent } from './components/candidate/candidate-offer/candidate-offer.component';
import { ApplyOfferComponent } from './components/candidate/candidate-offer/apply-offer/apply-offer.component';
import { CandidateCandidatureComponent } from './components/candidate/candidate-candidature/candidate-candidature.component';
import { CandidateInterviewComponent } from './components/candidate/candidate-interview/candidate-interview.component';
import { ShowCandidatureComponent } from './components/recruiter/recruiter-candidatures/show-candidature/show-candidature.component';
import { AdminAddOfferComponent } from './components/admin/home/home/offers/admin-add-offer/admin-add-offer.component';
import { AdminEditOfferComponent } from './components/admin/home/home/offers/admin-edit-offer/admin-edit-offer.component';
import { RecruiterAddCandidateComponent } from './components/recruiter/recruiter-candidates/recruiter-add-candidate/recruiter-add-candidate.component';
import { RecruiterShowCandidateComponent } from './components/recruiter/recruiter-candidates/recruiter-show-candidate/recruiter-show-candidate.component';
import { WelcomeComponent } from './components/welcome/welcome.component';
import { ContactComponent } from './components/welcome/contact/contact.component';
import { ShowOfferDetailsComponent } from './components/welcome/show-offer-details/show-offer-details.component';
import { OffersListComponent } from './components/welcome/offers-list/offers-list.component';

@NgModule({
  declarations: [
    AppComponent,
    SignupComponent,
    LoginComponent,
    LockScreenComponent,
    HomeComponent,
    DashboardComponent,
    CandidatesComponent,
    RecruitersComponent,
    OffersComponent,
    CandidaturesComponent,
    InterviewsComponent,
    CompaniesComponent,
    ShowCandidateComponent,
    ShowRecruiterComponent,
    AddCompanyComponent,
    EditCompanyComponent,
    RecruiterComponent,
    CandidateComponent,
    CandidateProfileComponent,
    CandidateDashboardComponent,
    EditCandidateComponent,
    AddCandidateComponent,
    AddRecruiterComponent,
    RecruiterDashboardComponent,
    RecruiterCandidatesComponent,
    RecruiterOffersComponent,
    RecruiterCandidaturesComponent,
    RecruiterInterviewsComponent,
    AddOfferComponent,
    EditOfferComponent,
    EditRecruiterComponent,
    CandidateOfferComponent,
    ApplyOfferComponent,
    CandidateCandidatureComponent,
    CandidateInterviewComponent,
    ShowCandidatureComponent,
    AdminAddOfferComponent,
    AdminEditOfferComponent,
    RecruiterAddCandidateComponent,
    RecruiterShowCandidateComponent,
    WelcomeComponent,
    ContactComponent,
    ShowOfferDetailsComponent,
    OffersListComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: httpTranslateLoader,
        deps: [HttpClient]
      }
    }),
    NgbModule,
    ReactiveFormsModule,
    HttpClientModule,
    NgSelectModule,
    NgxIntlTelInputModule,
    BrowserAnimationsModule,
    BsDatepickerModule.forRoot(),
    
  ],
  providers: [
    NgbActiveModal,
    DatePipe
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

export function httpTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http);
}
