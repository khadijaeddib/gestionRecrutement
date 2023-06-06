import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/AuthService.service';

@Component({
  selector: 'app-recruiter',
  templateUrl: './recruiter.component.html',
  styleUrls: ['./recruiter.component.css']
})
export class RecruiterComponent implements OnInit {
  status = false;
  
  selectedLanguage = 'fr';
  userEmail: string | null = '';
  
  constructor(private router: Router, private AuthService: AuthService) { }
  
  ngOnInit(): void {
    this.userEmail = sessionStorage.getItem('userEmail');
  }
  
  addToggle(){
    this.status = !this.status;
  }
  
  logout() {
    sessionStorage.removeItem('userEmail');
    this.router.navigate(['/login']);
  }

}
