import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SignupComponent } from './components/account/signup/signup.component';
import {Ng2TelInputModule} from 'ng2-tel-input';
import { LoginComponent } from './components/account/login/login.component';
import { LockScreenComponent } from './components/account/lock-screen/lock-screen.component';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    AppComponent,
    SignupComponent,
    LoginComponent,
    LockScreenComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    Ng2TelInputModule,
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
