import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/AuthService.service';
import { CandidatureServiceService } from 'src/app/services/candidature-service.service';
import { InterviewServiceService } from 'src/app/services/interview-service.service';
import { OfferServiceService } from 'src/app/services/offer-service.service';
import { UpdateCandidateServiceService } from 'src/app/services/update-candidate-service.service';

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

  email: string | null = '';
  candImagePath: string | null = '';

  constructor(private router: Router, private AuthService: AuthService, private offerService: OfferServiceService, private candidatureService: CandidatureServiceService, private interviewService: InterviewServiceService,private updateCandidateService: UpdateCandidateServiceService) { }

  ngOnInit(): void {
    this.userEmail = sessionStorage.getItem('userEmail');

    const userLoggedString = sessionStorage.getItem('userLogged');
    if (userLoggedString) {
      const userLogged = JSON.parse(userLoggedString);
      this.candidate = userLogged;
      this.updateCandidateService.updateCandidate(userLogged);
      this.email = this.userEmail; // Update the email directly
      this.candImagePath = userLogged.candImagePath;
    }

    this.updateCandidateService.candidate$.subscribe(candidate => {
      this.candidate = candidate;
    });

    this.updateCandidateService.candidate$.subscribe((candidate) => {
      if (candidate) {
        this.candidate = candidate;
        this.candImagePath = candidate.candImagePath;
      }
    });
    
    this.updateCandidateService.candImagePath$.subscribe((candImagePath) => {
      if (candImagePath) {
        this.candImagePath = candImagePath;
      } else {
        this.candImagePath = this.candidate.candImagePath;
      }
    });

    this.updateCandidateService.email$.subscribe((email) => {
      if (email) {
        this.email = email;
      } else {
        this.email = this.userEmail;
      }
    });   

   // Retrieve data from server initially
   this.updateData();

   // Set up a timer to periodically retrieve data from server
   setInterval(() => {
     this.updateData();
   }, 1000); // Update data every 10 seconds
 }

 updateData() {
    this.offerService.getAllOffers().subscribe(offers => {
      this.totalOffers = offers.length;
    });

    this.candidatureService.getAllCandidateCandidatures(this.candidate.idCand).subscribe(candiatures => {
      this.totalCandidateCandidatures = candiatures.length;
    });

    this.interviewService.getAllCandidateInterviews(this.candidate.idCand).subscribe(interviews => {
      this.totalCandidateInterviews = interviews.length;
    });
 }

  public createImgPath = () => {
    return `https://localhost:7217/Content/Candidate/Images/${this.candImagePath}`;
  };

  addToggle(){
    this.status = !this.status;
  }

  logout() {
    sessionStorage.removeItem('userEmail');
    this.router.navigate(['/login']);
  }
  
}
