import {NgbModal, NgbModalRef} from '@ng-bootstrap/ng-bootstrap';
import { Component, Input, OnInit } from '@angular/core';
import { ShowRecruiterComponent } from './show-recruiter/show-recruiter.component';
import { Recruiter } from 'src/app/models/Recruiter';
import { RecruiterServiceService } from 'src/app/services/recruiter-service.service';
import { NavigationStart, Router } from '@angular/router';
import { AddRecruiterComponent } from './add-recruiter/add-recruiter.component';
import { EditRecruiterComponent } from './edit-recruiter/edit-recruiter.component';
import { OfferServiceService } from 'src/app/services/offer-service.service';
import { CandidateServiceService } from 'src/app/services/candidate-service.service';
import { InterviewServiceService } from 'src/app/services/interview-service.service';
import { Candidate } from 'src/app/models/Candidate';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-recruiters',
  templateUrl: './recruiters.component.html',
  styleUrls: ['./recruiters.component.css']
})
export class RecruitersComponent implements OnInit {
  recruiters!: Recruiter[];
  modalRef: NgbModalRef | undefined; // Modal reference variable
  response: any;
  @Input() recruiter: Recruiter | undefined;

  totalRecruiterOffers: number[] = [];
  totalRecruiterCandidates: number[] = [];
  totalRecruiterInterviews: number[] = [];
  activityLevels: number[] = [];

  constructor(private modalService: NgbModal, private router: Router, private recruiterService: RecruiterServiceService, private offerService:OfferServiceService, private candidateService: CandidateServiceService, private interviewService: InterviewServiceService) {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationStart) {
        // Close the modal when navigating away
        this.closeModal();
      }
    });
  }

  ngOnInit(): void {
    this.getRecruiters();
  }

  getRecruiterActivityLevel(offers: number, candidates: number, interviews: number): number {
    if (offers === 0) {
      return 0;
    }
    const activityLevel = (((candidates / offers) + (interviews / offers)) / 2) * 100;
    return Math.round(activityLevel);
  }

  calculateActivityLevels(): void {
    this.activityLevels = this.recruiters.map(recruiter => {
      const offers = this.totalRecruiterOffers[recruiter.idRec] || 0;
      const candidates = this.totalRecruiterCandidates[recruiter.idRec] || 0;
      const interviews = this.totalRecruiterInterviews[recruiter.idRec] || 0;
  
      // Log the values of offers, candidates, and interviews
      // console.log(`Recruiter ${recruiter.idRec}: offers=${offers}, candidates=${candidates}, interviews=${interviews}`);
  
      return this.getRecruiterActivityLevel(offers, candidates, interviews);
    });
  }

  getRecruiters(): void {
    this.recruiterService.getRecruiters().subscribe(
      (recruiters) => {
        this.recruiters = recruiters;
        forkJoin(
          this.recruiters.map(recruiter => {
            return forkJoin({
              offers: this.offerService.getRecruiterOffers(recruiter.idRec),
              candidates: this.candidateService.getAllRecruiterCandidates(recruiter.idRec),
              interviews: this.interviewService.getAllRecruiterInterviews(recruiter.idRec)
            });
          })
        ).subscribe(results => {
          results.forEach((result, index) => {
            // Log the results of the methods
            // console.log(`Recruiter ${this.recruiters[index].idRec}: offers=${result.offers.length}, candidates=${result.candidates.length}, interviews=${result.interviews.length}`);
  
            this.totalRecruiterOffers[index] = result.offers.length;
            this.totalRecruiterCandidates[index] = result.candidates.length;
            this.totalRecruiterInterviews[index] = result.interviews.length;
  
            // Calculate activity levels inside the forEach loop
            this.activityLevels[index] = this.getRecruiterActivityLevel(result.offers.length, result.candidates.length, result.interviews.length);
          });
        });
      },
      (error) => {
        console.error(error);
      }
    );
  }

  public createImgPath = (serverPath: string) => { 
    return `https://localhost:7217/Content/Recruiter/${serverPath}`; 
  }

  showRecruiter(id: number): void {
    this.recruiterService.getRecruiter(id).subscribe(
      (recruiter) => {
        this.modalRef = this.modalService.open(ShowRecruiterComponent);
        this.modalRef.componentInstance.recruiter = recruiter;
      },
      (error) => {
        console.error(error);
      }
    );
  }

  deleteRecruiter(id: number) {
    this.recruiterService.deleteRecruiter(id).subscribe(
      (response) => {
        // handle successful deletion
        this.getRecruiters();
      },
      (error) => {
        // handle error
        console.error(error);
      }
    );
  }

  addRecruiter() {
    this.modalRef = this.modalService.open(AddRecruiterComponent);
    this.modalRef.componentInstance.recruiterAdded.subscribe((recruiter: Recruiter) => {
      // this.handleCompanyAdded(company);
      this.recruiterService.getRecruiters().subscribe(
        (recruiters) => {
          this.recruiters = recruiters;
        },
        (error) => {
          console.error(error);
        }
      );
    });
  }

  editRecruiter(id: number): void {
    this.recruiterService.getRecruiter(id).subscribe(
      (recruiter) => {
        this.modalRef = this.modalService.open(EditRecruiterComponent);
        this.modalRef.componentInstance.recruiter = recruiter;
        this.modalRef.componentInstance.recruiterUpdated.subscribe((updatedRecruiter: Recruiter) => {
          // Update the company list after successful update
          this.recruiterService.getRecruiters().subscribe(
            (recruiters) => {
              this.recruiters = recruiters;
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
      this.modalRef.close();
    }
  }

}
