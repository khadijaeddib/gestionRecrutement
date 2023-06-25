import {NgbModal, NgbModalRef} from '@ng-bootstrap/ng-bootstrap';
import { Component, Input, OnInit } from '@angular/core';
import { ShowRecruiterComponent } from './show-recruiter/show-recruiter.component';
import { Recruiter } from 'src/app/models/Recruiter';
import { RecruiterServiceService } from 'src/app/services/recruiter-service.service';
import { NavigationStart, Router } from '@angular/router';
import { AddRecruiterComponent } from './add-recruiter/add-recruiter.component';
import { EditRecruiterComponent } from './edit-recruiter/edit-recruiter.component';

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

  constructor(private modalService: NgbModal, private router: Router, private recruiterService: RecruiterServiceService) {
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

  getRecruiters(): void {
    this.recruiterService.getRecruiters().subscribe(
      (recruiters) => {
        this.recruiters = recruiters;
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
