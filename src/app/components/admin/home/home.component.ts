import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/AuthService.service';
import { Location } from '@angular/common';



@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  status = false;

  selectedLanguage = 'fr';
  userEmail: string | null = '';

  constructor(private router: Router, private AuthService: AuthService) { }

  ngOnInit(): void {
    // this.userEmail = localStorage.getItem('userEmail');
    this.userEmail = sessionStorage.getItem('userEmail');
  }

  addToggle(){
    this.status = !this.status;
  }

  logout() {
    sessionStorage.removeItem('userEmail');
    this.router.navigate(['/login']);
  }



  // useLanguage(language: string) {
  //   this.translate.use(language);
  //   this.selectedLanguage = language;
  // }

}
