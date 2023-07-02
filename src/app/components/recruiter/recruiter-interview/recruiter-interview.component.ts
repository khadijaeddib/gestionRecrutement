import { HttpClient } from '@angular/common/http';
import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { NavigationStart, Router } from '@angular/router';
import { NgbActiveModal, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { Candidate } from 'src/app/models/Candidate';
import { Candidature } from 'src/app/models/Candidature';
import { Interview } from 'src/app/models/Interview';
import { Offer } from 'src/app/models/Offer';
import { CandidateServiceService } from 'src/app/services/candidate-service.service';
import { CandidatureServiceService } from 'src/app/services/candidature-service.service';
import { InterviewServiceService } from 'src/app/services/interview-service.service';
import { OfferServiceService } from 'src/app/services/offer-service.service';
import { ShowInterviewComponent } from './show-interview/show-interview.component';
import { EditInterviewComponent } from './edit-interview/edit-interview.component';

interface ClassColors {
  [key: string]: string;
}

@Component({
  selector: 'app-recruiter-interview',
  templateUrl: './recruiter-interview.component.html',
  styleUrls: ['./recruiter-interview.component.css']
})
export class RecruiterInterviewComponent implements OnInit{
  mySelectedValue: string = 'Planifié'; // valeur initiale
  classColors: ClassColors = {
    Planifié: 'Planifié',
    Reporté: 'Reporté',
    Échoué: 'Échoué',
    Réussi: 'Réussi',
    Annulé: 'Annulé'
  };

  interviews: Interview[] = [];
  response: any;
  @Input() interview!: Interview;
  @Input() modalRef: NgbModalRef | undefined; // Modal reference variable

  pageSize: number = 5; // Initial page size
  searchCategory: string = '0'; // Default to "Chercher par" option
  searchKeyword: string = '';
  filteredInterviews: Interview[] = [];

  interviewSort: string = 'none';

  errorMessage: string = '';

  previousStatus: string = '';

  @Input() recruiter: any;
  // candidate: Candidate = new Candidate();
  // offer: Offer = new Offer();
  // candidature: Candidature = new Candidature();
  // candidatures: Candidature[] = [];

  @Output() interviewUpdated: EventEmitter<Interview> = new EventEmitter<Interview>();

  constructor(private http: HttpClient,private modalService: NgbModal, private router: Router, private candidatureService: CandidatureServiceService, private candidateService: CandidateServiceService, private offerService: OfferServiceService, private changeDetector: ChangeDetectorRef, private interviewService: InterviewServiceService) {
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

    this.getRecruiterInterviews(this.recruiter.idRec);
  }

  public createImgPath = (serverPath: string) => { 
    return `https://localhost:7217/Content/Candidate/Images/${serverPath}`; 
  }

  onStatusChange(id: number,event: any) {
    this.mySelectedValue = event.target.value;
    const formData = new FormData();
    formData.append('status', this.mySelectedValue);
    this.interviewService.editInterviewStatus(id, formData).subscribe(
      (response) => {
        // handle successful response
        const index = this.interviews.findIndex(c => c.idInterview === id);
        if (index !== -1) {
          this.interviews[index].status = this.mySelectedValue;
         }
       },
      (error) => {
      // handle error response
      this.errorMessage = "Statut n'est pas modifiée";
      }
    );
  }

  populateCandidatures(): void {
    for (const interview of this.interviews) {
      this.candidatureService.getCandidature(interview.idCandidature).subscribe(
        (candidature) => {
          interview.candidature = candidature;
        },
        (error) => {
          console.error(error);
        }
      );
    }
  }

  populateCandidates(): void {
    for (const interview of this.interviews) {
      this.candidateService.getCandidate(interview.candidature.idCand).subscribe(
        (candidate) => {
          interview.candidature.candidate = candidate;
        },
        (error) => {
          console.error(error);
        }
      );
    }
  }

  populateOffers(): void {
    for (const interview of this.interviews) {
      this.offerService.getOffer(interview.candidature.idOffer).subscribe(
        (offer) => {
          interview.candidature.offer = offer;
        },
        (error) => {
          console.error(error);
        }
      );
    }
  }

  getRecruiterInterviews(id: number): void {
    this.interviewService.getRecruiterInterviews(id, this.pageSize).subscribe(
      (interviews) => {
         // Handle the retrieved candidatures
        this.interviews = interviews;
        this.filteredInterviews = this.interviews;
        this.populateCandidatures();
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
      // If no category is selected, reset the filteredInterviews array
      this.filteredInterviews = [];
      return;
    }else if (this.searchCategory === 'all') {
      // If "Tous les candidats" is selected, display all candidatures
      this.filteredInterviews = this.interviews;
      this.searchKeyword = ''; // Reset the search keyword
      return;
    }
    // Perform the filtering based on the selected category and keyword
    this.filteredInterviews = this.interviews.filter(interview => {
      if (this.searchCategory === 'interviewDate') {
         // Filter by dateCand
        let interviewDate = new Date(this.interview.interviewDate);
        let searchDate = new Date(this.searchKeyword);
        let interviewDateString = interviewDate.getFullYear() + '-' + (interviewDate.getMonth() + 1).toString().padStart(2, '0') + '-' + interviewDate.getDate().toString().padStart(2, '0');
        let searchDateString = searchDate.getFullYear() + '-' + (searchDate.getMonth() + 1).toString().padStart(2, '0') + '-' + searchDate.getDate().toString().padStart(2, '0');
        return interviewDateString.startsWith(this.searchKeyword);
      } else if (this.searchCategory === 'title') {
        // Filter by title
        return interview.candidature.offer.title.toLowerCase().includes(this.searchKeyword.toLowerCase());
      } else if (this.searchCategory === 'status') {
        // Filter by status
        return interview.status.toLowerCase().includes(this.searchKeyword.toLowerCase());
      }
      return false;
    });
  }

  onPageSizeChange(event: Event) {
    const value = (event.target as HTMLSelectElement)?.value;
    if (value) {
      this.pageSize = Number(value);
      this.getRecruiterInterviews(this.recruiter.idRec);
    }
  }

  sortInterviewsByDate(order: string) {
    this.filteredInterviews.sort((a, b) => {
      let dateA = new Date(a.interviewDate);
      let dateB = new Date(b.interviewDate);
      if (order === 'desc') {
        return dateA.getTime() - dateB.getTime();
      } else if (order === 'asc') {
        return dateB.getTime() - dateA.getTime();
      }
      return 0; // Add a default return value
    });
  }

  showInterview(id: number, interview: Interview): void {
    this.candidateService.getCandidate(id).subscribe(
      (candidate) => {
        this.modalRef = this.modalService.open(ShowInterviewComponent);
        this.modalRef.componentInstance.candidate = candidate;
        this.modalRef.componentInstance.interview = interview;
       },
      (error) => {
        console.error(error);
      }
    );
  }
  
  deleteInterview(id: number) {
    this.interviewService.deleteInterview(id).subscribe(
      (response) => {
        // handle successful deletion
        this.getRecruiterInterviews(this.recruiter.idRec);
      },
      (error) => {
        // handle error
        console.error(error);
      }
    );
  }

  editInterview(id: number): void {
    this.interviewService.getInterview(id).subscribe(
      (interview) => {
        this.modalRef = this.modalService.open(EditInterviewComponent);
        this.modalRef.componentInstance.interview = interview;
        this.modalRef.componentInstance.interviewUpdated.subscribe((updatedInterview: Interview) => {
          // Update the company list after successful update
          this.interviewService.getAllRecruiterInterviews(this.recruiter.idRec).subscribe(
            (interviews) => {
              this.interviews = interviews;
              this.filteredInterviews = interviews; // Update the filteredOffers array as well
              this.populateCandidatures();
              this.populateCandidates();
              this.populateOffers();
            },
            (error) => {
              console.error(error);
            }
          );
        });
      },
      (error) => {
        console.error(error);
      }
    );
  }

  closeModal() {
    if (this.modalRef) {
      console.log('modal closed')
      this.modalRef.close();
    }
  }

}
