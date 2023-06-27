import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/AuthService.service';
import { Location } from '@angular/common';
import { CandidatureServiceService } from 'src/app/services/candidature-service.service';
import { CandidateServiceService } from 'src/app/services/candidate-service.service';
import { OfferServiceService } from 'src/app/services/offer-service.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  status = false;

  selectedLanguage = 'fr';
  userEmail: string | null = '';

  newCandidats!: number;
  visitors!: number;
  totalOffers!: number;
  totalCandidatures!: number;
 
  constructor(private router: Router, private AuthService: AuthService, private candidatureService: CandidatureServiceService, private candidateService: CandidateServiceService, private offerService: OfferServiceService) { }

  ngOnInit(): void {
    // this.userEmail = localStorage.getItem('userEmail');
    this.userEmail = sessionStorage.getItem('userEmail');

    this.candidateService.getAllCandidates().subscribe(candidates => {
      this.newCandidats = candidates.length;
    });
  
    this.offerService.getAllOffers().subscribe(offers => {
      this.totalOffers = offers.length;
    });

    this.candidatureService.getCandidatures().subscribe(candiatures => {
      this.totalCandidatures = candiatures.length;
    });

    this.AuthService.getTotalVisitors().subscribe(totalVisitors => {
      this.visitors = totalVisitors;
    });
  }

  addToggle(){
    this.status = !this.status;
  }

  logout() {
    sessionStorage.removeItem('userEmail');
    this.router.navigate(['/login']);
  }

}
