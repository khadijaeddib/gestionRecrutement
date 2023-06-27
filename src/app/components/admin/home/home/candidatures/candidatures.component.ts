import { HttpClient } from '@angular/common/http';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NavigationStart, Router } from '@angular/router';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { Candidature } from 'src/app/models/Candidature';
import { CandidateServiceService } from 'src/app/services/candidate-service.service';
import { CandidatureServiceService } from 'src/app/services/candidature-service.service';
import { OfferServiceService } from 'src/app/services/offer-service.service';
import { ShowCandidatureComponent } from './show-candidature/show-candidature.component';

interface ClassColors {
  [key: string]: string;
}

@Component({
  selector: 'app-candidatures',
  templateUrl: './candidatures.component.html',
  styleUrls: ['./candidatures.component.css']
})
export class CandidaturesComponent implements OnInit {
  mySelectedValue: string = 'reçu'; // valeur initiale
  classColors: ClassColors = {
    reçu: 'reçu',
    encours: 'encours',
    convoqué: 'convoqué',
    embauché: 'embauché',
    refusé: 'refusé'
  };

  candidatures: Candidature[] = [];
  response: any;
  @Input() candidature!: Candidature;
  modalRef: NgbModalRef | undefined; // Modal reference variable

  pageSize: number = 5; // Initial page size
  searchCategory: string = '0'; // Default to "Chercher par" option
  searchKeyword: string = '';
  filteredCandidatures: Candidature[] = [];

  candidatureSort: string = 'none';

  errorMessage: string = '';

  @Output() candidatureUpdated: EventEmitter<Candidature> = new EventEmitter<Candidature>();

  constructor(private http: HttpClient,private modalService: NgbModal, private router: Router, private candidatureService: CandidatureServiceService, private candidateService: CandidateServiceService, private offerService: OfferServiceService) {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationStart) {
        // Close the modal when navigating away
        this.closeModal();
      }
    });
  }

  // ngOnInit(): void {
  //   this.getAllCandidatures();
  // }
  async ngOnInit(): Promise<void> {
    await this.getAllCandidatures();
  }
  
  public createImgPath = (serverPath: string) => { 
    return `https://localhost:7217/Content/Candidate/Images/${serverPath}`; 
  }

  onStatusChange(id: number,event: any) {
    this.mySelectedValue = event.target.value;
    const formData = new FormData();
    formData.append('status', this.mySelectedValue);
    this.candidatureService.editCandidature(id, formData).subscribe(
      (response) => {
        // handle successful response
        const index = this.candidatures.findIndex(c => c.idCandidature === id);
        if (index !== -1) {
          this.candidatures[index].status = this.mySelectedValue;
        }
      },
     (error) => {
     // handle error response
      this.errorMessage = "Statut n'est pas modifiée";
     }
    );
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


  async getAllCandidatures(): Promise<void> {
    const candidatures = await this.candidatureService
      .getAllCandidatures(this.pageSize)
      .toPromise();
    this.candidatures = candidatures;
    this.filteredCandidatures = this.candidatures;
    this.populateCandidates();
    this.populateOffers();
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
      this.getAllCandidatures();
    }
  }

  sortCandidaturesByDate(order: string) {
    this.filteredCandidatures.sort((a, b) => {
      let dateA = new Date(a.dateCand);
      let dateB = new Date(b.dateCand);
      if (order === 'desc') {
        return dateA.getTime() - dateB.getTime();
      } else if (order === 'asc') {
        return dateB.getTime() - dateA.getTime();
      }
      return 0; // Add a default return value
    });
  }

  // editCandidature(id: number) {
  //   this.candidatureService.getCandidature(id).subscribe(response => {
  //     this.candidature = response; // Assuming the response contains the Candidature object
  //     this.mySelectedValue = this.candidature.status; // Set the initial selected value
  //   });
  // }

  // onStatusChange() {
  //   // Call your API or perform any necessary operations to update the candidature status in the database
  //   this.service.editCandidature(this.candidature.id, this.candidature).subscribe(response => {
  //     console.log('Candidature status updated successfully');
  //   });
  // }
  
  showCandidate(id: number, candidature: Candidature): void {
    this.candidateService.getCandidate(id).subscribe(
      (candidate) => {
        this.modalRef = this.modalService.open(ShowCandidatureComponent);
        this.modalRef.componentInstance.candidate = candidate;
        this.modalRef.componentInstance.candidature = candidature;
      },
      (error) => {
        console.error(error);
      }
    );
  }

  deleteCandidature(id: number) {
    this.candidatureService.deleteCandidature(id).subscribe(
      (response) => {
        // handle successful deletion
        this.getAllCandidatures();
      },
      (error) => {
        // handle error
        console.error(error);
      }
    );
  }

  closeModal() {
    if (this.modalRef) {
      this.modalRef.close();
    }
  }

}
