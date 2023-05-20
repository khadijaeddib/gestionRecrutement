import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
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
  modifiedCompany: Company = new Company();
  successMessage: string = '';
  errorMessage: string = '';


  
  logoImageExtensionValid = true;
  logoImageFile!: File;
  @ViewChild('editCompanyForm') editCompanyForm!: NgForm;
  phonePattern = "^((\\+91-?)|0)?[0-9]{10}$";
  prevImageSrc!: string;
  companies: Company[] = [];

  editClicked = false;


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
      if (this.editCompanyForm?.controls['logoImage']) {
        this.editCompanyForm.controls['logoImage'].setErrors({ 'invalidExtension': true });
      }
    } else {
      this.logoImageExtensionValid = true;
      if (this.editCompanyForm?.controls['logoImage']) {
        this.editCompanyForm.controls['logoImage'].setErrors(null);
      }
      this.logoImageFile = event.target.files[0];
    }
  
    // Rest of the code...
    // Update the src attribute of the prevImage element
    const reader = new FileReader();
    reader.onload = (e: any) => {
      this.prevImageSrc = e.target.result;
    };
    reader.readAsDataURL(this.logoImageFile);
  }

  // onFileSelected(event: any) {
  //   const file: File = event.target.files[0];
  //   const allowedExtensions = ['.png'];
  //   const fileExtension = file.name.split('.').pop()?.toLowerCase();

  //   if (allowedExtensions.indexOf(`.${fileExtension}`) === -1) {
  //     this.logoImageExtensionValid = false;
  //     this.editCompanyForm.controls['logoImage'].setErrors({ 'invalidExtension': true });
  //   } else {
  //     this.logoImageExtensionValid = true;
  //     this.editCompanyForm.controls['logoImage'].setErrors(null);
  //     this.logoImageFile = event.target.files[0];
  //   }
    
  //   // Update the src attribute of the prevImage element
  //   const reader = new FileReader();
  //   reader.onload = (e: any) => {
  //     this.prevImageSrc = e.target.result;
  //   };
  //   reader.readAsDataURL(this.logoImageFile);
  // }

  // public createImgPath = (serverPath: string) => { 
  //   return `https://localhost:7217/Content/Company/${serverPath}`; 
  // }

  // editCompany() {
  //   // Emit the modified company data
  //   this.companyUpdated.emit(this.modifiedCompany);
  //   this.activeModal.close();
  // }
  
  editCompany(id:number): void {
    //  if (this.editCompanyForm.invalid) {
    // //   // Mark all form fields as touched to show validation errors
    // //   this.editCompanyForm.control.markAllAsTouched();
    //   this.errorMessage = 'Please fill in all the required fields correctly.';
    
    //   return;
    // }
    // if (this.editCompanyForm.invalid) {
    //   this.editClicked = true; // Set the editClicked flag to true
    //   this.errorMessage = 'Please fill in all the required fields correctly.';
    //   return;
    // }

    

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
  
    // Call the updateCompany service method with the company ID and FormData object
    this.companyService.editCompany(id, formData).subscribe(
      (response) => {
        this.successMessage = 'Company information updated successfully';
         this.companies.push(response);
        this.companyUpdated.emit(response);
        // Close the modal or perform any other necessary actions
        // this.activeModal.close();
        // this.companyService.getCompanies();
        // this.companyService.getCompanies().subscribe(
        //   (data) => {
        //     this.companies = data;
        //     // Close the modal or perform any other necessary actions
        //     //this.activeModal.close();
        //   },
        //   (error) => {
        //     console.log(error);
        //     // Handle the error if needed
        //   }
        //);
      },
      (error) => {
        console.error(error);
          this.errorMessage = 'Veuillez remplir correctement tous les champs obligatoires';
        // Handle the error if needed
      }
    );

  }
  
 
  // editCompany(id: number,company:Company): void {
  //   // Call your company service or API to update the company
  //   this.companyService.updateCompany(id,company).subscribe(
  //     () => {
  //       this.successMessage = 'Company information updated successfully';
  //       // Close the modal or perform any other necessary actions
  //       this.activeModal.close();
  //     },
  //     (error) => {
  //       console.error(error);
  //       // Handle the error if needed
  //     }
  //   );
  // }

  public close() {
    this.activeModal.close();
  }
}
