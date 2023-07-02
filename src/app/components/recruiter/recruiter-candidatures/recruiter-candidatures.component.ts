import { HttpClient } from '@angular/common/http';
import { ChangeDetectorRef, Component, ElementRef, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NavigationStart, Router } from '@angular/router';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { Candidature } from 'src/app/models/Candidature';
import { CandidateServiceService } from 'src/app/services/candidate-service.service';
import { CandidatureServiceService } from 'src/app/services/candidature-service.service';
import { OfferServiceService } from 'src/app/services/offer-service.service';
import { ShowCandidatureComponent } from './show-candidature/show-candidature.component';
import { RecruiterInterviewComponent } from '../recruiter-interview/recruiter-interview.component';
import { AddInterviewComponent } from './add-interview/add-interview.component';
import { Interview } from 'src/app/models/Interview';

interface ClassColors {
  [key: string]: string;
}

@Component({
  selector: 'app-recruiter-candidatures',
  templateUrl: './recruiter-candidatures.component.html',
  styleUrls: ['./recruiter-candidatures.component.css']
})
export class RecruiterCandidaturesComponent implements OnInit{
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
  @Input() modalRef: NgbModalRef | undefined; // Modal reference variable

  pageSize: number = 5; // Initial page size
  searchCategory: string = '0'; // Default to "Chercher par" option
  searchKeyword: string = '';
  filteredCandidatures: Candidature[] = [];

  candidatureSort: string = 'none';

  errorMessage: string = '';

  previousStatus: string = '';

  @Input() recruiter: any;

  @Output() candidatureUpdated: EventEmitter<Candidature> = new EventEmitter<Candidature>();

  interviewAdded: boolean = false; // Add a new property to keep track of whether or not an interview was added

  constructor(private http: HttpClient,private modalService: NgbModal, private router: Router, private candidatureService: CandidatureServiceService, private candidateService: CandidateServiceService, private offerService: OfferServiceService, private changeDetector: ChangeDetectorRef, private elementRef: ElementRef) {
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
      this.recruiter = userLogged;
    }

    this.getRecruiterCandidature(this.recruiter.idRec);
  }

  public createImgPath = (serverPath: string) => { 
    return `https://localhost:7217/Content/Candidate/Images/${serverPath}`; 
  }

  resetCandidatureStatus(id: number) {
    this.candidatureService.getCandidature(id).subscribe(
      (response) => {
        const index = this.candidatures.findIndex(c => c.idCandidature === id);
        if (index !== -1) {
          this.candidatures[index].status = response.status;
          this.mySelectedValue = response.status; // Update the selected value
        }
      },
      (error) => {
        this.errorMessage = "Statut n'est pas modifié";
      }
    );
  }  

  onStatusChange(id: number, event: any) {
    this.mySelectedValue = event.target.value;
    this.previousStatus = this.candidatures.find(c => c.idCandidature === id)?.status || ''; // Save the previous status
  
    if (this.mySelectedValue === 'convoqué') {
      this.modalRef = this.modalService.open(AddInterviewComponent);
      this.modalRef.componentInstance.modalRef = this.modalRef;
      const index = this.candidatures.findIndex(c => c.idCandidature === id);
      this.modalRef.componentInstance.candidature = this.candidatures[index];
      this.modalRef.componentInstance.interviewAdded.subscribe((interview: Interview) => {
        // Update the status when an interview is added
        this.updateCandidatureStatus(id, this.mySelectedValue);
      });
      this.modalRef.dismissed.subscribe(() => {
        // Reset the status when the modal is dismissed
        console.log('Before reset:', this.candidatures[index].status); // Log the status before resetting
        this.resetCandidatureStatus(id);
        console.log('After reset:', this.candidatures[index].status); // Log the status after resetting
      });
      this.modalRef.componentInstance.modalClosed.subscribe(() => {
        this.resetCandidatureStatus(id);
      });
    } else {
      // Update the status if it's not "convoqué"
      this.updateCandidatureStatus(id, this.mySelectedValue);
    }
  }
  
  updateCandidatureStatus(id: number, status: string) {
    const formData = new FormData();
    formData.append('status', status);
    this.candidatureService.editCandidature(id, formData).subscribe(
      (response) => {
        // handle successful response
        const index = this.candidatures.findIndex(c => c.idCandidature === id);
        if (index !== -1) {
          this.candidatures[index].status = status;
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

  getRecruiterCandidature(id: number): void {
    this.candidatureService.getRecruiterCandidatures(id, this.pageSize).subscribe(
      (candidatures) => {
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
      this.getRecruiterCandidature(this.recruiter.idRec);
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
        this.getRecruiterCandidature(this.recruiter.idRec);
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
