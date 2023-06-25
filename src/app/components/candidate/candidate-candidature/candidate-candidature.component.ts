import { HttpClient } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { NavigationStart, Router } from '@angular/router';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { Candidature } from 'src/app/models/Candidature';
import { CandidateServiceService } from 'src/app/services/candidate-service.service';
import { CandidatureServiceService } from 'src/app/services/candidature-service.service';
import { OfferServiceService } from 'src/app/services/offer-service.service';

interface ClassColors {
  [key: string]: string;
}

@Component({
  selector: 'app-candidate-candidature',
  templateUrl: './candidate-candidature.component.html',
  styleUrls: ['./candidate-candidature.component.css']
})
export class CandidateCandidatureComponent implements OnInit{
  classColors: ClassColors = {
    reçu: 'reçu',
    encours: 'encours',
    convoqué: 'convoqué',
    embauché: 'embauché',
    refusé: 'refusé'
  };

  // candidatures: Candidature[] = [];
  @Input() candidate: any;
  @Input() candidatures!: any[];
  response: any;
  // @Input() candidature!: Candidature;
  modalRef: NgbModalRef | undefined; // Modal reference variable

  pageSize: number = 5; // Initial page size
  searchCategory: string = '0'; // Default to "Chercher par" option
  searchKeyword: string = '';
  filteredCandidatures: Candidature[] = [];

  candidatureSort: string = 'none';

  constructor(private http: HttpClient,private modalService: NgbModal, private router: Router, private candidatureService: CandidatureServiceService, private candidateService: CandidateServiceService, private offerService: OfferServiceService) {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationStart) {
        // Close the modal when navigating away
        this.closeModal();
      }
    });
  }

  ngOnInit(): void {
  const userLoggedString = sessionStorage.getItem('userLogged');
  if (userLoggedString) {
    const userLogged = JSON.parse(userLoggedString);
    this.candidate = userLogged;
  }

  this.getCandidateCandidatures(this.candidate.idCand);
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

  // getAllCandidatures(): void {
  //   this.candidatureService.getAllCandidatures(this.pageSize).subscribe(
  //     (candidatures) => {
  //       console.log(candidatures); 
  //       this.candidatures = candidatures;
  //       this.filteredCandidatures = this.candidatures;
  //       this.populateCandidates();
  //       this.populateOffers();
  //     },
  //     (error) => {
  //       console.error(error);
  //     }
  //   );
  // }

  // async getAllCandidatures(): Promise<void> {
  //   const candidatures = await this.candidatureService
  //     .getAllCandidatures(this.pageSize)
  //     .toPromise();
  //   this.candidatures = candidatures;
  //   this.filteredCandidatures = this.candidatures;
  //   this.populateCandidates();
  //   this.populateOffers();
  // }

  // getCandidaturesForCandidate(candidate: any) {
  //   return this.candidatures.filter(
  //     (c) => c.idCand === candidate.idCand
  //   );
  // }

  getCandidateCandidatures(id: number): void {
    this.candidatureService.getCandidateCandidatures(id,this.pageSize).subscribe(
      (candidatures: Candidature[]) => {
        // Handle the retrieved candidatures
        this.candidatures = candidatures;
        this.filteredCandidatures = this.candidatures;
        this.populateCandidates();
        this.populateOffers();
      },
      (error: any) => {
        // Handle error response
        console.error(error);
      }
    );
  }

  onSearch() {
    if (this.searchCategory === '0') {
      // If no category is selected, reset the filteredCandidatures array
      this.filteredCandidatures = [];
      return;
    }else if (this.searchCategory === 'all') {
      // If "Tous les candidats" is selected, display all candidatures
      this.filteredCandidatures = this.candidatures;
      this.searchKeyword = ''; // Reset the search keyword
      return;
    }
    // Perform the filtering based on the selected category and keyword
    this.filteredCandidatures = this.candidatures.filter(candidature => {
      if (this.searchCategory === 'dateCand') {
         // Filter by dateCand
        let dateCand = new Date(candidature.dateCand);
        let searchDate = new Date(this.searchKeyword);
        let dateCandString = dateCand.getFullYear() + '-' + (dateCand.getMonth() + 1).toString().padStart(2, '0') + '-' + dateCand.getDate().toString().padStart(2, '0');
        let searchDateString = searchDate.getFullYear() + '-' + (searchDate.getMonth() + 1).toString().padStart(2, '0') + '-' + searchDate.getDate().toString().padStart(2, '0');
        return dateCandString.startsWith(this.searchKeyword);
      } else if (this.searchCategory === 'title') {
        // Filter by title
        return candidature.offer.title.toLowerCase().includes(this.searchKeyword.toLowerCase());
      } else if (this.searchCategory === 'status') {
        // Filter by status
        return candidature.status.toLowerCase().includes(this.searchKeyword.toLowerCase());
      }
      return false;
    });
  }

  onPageSizeChange(event: Event) {
    const value = (event.target as HTMLSelectElement)?.value;
    if (value) {
      this.pageSize = Number(value);
      this.getCandidateCandidatures(this.candidate.idCand);
    }
  }

  sortCandidaturesByDate(order: string) {
    this.filteredCandidatures.sort((a, b) => {
      let dateA = new Date(a.dateCand);
      let dateB = new Date(b.dateCand);
      if (order === 'asc') {
        return dateA.getTime() - dateB.getTime();
      } else if (order === 'desc') {
        return dateB.getTime() - dateA.getTime();
      }
      return 0; // Add a default return value
    });
  }

  closeModal() {
    if (this.modalRef) {
      this.modalRef.close();
    }
  }

}
