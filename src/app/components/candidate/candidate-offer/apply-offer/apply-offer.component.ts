import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DatePipe } from '@angular/common';
import { Candidate } from 'src/app/models/Candidate';
import { Candidature } from 'src/app/models/Candidature';
import { CandidateServiceService } from 'src/app/services/candidate-service.service';
import { CandidatureServiceService } from 'src/app/services/candidature-service.service';
import { Offer } from 'src/app/models/Offer';

@Component({
  selector: 'app-apply-offer',
  templateUrl: './apply-offer.component.html',
  styleUrls: ['./apply-offer.component.css']
})
export class ApplyOfferComponent implements OnInit{
  candidate: Candidate = new Candidate();

  candidature: Candidature = new Candidature();
  candidatures: Candidature[] = [];

  errorMessage: string = '';
  successMessage1: string = '';
  successMessage2: string = '';
  successMessage3: string = '';

  currentDateTime: string | null = new Date().toISOString();

  @Input() offer!: Offer;

  @ViewChild('applyForm') applyForm!: NgForm;
  // @Output() offerApplied: EventEmitter<any> = new EventEmitter<any>();
  @Output() offerApplied: EventEmitter<{ appliedOffer: Offer, idOffer: number }> = new EventEmitter<{ appliedOffer: Offer, idOffer: number }>();
  @Output() candidatureAdded: EventEmitter<any> = new EventEmitter<any>();

  formSubmitted: boolean = false;

  constructor(private activeModal: NgbActiveModal, private modalService: NgbModal, private datePipe: DatePipe, private candidatureService: CandidatureServiceService){}

  ngOnInit(): void {
    this.candidatures = [];

    const userLoggedString = sessionStorage.getItem('userLogged');
    if (userLoggedString) {
      const userLogged = JSON.parse(userLoggedString);
      this.candidate = userLogged;
    }
  }

  applyJob(){
    this.currentDateTime = this.datePipe.transform(new Date(), 'yyyy-MM-dd HH:mm:ss');

    if (this.applyForm.invalid) {
      // Mark all form fields as touched to show validation errors
      this.applyForm.control.markAllAsTouched();
      return;
    }

    const formData = new FormData();

    // formData.append('status', this.candidature.status);
    formData.append('status', 'reçu');
    formData.append('motivation', this.candidature.motivation);
    if (this.candidate.idCand) {
      formData.append('idCand', this.candidate.idCand.toString());
    }
    if (this.offer.idOffer) {
      formData.append('idOffer', this.offer.idOffer.toString());
    }
    formData.append('dateCand', this.currentDateTime || '');

    this.candidatureService.addCandidature(formData).subscribe(
      (response) => {
        this.successMessage1 = "Félicitations ! ";
        this.successMessage2 = "Votre candidature a été soumise avec succès !";
        this.successMessage3 = "Vous pouvez maintenant consulter l'état de votre candidature dans l'onglet 'Candidatures' et suivre son évolution. Nous vous remercions pour votre intérêt et vous souhaitons bonne chance !";
        this.errorMessage = '';
        this.candidatures.push(response);
        this.candidatureAdded.emit(response);
        
        this.formSubmitted = true;
     
        // Close the modal
        // this.modalService.dismissAll();
      },
      (error) => {
        console.error(error);
        this.errorMessage = 'Veuillez remplir correctement tous les champs obligatoires';
        this.successMessage1 = '';
        this.successMessage2 = '';
        this.successMessage3 = '';
        // handle error
      }
    );
  }

  public close() {
    this.activeModal.close();
  }

}
