import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, NgForm, Validators } from '@angular/forms';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Company } from 'src/app/models/Company';
import { CompanyServiceService } from 'src/app/services/CompanyService.service';

@Component({
  selector: 'app-add-company',
  templateUrl: './add-company.component.html',
  styleUrls: ['./add-company.component.css']
})

export class AddCompanyComponent implements OnInit{
  company: Company = new Company();
  logoImageFile!: File;
  successMessage: string = '';
  errorMessage: string = '';
  phonePattern = "^((\\+91-?)|0)?[0-9]{10}$";
  logoImageExtensionValid = true;
  @ViewChild('addCompanyForm') addCompanyForm!: NgForm;
  companies: Company[] = [];
  @Output() companyAdded: EventEmitter<any> = new EventEmitter<any>();
  prevImageSrc: string = 'https://localhost:7217/Content/Company/imageEmpty.png';

  constructor(private activeModal: NgbActiveModal, private companyService: CompanyServiceService, private modalService: NgbModal) { }

  ngOnInit(): void {
    this.companies = [];
  }

  onFileSelected(event: any) {
    const file: File = event.target.files[0];
    const allowedExtensions = ['.png', '.jpg', '.jpeg'];
    const fileExtension = file.name.split('.').pop()?.toLowerCase();

    if (allowedExtensions.indexOf(`.${fileExtension}`) === -1) {
      this.logoImageExtensionValid = false;
      this.addCompanyForm.controls['logoImage'].setErrors({ 'invalidExtension': true });
    } else {
      this.logoImageExtensionValid = true;
      this.addCompanyForm.controls['logoImage'].setErrors(null);
      this.logoImageFile = event.target.files[0];
    }
    
    // Update the src attribute of the prevImage element
    const reader = new FileReader();
    reader.onload = (e: any) => {
      this.prevImageSrc = e.target.result;
    };
    reader.readAsDataURL(this.logoImageFile);
  }

  addCompany() {
    if (this.addCompanyForm.invalid) {
      // Mark all form fields as touched to show validation errors
      this.addCompanyForm.control.markAllAsTouched();
      return;
    }

    const formData = new FormData();

    formData.append('logoImage', this.logoImageFile);
    formData.append('name', this.company.name);
    formData.append('website', this.company.website);
    formData.append('businessSector', this.company.businessSector);
    formData.append('description', this.company.description);
    formData.append('phone', this.company.phone);
    formData.append('email', this.company.email);
    formData.append('address', this.company.address);
    formData.append('rc', this.company.rc);
    formData.append('idF', this.company.idF);
    formData.append('ice', this.company.ice);
    formData.append('legalStatus', this.company.legalStatus);

    this.companyService.addCompany(formData).subscribe(
      (response) => {
        // this.successMessage = 'Entreprise ajoutée avec succès';
        // this.errorMessage = '';
        this.companies.push(response);
        this.companyAdded.emit(response);
        // this.company = new Company(); // Reset the input fields
        this.prevImageSrc = 'https://localhost:7217/Content/Company/imageEmpty.png';
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

  public close() {
    this.activeModal.close();
  }
  
}