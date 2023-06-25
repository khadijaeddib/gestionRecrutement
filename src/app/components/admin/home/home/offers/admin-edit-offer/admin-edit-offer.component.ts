import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import * as moment from 'moment';
import { Offer } from 'src/app/models/Offer';
import { Recruiter } from 'src/app/models/Recruiter';
import { OfferServiceService } from 'src/app/services/offer-service.service';
import { RecruiterServiceService } from 'src/app/services/recruiter-service.service';

@Component({
  selector: 'app-admin-edit-offer',
  templateUrl: './admin-edit-offer.component.html',
  styleUrls: ['./admin-edit-offer.component.css']
})
export class AdminEditOfferComponent implements OnInit{
  @Input() offer!: Offer;
  @Output() offerUpdated: EventEmitter<Offer> = new EventEmitter<Offer>();
  @ViewChild('editOfferForm') editOfferForm!: NgForm;

  modifiedOffer: Offer = new Offer();
  offers: Offer[] = [];

  successMessage: string = '';
  errorMessage: string = '';

  recruiters: Recruiter[] = [];
  // @Input() selectedRecruiterId: number | null = null;

  languageOptions = [
    { name: 'Arabe', value: 'Arabe' },
    { name: 'Français', value: 'Français' },
    { name: 'Anglais', value: 'Anglais' },
    { name: 'Espagnol', value: 'Espagnol' },
    { name: 'Allemand', value: 'Allemand' }
  ];
  @Input() selectedLanguages: string[]  = [];
  placeholderText = 'Sélectionnez language(s) *';

  formattedEndDate: string = '';

  skills: string[] = []; // Skills array from the offer
  newSkill: string = ''; // New skill input
  skillsErrorMessage: string = '';
  editingSkillIndex: number | null = null;

  missions: string[] = []; // Skills array from the offer
  newMission: string = ''; // New skill input
  missionsErrorMessage: string = '';
  editingMissionIndex: number | null = null;

  constructor(private activeModal: NgbActiveModal, private offerService: OfferServiceService, private recruiterService: RecruiterServiceService) { }

  ngOnInit(): void {
    this.offers = [];

    // this.selectedRecruiterId = this.offer.idRec;

    this.selectedLanguages = this.offer.languages;
    this.placeholderText = '';
    
    this.getRecruiters();

    this.formattedEndDate = moment(this.offer.endDate).format('YYYY-MM-DDTHH:mm');
    this.offer.endDate = moment(this.formattedEndDate).toDate();

    this.skills = this.offer.skills.slice();
    this.missions = this.offer.missions.slice();
  }

  onSelectedOptionsChange(selectedOptions: any[]) {
    if (selectedOptions.length > 0) {
      this.placeholderText = '';
    } else {
      this.placeholderText = 'Sélectionnez language(s) *';
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

  editSkill(index: number) {
    this.editingSkillIndex = index;
    this.newSkill = this.skills[index];
  }

  saveSkill() {
    if (this.newSkill.trim() === '') {
      return;
    }
    this.skills[this.editingSkillIndex!] = this.newSkill.trim();
    this.newSkill = '';
    this.editingSkillIndex = null;
  }

  cancelEditSkill() {
    this.newSkill = '';
    this.editingSkillIndex = null;
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

  editMission(index: number) {
    this.editingMissionIndex = index;
    this.newMission = this.missions[index];
  }

  saveMission() {
    if (this.newMission.trim() === '') {
      return;
    }
    this.missions[this.editingMissionIndex!] = this.newMission.trim();
    this.newMission = '';
    this.editingMissionIndex = null;
  }

  cancelEditMission() {
    this.newMission = '';
    this.editingMissionIndex = null;
  }
  
  removeMission(index: number) {
    this.missions.splice(index, 1);
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

  editOffer(id:number): void {
    // if (this.offer.skills === '' || this.offer.missions === '' || this.offer.title === '' || this.offer.studyDegree === '' || this.offer.diploma === '' || this.offer.expYears === '' || this.offer.contractType === '' || this.offer.availability === '' || this.offer.hiredNum === '' || this.offer.salary === '' || this.offer.description === '' || this.offer.languages === '' || this.offer.endDate === '') {
    //   this.errorMessage = 'Veuillez remplir correctement tous les champs obligatoires';
    //   return;
    // }

    if (this.editOfferForm.invalid) {
      this.errorMessage = 'Veuillez remplir correctement tous les champs obligatoires';
      return;
    }

    const formData = new FormData();
    // Append the updated company information to the FormData object
    this.skills.forEach(skill => {
      formData.append('skills', skill);
    });
    this.missions.forEach(mission => {
      formData.append('missions', mission);
    });
    formData.append('title', this.offer.title);
    formData.append('studyDegree', this.offer.studyDegree);
    formData.append('diploma', this.offer.diploma);
    formData.append('expYears', this.offer.expYears);
    formData.append('contractType', this.offer.contractType);
    formData.append('city', this.offer.city);
    formData.append('availability', this.offer.availability);
    formData.append('hiredNum', this.offer.hiredNum.toString());
    formData.append('salary', this.offer.salary.toString());
    formData.append('description', this.offer.description);
    // if (this.selectedRecruiterId !== null) {
    //   formData.append('idRec', this.selectedRecruiterId.toString());
    // }
    this.selectedLanguages.forEach((selectedLanguage, index) => {
      formData.append('languages', selectedLanguage);
      if (index < this.selectedLanguages.length - 1) {
        formData.append('languages ', '  '); // Add a space after each language except the last one
      }
    });
    formData.append('pubDate', this.offer.pubDate.toString());
    formData.append('endDate', this.formattedEndDate);

    // Call the updateCompany service method with the company ID and FormData object
    this.offerService.editOffer(id, formData).subscribe(
      (response) => {
        this.successMessage = "Informations de l'offre ont été mises à jour avec succès";
        this.errorMessage = ''; // Clear the error message
        this.offers.push(response);
        this.offerUpdated.emit(response);

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
