import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/AuthService.service';
import { CandidatureServiceService } from 'src/app/services/candidature-service.service';
import { OfferServiceService } from 'src/app/services/offer-service.service';

@Component({
  selector: 'app-candidate',
  templateUrl: './candidate.component.html',
  styleUrls: ['./candidate.component.css']
})
export class CandidateComponent {
  status = false;
  selectedLanguage = 'fr';
  userEmail: string | null = '';

  @Input() candidate: any;

  totalOffers!: number;
  totalCandidateCandidatures!: number;
  totalCandidateInterviews!: number;

  constructor(private router: Router, private AuthService: AuthService, private offerService: OfferServiceService, private candidatureService: CandidatureServiceService) { }

  ngOnInit(): void {
    this.userEmail = sessionStorage.getItem('userEmail');

    const userLoggedString = sessionStorage.getItem('userLogged');
    if (userLoggedString) {
      const userLogged = JSON.parse(userLoggedString);
      this.candidate = userLogged;
    }

    this.offerService.getAllOffers().subscribe(offers => {
      this.totalOffers = offers.length;
    });

    this.candidatureService.getAllCandidateCandidatures(this.candidate.idCand).subscribe(candiatures => {
      this.totalCandidateCandidatures = candiatures.length;
    });
  }

  public createImgPath = (serverPath: string) => { 
    return `https://localhost:7217/Content/Candidate/Images/${serverPath}`; 
  }

  addToggle(){
    this.status = !this.status;
  }

  logout() {
    sessionStorage.removeItem('userEmail');
    this.router.navigate(['/login']);
  }
  
}
