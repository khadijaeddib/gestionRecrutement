import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/AuthService.service';
import { CandidateServiceService } from 'src/app/services/candidate-service.service';
import { CandidatureServiceService } from 'src/app/services/candidature-service.service';
import { OfferServiceService } from 'src/app/services/offer-service.service';

@Component({
  selector: 'app-recruiter',
  templateUrl: './recruiter.component.html',
  styleUrls: ['./recruiter.component.css']
})
export class RecruiterComponent implements OnInit {
  status = false;
  
  selectedLanguage = 'fr';
  userEmail: string | null = '';

  @Input() recruiter: any;

  newRecruiterCandidats!: number;
  visitors!: number;
  totalRecruiterOffers!: number;
  totalRecruiterCandidatures!: number;
  
  constructor(private router: Router, private AuthService: AuthService, private candidateService: CandidateServiceService, private candidatureService: CandidatureServiceService,private offerService: OfferServiceService) { }
  
  ngOnInit(): void {
    this.userEmail = sessionStorage.getItem('userEmail');

    const userLoggedString = sessionStorage.getItem('userLogged');
    if (userLoggedString) {
      const userLogged = JSON.parse(userLoggedString);
      this.recruiter = userLogged;
    }

    this.candidateService.getAllRecruiterCandidates(this.recruiter.idRec).subscribe(candidates => {
      this.newRecruiterCandidats = candidates.length;
    });
  
    this.offerService.getRecruiterOffers(this.recruiter.idRec).subscribe(offers => {
      this.totalRecruiterOffers = offers.length;
    });

    this.candidatureService.getAllRecruiterCandidatures(this.recruiter.idRec).subscribe(candiatures => {
      this.totalRecruiterCandidatures = candiatures.length;
    });

    this.AuthService.getTotalVisitors().subscribe(totalVisitors => {
      this.visitors = totalVisitors;
    });
  }
  
  public createImgPath = (serverPath: string) => { 
    return `https://localhost:7217/Content/Recruiter/${serverPath}`; 
  }

  addToggle(){
    this.status = !this.status;
  }
  
  logout() {
    sessionStorage.removeItem('userEmail');
    this.router.navigate(['/login']);
  }

}
