import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';

import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { HttpClient, HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app.component';
import { SignupComponent } from './components/account/signup/signup.component';
import {Ng2TelInputModule} from 'ng2-tel-input';
import { LoginComponent } from './components/account/login/login.component';
import { LockScreenComponent } from './components/account/lock-screen/lock-screen.component';
import { FormsModule } from '@angular/forms';
import { HomeComponent } from './components/admin/home/home.component';
import { DashboardComponent } from './components/admin/home/home/dashboard/dashboard.component';
import { CandidatesComponent } from './components/admin/home/home/candidates/candidates.component';
import { RecruitersComponent } from './components/admin/home/home/recruiters/recruiters.component';
import { OffersComponent } from './components/admin/home/home/offers/offers.component';
import { CandidaturesComponent } from './components/admin/home/home/candidatures/candidatures.component';
import { InterviewsComponent } from './components/admin/home/home/interviews/interviews.component';
import { CompaniesComponent } from './components/admin/home/home/companies/companies.component';

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
    CompaniesComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    Ng2TelInputModule,
    FormsModule,
    HttpClientModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: httpTranslateLoader,
        deps: [HttpClient]
      }
    })
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

export function httpTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http);
}
