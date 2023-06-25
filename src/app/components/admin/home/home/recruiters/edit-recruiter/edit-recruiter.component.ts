import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Company } from 'src/app/models/Company';
import { Recruiter } from 'src/app/models/Recruiter';
import { CompanyServiceService } from 'src/app/services/CompanyService.service';
import { RecruiterServiceService } from 'src/app/services/recruiter-service.service';

@Component({
  selector: 'app-edit-recruiter',
  templateUrl: './edit-recruiter.component.html',
  styleUrls: ['./edit-recruiter.component.css']
})
export class EditRecruiterComponent implements OnInit{
  @Input() recruiter!: Recruiter;
  @Output() recruiterUpdated: EventEmitter<Recruiter> = new EventEmitter<Recruiter>();
  @ViewChild('editRecruiterForm') editRecruiterForm!: NgForm;

  modifiedRecruiter: Recruiter = new Recruiter();
  recruiters: Recruiter[] = [];

  successMessage: string = '';
  errorMessage: string = '';
  prevImageSrc!: string;
  phonePattern = "^((\\+91-?)|0)?[0-9]{10}$";

  recImageExtensionValid = true;
  recImageFile!: File;

  companies: Company[] = [];
  @Input() selectedCompanyId: number | null = null;

  constructor(private activeModal: NgbActiveModal, private recruiterService: RecruiterServiceService, private companyService: CompanyServiceService) { }

  ngOnInit(): void {
    this.recruiters = [];
    this.prevImageSrc = `https://localhost:7217/Content/Recruiter/${this.recruiter.recImagePath}`;
    this.selectedCompanyId = this.recruiter.idCo;
    this.getCompanies();
  }

  getCompanies(): void {
    this.companyService.getCompanies().subscribe(
      (companies) => {
        this.companies = companies;
      },
      (error) => {
        console.error(error);
      }
    );
  }

  onImageSelected(event: any) {
    const file: File = event.target.files[0];
    const allowedExtensions = ['.png','.jpg','.jpeg'];
    const fileExtension = file.name.split('.').pop()?.toLowerCase();
  
    if (allowedExtensions.indexOf(`.${fileExtension}`) === -1) {
      this.recImageExtensionValid = false;
      this.editRecruiterForm.controls['recImage'].setErrors({ 'invalidExtension': true });
    } else {
      this.recImageExtensionValid = true;
      if (this.editRecruiterForm?.controls['recImage']) {
        this.editRecruiterForm.controls['recImage'].setErrors(null);
      }
      this.recImageFile = event.target.files[0];
    }
    // Update the src attribute of the prevImage element
    const reader = new FileReader();
    reader.onload = (e: any) => {
      this.prevImageSrc = e.target.result;
    };
    reader.readAsDataURL(this.recImageFile);
  }

  editRecruiter(id:number): void {
    if (this.recruiter.lName === '' || this.recruiter.fName === '' || this.recruiter.email === '' || this.recruiter.age === '' || this.recruiter.phone === '' || this.recruiter.address === '' || this.recruiter.career === '' ) {
      this.errorMessage = 'Veuillez remplir correctement tous les champs obligatoires';
      return;
    }

    const formData = new FormData();

    formData.append('recImage', this.recImageFile);
    formData.append('lName', this.recruiter.lName);
    formData.append('fName', this.recruiter.fName);
    formData.append('email', this.recruiter.email);
    formData.append('age', this.recruiter.age);
    formData.append('phone', this.recruiter.phone);
    formData.append('address', this.recruiter.address);
    formData.append('career', this.recruiter.career);
    // formData.append('pass', this.recruiter.pass);
    // formData.append('idCo', this.selectedCompanyId);
    if (this.selectedCompanyId !== null) {
      formData.append('idCo', this.selectedCompanyId.toString());
    }

    this.recruiterService.editRecruiter(id,formData).subscribe(
      (response) => {
        this.successMessage =  "Informations du recruteur ont été mises à jour avec succès";
        this.errorMessage = '';
        this.recruiters.push(response);
        this.recruiterUpdated.emit(response);
        // this.recruiter = new Recruiter(); // Reset the input fields
        // this.prevImageSrc = 'https://localhost:7217/Content/Recruiter/imageEmpty.png';
        // Close the modal
        // this.modalService.dismissAll();
      },
      (error) => {
        console.error(error);
        this.errorMessage = 'Veuillez remplir correctement tous les champs obligatoires';
        this.successMessage = '';
        // handle error
      }
    );
  }

  public close() {
    this.activeModal.close();
  }

}
