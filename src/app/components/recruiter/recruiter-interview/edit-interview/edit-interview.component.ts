import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Interview } from 'src/app/models/Interview';
import { InterviewServiceService } from 'src/app/services/interview-service.service';

@Component({
  selector: 'app-edit-interview',
  templateUrl: './edit-interview.component.html',
  styleUrls: ['./edit-interview.component.css']
})
export class EditInterviewComponent implements OnInit{
  @Input() interview!: Interview;
  @Output() interviewUpdated: EventEmitter<Interview> = new EventEmitter<Interview>();
  @ViewChild('editInterviewForm') editInterviewForm!: NgForm;

  modifiedInterview: Interview = new Interview();
  Interviews: Interview[] = [];

  successMessage: string = '';
  errorMessage: string = '';

  interviews: Interview[] = [];

  @Input() recruiter: any;

  constructor(private activeModal: NgbActiveModal, private interviewService: InterviewServiceService) { }

  ngOnInit(): void {
    this.Interviews = [];

    const userLoggedString = sessionStorage.getItem('userLogged');
    if (userLoggedString) {
      const userLogged = JSON.parse(userLoggedString);
      this.recruiter = userLogged;
    }

    // this.getRecruiterInterviews(this.recruiter.idRec);
  }

  // getRecruiterInterviews(id: number): void {
  //   this.interviewService.getRecruiterInterviews(id, this.pageSize).subscribe(
  //     (interviews) => {
  //        // Handle the retrieved candidatures
  //       this.interviews = interviews;
  //       // this.filteredInterviews = this.interviews;
  //       // this.populateCandidatures();
  //       // this.populateCandidates();
  //       // this.populateOffers();
  //     },
  //     (error: any) => {
  //       // Handle error response
  //       console.error(error);
  //     }
  //   );
  // }

  editInterview(id:number): void {
    if (this.editInterviewForm.invalid) {
      this.errorMessage = 'Veuillez remplir correctement tous les champs obligatoires';
      return;
    }

    const formData = new FormData();

    formData.append('interviewDate', this.interview.interviewDate.toString());
    formData.append('address', this.interview.address);
    formData.append('interviewFormat', this.interview.interviewFormat);

    this.interviewService.editInterview(id, formData).subscribe(
      (response) => {
        this.successMessage = "Informations de l'entretien ont été mises à jour avec succès";
        this.errorMessage = ''; // Clear the error message
        this.interviews.push(response);
        this.interviewUpdated.emit(response);

      },
      (error) => {
        console.error(error);
          this.errorMessage = 'Veuillez remplir correctement tous les champs obligatoires';
          this.successMessage = ''; // Clear the success message
        // Handle the error if needed
      }
    );
  }

  public close() {
    this.activeModal.close();
  }

}
