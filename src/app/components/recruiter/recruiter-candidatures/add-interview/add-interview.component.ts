import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
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
  // candidatures: Candidature[] = [];

  interview: Interview = new Interview();
  interviews: Interview[] = [];

  errorMessage: string = '';
  successMessage1: string = '';
  successMessage2: string = '';

  @ViewChild('addInterviewForm') addInterviewForm!: NgForm;
  // @Output() offerApplied: EventEmitter<any> = new EventEmitter<any>();
  // @Output() offerApplied: EventEmitter<{ appliedOffer: Offer, idOffer: number }> = new EventEmitter<{ appliedOffer: Offer, idOffer: number }>();
  @Output() interviewAdded: EventEmitter<any> = new EventEmitter<any>();

  formSubmitted: boolean = false;
  modalRef: NgbModalRef | undefined;
  @Output() modalClosed: EventEmitter<void> = new EventEmitter<void>();


  constructor(private activeModal: NgbActiveModal, private candidatureService: CandidatureServiceService, private interviewService: InterviewServiceService,private modalService: NgbModal, private router: Router){
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationStart) {
        // Close the modal when navigating away
        this.closeModal();
      }
    });
  }

  ngOnInit(): void {
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

    // formData.append('status', this.candidature.status);
    formData.append('status', 'Planifié');
    formData.append('interviewDate', this.interview.interviewDate.toString());
    formData.append('address', this.interview.address);
    formData.append('interviewFormat', this.interview.interviewFormat);

    if (this.candidature.idCandidature) {
      formData.append('idCandidature', this.candidature.idCandidature.toString());
    }

    this.interviewService.addInterview(formData).subscribe(
      (response) => {
        this.successMessage1 = "Félicitations ! ";
        this.successMessage2 = "Votre demande d'entretien a été soumise avec succès";
        this.errorMessage = '';
        this.interviews.push(response);
        this.interviewAdded.emit(response);
        
        this.formSubmitted = true;
      },
      (error) => {
        console.error(error);
        this.errorMessage = 'Veuillez remplir correctement tous les champs obligatoires';
        this.successMessage1 = '';
        this.successMessage2 = '';
      }
    );
  }

  // closeModal() {
  //   console.log("close")
  //   console.log(this.modalRef)

  //   if (this.modalRef) {
  //     this.modalRef.close();
  //   }
  // }

  closeModal() {
    if (this.modalRef) {
      this.modalRef.close();
    }
    this.modalClosed.emit();
  }
  
}
