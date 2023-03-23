import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SignupComponent } from './account/signup/signup.component';
import {Ng2TelInputModule} from 'ng2-tel-input';

@NgModule({
  declarations: [
    AppComponent,
    SignupComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    Ng2TelInputModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
