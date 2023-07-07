import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { NavigationStart, Router } from '@angular/router';
import { NgbActiveModal, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { Candidate } from 'src/app/models/Candidate';
import { Candidature } from 'src/app/models/Candidature';
import { Interview } from 'src/app/models/Interview';
import { Offer } from 'src/app/models/Offer';
import { CandidatureServiceService } from 'src/app/services/candidature-service.service';
import { InterviewServiceService } from 'src/app/services/interview-service.service';

@Component({
  selector: 'app-add-interview',
  templateUrl: './add-interview.component.html',
  styleUrls: ['./add-interview.component.css']
})
export class AddInterviewComponent implements OnInit{
  candidate: Candidate = new Candidate();
  offer: Offer = new Offer();
  candidature: Candidature = new Candidature();

  interview: Interview = new Interview();
  interviews: Interview[] = [];

  errorMessage: string = '';
  successMessage: string = '';

  @ViewChild('addInterviewForm') addInterviewForm!: NgForm;
  @Output() interviewAdded: EventEmitter<any> = new EventEmitter<any>();

  formSubmitted: boolean = false;
  modalRef: NgbModalRef | undefined;
  @Output() modalClosed: EventEmitter<void> = new EventEmitter<void>();

  @Input() recruiter: any;

  constructor(private activeModal: NgbActiveModal, private candidatureService: CandidatureServiceService, private interviewService: InterviewServiceService,private modalService: NgbModal, private router: Router){
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

    this.interviews = [];

    if (this.candidature) {
      this.candidate = this.candidature.candidate;
      this.offer = this.candidature.offer;
    }
  }

  addInterview(){
    if (this.addInterviewForm.invalid) {
      // Mark all form fields as touched to show validation errors
      this.addInterviewForm.control.markAllAsTouched();
      return;
    }

    const formData = new FormData();

    formData.append('status', 'Planifié');
    formData.append('interviewDate', this.interview.interviewDate.toString());
    formData.append('address', this.interview.address);
    formData.append('interviewFormat', this.interview.interviewFormat);

    const recruiterName = this.recruiter.fName +' ' +this.recruiter.lName; 

    // Pass recruiter email and password
    formData.append('recruiterEmail', this.recruiter.email);
    formData.append('recruiterName', recruiterName);
    // formData.append('recruiterPassword', this.recruiter.pass);

    const candidateName = this.candidate.fName +' ' + this.candidate.lName; 

    // Pass candidate email
    formData.append('candidateEmail', this.candidate.email);
    formData.append('candidateName', candidateName);


    if (this.candidature.idCandidature) {
      formData.append('idCandidature', this.candidature.idCandidature.toString());
    }

    this.interviewService.addInterview(formData).subscribe(
      (response) => {
        this.successMessage = "Votre demande d'entretien a été soumise avec succès";
        this.errorMessage = '';
        this.interviews.push(response);
        this.interviewAdded.emit(response);
        
        this.formSubmitted = true;
      },
      (error) => {
        console.error(error);
        this.errorMessage = 'Veuillez remplir correctement tous les champs obligatoires';
        this.successMessage = '';
      }
    );
    
  }

  closeModal() {
    if (this.modalRef) {
      this.modalRef.close();
    }
    this.modalClosed.emit();
  }
  
}
