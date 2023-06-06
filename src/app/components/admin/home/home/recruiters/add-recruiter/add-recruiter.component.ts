import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Company } from 'src/app/models/Company';
import { Recruiter } from 'src/app/models/Recruiter';
import { AuthService } from 'src/app/services/AuthService.service';
import { CompanyServiceService } from 'src/app/services/CompanyService.service';


@Component({
  selector: 'app-add-recruiter',
  templateUrl: './add-recruiter.component.html',
  styleUrls: ['./add-recruiter.component.css']
})
export class AddRecruiterComponent implements OnInit {
  recruiter: Recruiter = new Recruiter();
  recruiters: Recruiter[] = [];

  recImage!: File;

  phonePattern = "^((\\+91-?)|0)?[0-9]{10}$";

  errorMessage: string = '';
  successMessage: string = '';

  recImageExtensionValid = true;

  @ViewChild('addRecruiterForm') addRecruiterForm!: NgForm;
  @Output() recruiterAdded: EventEmitter<any> = new EventEmitter<any>();

  prevImageSrc: SafeResourceUrl = this.sanitizer.bypassSecurityTrustResourceUrl('https://localhost:7217/Content/Recruiter/imageEmpty.png');

  companies: Company[] = [];
  selectedCompanyId: number | null = null;

  constructor(private activeModal: NgbActiveModal, private AuthService: AuthService, private router: Router, private sanitizer: DomSanitizer, private modalService: NgbModal, private companyService: CompanyServiceService) {
  }

  ngOnInit(): void {
    this.recruiters = [];
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
    const allowedExtensions = ['.png', '.jpg', '.jpeg'];
    const fileExtension = file.name.split('.').pop()?.toLowerCase();

    if (allowedExtensions.indexOf(`.${fileExtension}`) === -1) {
      this.recImageExtensionValid = false;
      this.addRecruiterForm.controls['recImage'].setErrors({ 'invalidExtension': true });
    } else {
      this.recImageExtensionValid = true;
      this.addRecruiterForm.controls['recImage'].setErrors(null);
      this.recImage = event.target.files[0];
    }

    // Update the src attribute of the prevImage element
    const reader = new FileReader();
    reader.onload = (e: any) => {
      this.prevImageSrc = this.sanitizer.bypassSecurityTrustResourceUrl(e.target.result);
    };
    reader.readAsDataURL(this.recImage);
  }

  addRecruiter() {
    if (this.addRecruiterForm.invalid) {
      // Mark all form fields as touched to show validation errors
      this.addRecruiterForm.control.markAllAsTouched();
      return;
    }

    const formData = new FormData();

    formData.append('recImage', this.recImage);
    formData.append('lName', this.recruiter.lName);
    formData.append('fName', this.recruiter.fName);
    formData.append('email', this.recruiter.email);
    formData.append('age', this.recruiter.age);
    formData.append('phone', this.recruiter.phone);
    formData.append('address', this.recruiter.address);
    formData.append('career', this.recruiter.career);
    formData.append('pass', this.recruiter.pass);
    // formData.append('idCo', this.selectedCompanyId);
    if (this.selectedCompanyId !== null) {
      formData.append('idCo', this.selectedCompanyId.toString());
    }


    this.AuthService.addRecruiter(formData).subscribe(
      (response) => {
        // this.successMessage = 'Recruteur ajouté';
        // this.errorMessage = '';
        this.recruiters.push(response);
        this.recruiterAdded.emit(response);
        // this.recruiter = new Recruiter(); // Reset the input fields
        this.prevImageSrc = 'https://localhost:7217/Content/Recruiter/imageEmpty.png';

        // Close the modal
        this.modalService.dismissAll();

        // this.close();

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
