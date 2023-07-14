import { HttpClient } from '@angular/common/http';
import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NavigationStart, Router } from '@angular/router';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { Interview } from 'src/app/models/Interview';
import { CandidateServiceService } from 'src/app/services/candidate-service.service';
import { CandidatureServiceService } from 'src/app/services/candidature-service.service';
import { InterviewServiceService } from 'src/app/services/interview-service.service';
import { OfferServiceService } from 'src/app/services/offer-service.service';
import { AdminShowInterviewComponent } from './admin-show-interview/admin-show-interview.component';


interface ClassColors {
  [key: string]: string;
}
@Component({
  selector: 'app-interviews',
  templateUrl: './interviews.component.html',
  styleUrls: ['./interviews.component.css']
})
export class InterviewsComponent implements OnInit {
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
  // previousStatus: string = '';

  @Input() recruiter: any;

  @Output() interviewUpdated: EventEmitter<Interview> = new EventEmitter<Interview>();

  constructor(private http: HttpClient,private modalService: NgbModal, private router: Router, private candidatureService: CandidatureServiceService, private candidateService: CandidateServiceService, private offerService: OfferServiceService, private changeDetector: ChangeDetectorRef, private interviewService: InterviewServiceService) {
    this.router.events.subscribe((event: any) => {
      if (event instanceof NavigationStart) {
        // Close the modal when navigating away
        this.closeModal();
      }
    });
  }

  async ngOnInit(): Promise<void> {

    await this.getInterviews();
  }

  public createImgPath = (serverPath: string) => { 
    return `https://localhost:7217/Content/Candidate/Images/${serverPath}`; 
  }

  // onStatusChange(event: any) {
  //   this.mySelectedValue = event.target.value;
  // }

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

  async getInterviews(): Promise<void>  {
    const interviews = await this.interviewService.getInterviews(this.pageSize).toPromise();
     
         // Handle the retrieved candidatures
        this.interviews = interviews;
        this.filteredInterviews = this.interviews;
        this.populateCandidatures();
        this.populateCandidates();
        this.populateOffers();
      
      // (error: any) => {
      //   // Handle error response
      //   console.error(error);
      // }
    
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
        let interviewDate = new Date(interview.interviewDate);
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
      this.getInterviews();
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
        this.modalRef = this.modalService.open(AdminShowInterviewComponent);
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
        this.getInterviews();
      },
      (error) => {
        // handle error
        console.error(error);
      }
    );
  }

  // editInterview(id: number): void {
  //   this.interviewService.getInterview(id).subscribe(
  //     (interview) => {
  //       this.modalRef = this.modalService.open(EditInterviewComponent);
  //       this.modalRef.componentInstance.interview = interview;
  //       this.modalRef.componentInstance.interviewUpdated.subscribe((updatedInterview: Interview) => {
  //         // Update the company list after successful update
  //         this.interviewService.getAllRecruiterInterviews(this.recruiter.idRec).subscribe(
  //           (interviews) => {
  //             this.interviews = interviews;
  //             this.filteredInterviews = interviews; // Update the filteredOffers array as well
  //             this.populateCandidatures();
  //             this.populateCandidates();
  //             this.populateOffers();
  //           },
  //           (error) => {
  //             console.error(error);
  //           }
  //         );
  //       });
  //     },
  //     (error) => {
  //       console.error(error);
  //     }
  //   );
  // }

  closeModal() {
    if (this.modalRef) {
      this.modalRef.close();
    }
  }

}
