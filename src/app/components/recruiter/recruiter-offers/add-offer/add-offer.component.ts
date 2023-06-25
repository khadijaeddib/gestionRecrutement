import { DatePipe } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Offer } from 'src/app/models/Offer';
import { Recruiter } from 'src/app/models/Recruiter';
import { OfferServiceService } from 'src/app/services/offer-service.service';
import { RecruiterServiceService } from 'src/app/services/recruiter-service.service';

@Component({
  selector: 'app-add-offer',
  templateUrl: './add-offer.component.html',
  styleUrls: ['./add-offer.component.css']
})
export class AddOfferComponent implements OnInit {
  offer: Offer = new Offer();
  offers: Offer[] = [];

  newSkill: string = ''; // Variable to hold the new skill input
  skills: string[] = [];

  newMission: string = ''; // Variable to hold the new skill input
  missions: string[] = [];

  currentDate: string | null = new Date().toISOString();

  languageOptions = [
    { name: 'Arabe', value: 'Arabe' },
    { name: 'Français', value: 'Français' },
    { name: 'Anglais', value: 'Anglais' },
    { name: 'Espagnol', value: 'Espagnol' },
    { name: 'Allemand', value: 'Allemand' }
  ];
  selectedLanguages: string[] = [];
  placeholderText = 'Sélectionnez language(s) *';

  errorMessage: string = '';
  successMessage: string = '';
  skillsErrorMessage: string = '';
  missionsErrorMessage: string = '';

  @ViewChild('addOfferForm') addOfferForm!: NgForm;
  @Output() offerAdded: EventEmitter<any> = new EventEmitter<any>();

  recruiters: Recruiter[] = [];
  // selectedRecruiterId: number | null = null;

  @Input() recruiter: any;

  constructor(private activeModal: NgbActiveModal, private router: Router, private modalService: NgbModal, private offerService: OfferServiceService, private recruiterService: RecruiterServiceService, private datePipe: DatePipe) {
  }

  ngOnInit(): void {
    this.offers = [];
    this.getRecruiters();

    const userLoggedString = sessionStorage.getItem('userLogged');
    if (userLoggedString) {
      const userLogged = JSON.parse(userLoggedString);
      this.recruiter = userLogged;
    }

  }

  addSkill() {
    if (this.newSkill.trim() === '') {
      return;
    }
    this.skills.push(this.newSkill.trim());
    this.newSkill = ''; // Clear the newSkill input
    this.skillsErrorMessage = '';
  }

  removeSkill(index: number) {
    this.skills.splice(index, 1);
  }

  addMission() {
    if (this.newMission.trim() === '') {
      return;
    }
    this.missions.push(this.newMission.trim());
    this.newMission = ''; // Clear the newSkill input
    this.missionsErrorMessage = '';
  }

  removeMission(index: number) {
    this.missions.splice(index, 1);
  }

  onSelectedOptionsChange(selectedOptions: any[]) {
    if (selectedOptions.length > 0) {
      this.placeholderText = '';
    } else {
      this.placeholderText = 'Sélectionnez language(s) *';
    }
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

  addOffer() {
    this.currentDate = this.datePipe.transform(new Date(), 'yyyy-MM-dd HH:mm:ss');

    if (this.addOfferForm.invalid) {
      // Mark all form fields as touched to show validation errors
      this.addOfferForm.control.markAllAsTouched();
      return;
    }
    if (this.skills.length === 0){
      this.skillsErrorMessage = "* Compétences est nécessaire";
    }else if (this.missions.length === 0){
      this.missionsErrorMessage = "* Missions est nécessaire";
    }else {

    const formData = new FormData();

    formData.append('title', this.offer.title);
    formData.append('diploma', this.offer.diploma);
    formData.append('studyDegree', this.offer.studyDegree);
    formData.append('businessSector', this.offer.businessSector);
    formData.append('expYears', this.offer.expYears);
    formData.append('contractType', this.offer.contractType);
    formData.append('city', this.offer.city);
    formData.append('availability', this.offer.availability);
    formData.append('hiredNum', this.offer.hiredNum.toString());
    formData.append('salary', this.offer.salary.toString());
    formData.append('description', this.offer.description);
    this.missions.forEach(mission => {
      formData.append('missions', mission);
    });
    this.skills.forEach(skill => {
      formData.append('skills', skill);
    });
    // let languagesString = this.selectedLanguages.join(' ');
    // formData.append('languages', languagesString);

    this.selectedLanguages.forEach((selectedLanguage, index) => {
      formData.append('languages', selectedLanguage);
      if (index < this.selectedLanguages.length - 1) {
        formData.append('languages ', '  '); // Add a space after each language except the last one
      }
    });
    formData.append('pubDate', this.currentDate || '');
    formData.append('endDate', this.offer.endDate.toString());
    formData.append('idRec', this.recruiter.idRec.toString());
    // if (this.selectedRecruiterId !== null) {
    //   formData.append('idRec', this.selectedRecruiterId.toString());
    // }

    this.offerService.addOffer(formData).subscribe(
      (response) => {
        // this.successMessage = 'Offre ajoutée';
        // this.errorMessage = '';
        this.offers.push(response);
        this.offerAdded.emit(response);
        // this.offer = new Offer(); // Reset the input fields
        // Close the modal
        this.modalService.dismissAll();
      },
      (error) => {
        console.error(error);
        this.errorMessage = 'Veuillez remplir correctement tous les champs obligatoires';
        this.successMessage = '';
        // handle error
      }
    );
    }
  }

  public close() {
    this.activeModal.close();
  }
}
