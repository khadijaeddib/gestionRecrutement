import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { AbstractControl, FormControl, NgForm } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Company } from 'src/app/models/Company';
import { CompanyServiceService } from 'src/app/services/CompanyService.service';

@Component({
  selector: 'app-edit-company',
  templateUrl: './edit-company.component.html',
  styleUrls: ['./edit-company.component.css']
})
export class EditCompanyComponent implements OnInit{
  @Input() company!: Company;
  @Output() companyUpdated: EventEmitter<Company> = new EventEmitter<Company>();
  @ViewChild('editCompanyForm') editCompanyForm!: NgForm;

  modifiedCompany: Company = new Company();
  companies: Company[] = [];

  successMessage: string = '';
  errorMessage: string = '';
  prevImageSrc!: string;
  phonePattern = "^((\\+91-?)|0)?[0-9]{10}$";

  logoImageExtensionValid = true;
  logoImageFile!: File;

  constructor(private activeModal: NgbActiveModal, private companyService: CompanyServiceService) { }

  ngOnInit(): void {
    this.companies = [];
    this.prevImageSrc = `https://localhost:7217/Content/Company/${this.company.logoPath}`;
  }

  onFileSelected(event: any) {
    const file: File = event.target.files[0];
    const allowedExtensions = ['.png'];
    const fileExtension = file.name.split('.').pop()?.toLowerCase();
  
    if (allowedExtensions.indexOf(`.${fileExtension}`) === -1) {
      this.logoImageExtensionValid = false;
      this.editCompanyForm.controls['logoImage'].setErrors({ 'invalidExtension': true });
    } else {
      this.logoImageExtensionValid = true;
      if (this.editCompanyForm?.controls['logoImage']) {
        this.editCompanyForm.controls['logoImage'].setErrors(null);
      }
      this.logoImageFile = event.target.files[0];
    }
    // Update the src attribute of the prevImage element
    const reader = new FileReader();
    reader.onload = (e: any) => {
      this.prevImageSrc = e.target.result;
    };
    reader.readAsDataURL(this.logoImageFile);
  }
  
  
  editCompany(id:number): void {
    if (this.company.name === '' || this.company.website === '' || this.company.businessSector === '' || this.company.description === '' || this.company.phone === '' || this.company.email === '' || this.company.rc === '' || this.company.idF === '' || this.company.ice === '' || this.company.legalStatus === '' || this.company.address === '' ) {
      this.errorMessage = 'Veuillez remplir correctement tous les champs obligatoires';
      return;
    }

    const formData = new FormData();
    // Append the updated company information to the FormData object
    formData.append('name', this.company.name);
    formData.append('website', this.company.website);
    formData.append('businessSector', this.company.businessSector);
    formData.append('description', this.company.description);
    formData.append('phone', this.company.phone);
    formData.append('email', this.company.email);
    formData.append('address', this.company.address);
    formData.append('logoImage', this.logoImageFile);
    formData.append('rc', this.company.rc);
    formData.append('idF', this.company.idF);
    formData.append('ice', this.company.ice);
    formData.append('legalStatus', this.company.legalStatus);
  
    // Call the updateCompany service method with the company ID and FormData object
    this.companyService.editCompany(id, formData).subscribe(
      (response) => {
        this.successMessage = "Informations de l'entreprise ont été mises à jour avec succès";
        this.errorMessage = ''; // Clear the error message
        this.companies.push(response);
        this.companyUpdated.emit(response);
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
