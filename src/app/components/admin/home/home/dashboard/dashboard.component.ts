import { Component, OnInit } from '@angular/core';
import { Candidature } from 'src/app/models/Candidature';
import { CandidateServiceService } from 'src/app/services/candidate-service.service';
import { CandidatureServiceService } from 'src/app/services/candidature-service.service';
import { OfferServiceService } from 'src/app/services/offer-service.service';

interface ClassColors {
  [key: string]: string;
}

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  candidatures: Candidature[] = [];

  pageSize: number = 5; 

  classColors: ClassColors = {
    reçu: 'reçu',
    encours: 'encours',
    convoqué: 'convoqué',
    embauché: 'embauché',
    refusé: 'refusé'
  };

  constructor(private candidatureService: CandidatureServiceService, private candidateService: CandidateServiceService, private offerService: OfferServiceService) { }

  async ngOnInit(): Promise<void> {
    await this.getAllCandidatures();
  }

  public createImgPath = (serverPath: string) => { 
    return `https://localhost:7217/Content/Candidate/Images/${serverPath}`; 
  }

  populateCandidates(): void {
    for (const candidature of this.candidatures) {
      this.candidateService.getCandidate(candidature.idCand).subscribe(
        (candidate) => {
          candidature.candidate = candidate;
        },
        (error) => {
          console.error(error);
        }
      );
    }
  }

  populateOffers(): void {
    for (const candidature of this.candidatures) {
      this.offerService.getOffer(candidature.idOffer).subscribe(
        (offer) => {
          candidature.offer = offer;
        },
        (error) => {
          console.error(error);
        }
      );
    }
  }

  async getAllCandidatures(): Promise<void> {
    const candidatures = await this.candidatureService
      .getAllCandidatures(this.pageSize)
      .toPromise();
    this.candidatures = candidatures;
    this.populateCandidates();
    this.populateOffers();
  }

}
