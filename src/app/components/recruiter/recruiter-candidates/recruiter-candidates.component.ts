import { Component, Input, OnInit } from '@angular/core';
import { NavigationStart, Router } from '@angular/router';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { Candidate } from 'src/app/models/Candidate';
import { CandidateServiceService } from 'src/app/services/candidate-service.service';
import { RecruiterShowCandidateComponent } from './recruiter-show-candidate/recruiter-show-candidate.component';
import { RecruiterAddCandidateComponent } from './recruiter-add-candidate/recruiter-add-candidate.component';

@Component({
  selector: 'app-recruiter-candidates',
  templateUrl: './recruiter-candidates.component.html',
  styleUrls: ['./recruiter-candidates.component.css']
})
export class RecruiterCandidatesComponent implements OnInit{
  candidates!: Candidate[];
  response: any;
  @Input() candidate: Candidate | undefined;

  // candidates: Candidate[] = [];
  modalRef: NgbModalRef | undefined; // Modal reference variable
  pageSize: number = 5; // Initial page size

  searchCategory: string = '0'; // Default to "Chercher par" option
  searchKeyword: string = '';
  filteredCandidates: Candidate[] = [];

  @Input() recruiter: any;

  constructor(private modalService: NgbModal, private router: Router, private candidateService: CandidateServiceService) {
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

    this.getRecruiterCandidates(this.recruiter.idRec);
  }

  getRecruiterCandidates(id: number): void {
    this.candidateService.getRecruiterCandidates(id, this.pageSize).subscribe(
      (candidates) => {
        this.candidates = candidates;
        this.filteredCandidates = this.candidates;
      },
      (error) => {
        console.error(error);
      }
    );
  }

  onSearch() {
    if (this.searchCategory === '0') {
      // If no category is selected, reset the filteredCandidates array
      this.filteredCandidates = [];
      return;
    }else if (this.searchCategory === 'all') {
      // If "Tous les candidats" is selected, display all candidates
      this.filteredCandidates = this.candidates;
      this.searchKeyword = ''; // Reset the search keyword
      return;
    }
    // Perform the filtering based on the selected category and keyword
    this.filteredCandidates = this.candidates.filter(candidate => {
      if (this.searchCategory === 'expYears') {
        // Filter by experience years
        return candidate.expYears.toLowerCase().includes(this.searchKeyword.toLowerCase());
      } else if (this.searchCategory === 'diploma') {
        // Filter by diploma
        return candidate.diploma.toLowerCase().includes(this.searchKeyword.toLowerCase());
      } else if (this.searchCategory === 'spec') {
        // Filter by specialty
        return candidate.spec.toLowerCase().includes(this.searchKeyword.toLowerCase());
      }
      return false;
    });
  }

  onPageSizeChange(event: Event) {
    const value = (event.target as HTMLSelectElement)?.value;
    if (value) {
      this.pageSize = Number(value);
      this.getRecruiterCandidates(this.recruiter.idRec);
    }
  }

  public createImgPath = (serverPath: string) => { 
    return `https://localhost:7217/Content/Candidate/Images/${serverPath}`; 
  }

  showCandidate(id: number): void {
    this.candidateService.getCandidate(id).subscribe(
      (candidate) => {
        this.modalRef = this.modalService.open(RecruiterShowCandidateComponent);
        this.modalRef.componentInstance.candidate = candidate;
      },
      (error) => {
        console.error(error);
      }
    );
  }

  deleteCandidate(id: number) {
    this.candidateService.deleteCandidate(id).subscribe(
      (response) => {
        // handle successful deletion
        this.getRecruiterCandidates(this.recruiter.idRec);
      },
      (error) => {
        // handle error
        console.error(error);
      }
    );
  }

  // editCandidate(id: number): void {
  //   this.candidateService.getCandidate(id).subscribe(
  //     (candidate) => {
  //       this.modalRef = this.modalService.open(EditCandidateComponent);
  //       this.modalRef.componentInstance.candidate = candidate;
  //       this.modalRef.componentInstance.candidateUpdated.subscribe((updatedCandidate: Candidate) => {
  //         // Update the company list after successful update
  //         this.candidateService.getCandidates(this.pageSize).subscribe(
  //           (candidates) => {
  //             this.candidates = candidates;
  //             this.filteredCandidates = this.candidates;
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

  addCandidate() {
    this.modalRef = this.modalService.open(RecruiterAddCandidateComponent);
    this.modalRef.componentInstance.candidateAdded.subscribe((candidate: Candidate) => {
      // this.handleCompanyAdded(company);
      this.candidateService.getCandidates(this.pageSize).subscribe(
        (candidates) => {
          this.candidates = candidates;
          this.filteredCandidates = this.candidates;
        },
        (error) => {
          console.error(error);
        }
      );
    });
  }

  closeModal() {
    if (this.modalRef) {
      this.modalRef.close();
    }
  }

}
