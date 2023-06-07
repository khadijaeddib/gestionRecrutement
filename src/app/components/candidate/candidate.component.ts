import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/AuthService.service';

@Component({
  selector: 'app-candidate',
  templateUrl: './candidate.component.html',
  styleUrls: ['./candidate.component.css']
})
export class CandidateComponent {
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
