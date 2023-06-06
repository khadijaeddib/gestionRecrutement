import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Candidate } from 'src/app/models/Candidate';
import { AuthService } from 'src/app/services/AuthService.service';

@Component({
  selector: 'app-add-candidate',
  templateUrl: './add-candidate.component.html',
  styleUrls: ['./add-candidate.component.css']
})
export class AddCandidateComponent implements OnInit {
  candidate: Candidate = new Candidate();
  candidates: Candidate[] = [];

  candImage!: File;
  lmFile!: File;
  cvFile!: File;

  phonePattern = "^((\\+91-?)|0)?[0-9]{10}$";

  // passwordMismatchError: boolean = false;
  // confirmPassTouched = false;

  errorMessage: string = '';
  successMessage: string = '';

  candImageExtensionValid = true;
  LMExtensionValid = true;
  CVExtensionValid = true;

  @ViewChild('addCandidateForm') addCandidateForm!: NgForm;
  @Output() candidateAdded: EventEmitter<any> = new EventEmitter<any>();

  // prevImageSrc: string = 'https://localhost:7217/Content/Candidate/Images/imageEmpty.png';
  // prevLMSrc: string = 'https://localhost:7217/Content/Candidate/LMs/imageEmpty.png';
  // prevCVSrc: string = 'https://localhost:7217/Content/Candidate/CVs/imageEmpty.png';

  prevImageSrc: SafeResourceUrl = this.sanitizer.bypassSecurityTrustResourceUrl('https://localhost:7217/Content/Candidate/Images/imageEmpty.png');
  prevLMSrc: SafeResourceUrl = this.sanitizer.bypassSecurityTrustResourceUrl('https://localhost:7217/Content/Candidate/LMs/imageEmpty.png');
  prevCVSrc: SafeResourceUrl = this.sanitizer.bypassSecurityTrustResourceUrl('https://localhost:7217/Content/Candidate/CVs/imageEmpty.png');


  constructor(private activeModal: NgbActiveModal,private AuthService: AuthService, private router: Router, private sanitizer: DomSanitizer) { 
  }

  ngOnInit(): void {
    this.candidates = [];
  }

  onImageSelected(event: any) {
    const file: File = event.target.files[0];
    const allowedExtensions = ['.png', '.jpg', '.jpeg'];
    const fileExtension = file.name.split('.').pop()?.toLowerCase();

    if (allowedExtensions.indexOf(`.${fileExtension}`) === -1) {
      this.candImageExtensionValid = false;
      this.addCandidateForm.controls['candImage'].setErrors({ 'invalidExtension': true });
    } else {
      this.candImageExtensionValid = true;
      this.addCandidateForm.controls['candImage'].setErrors(null);
      this.candImage = event.target.files[0];
    }

    // Update the src attribute of the prevImage element
    const reader = new FileReader();
    reader.onload = (e: any) => {
      this.prevImageSrc = this.sanitizer.bypassSecurityTrustResourceUrl(e.target.result);
    };
    reader.readAsDataURL(this.candImage);
  }

  onLMFileSelected(event: any) {
    const file: File = event.target.files[0];
    const allowedExtensions = ['.pdf'];
    const fileExtension = file.name.split('.').pop()?.toLowerCase();

    if (allowedExtensions.indexOf(`.${fileExtension}`) === -1) {
      this.LMExtensionValid = false;
      this.addCandidateForm.controls['lmFile'].setErrors({ 'invalidExtension': true });
    } else {
      this.LMExtensionValid = true;
      this.addCandidateForm.controls['lmFile'].setErrors(null);
      this.lmFile = event.target.files[0];
    }

    // Update the src attribute of the prevImage element
    const reader = new FileReader();
    reader.onload = (e: any) => {
      this.prevLMSrc = this.sanitizer.bypassSecurityTrustResourceUrl(e.target.result);
    };
    reader.readAsDataURL(this.lmFile);
  }

  onCVFileSelected(event: any) {
    const file: File = event.target.files[0];
    const allowedExtensions = ['.pdf'];
    const fileExtension = file.name.split('.').pop()?.toLowerCase();

    if (allowedExtensions.indexOf(`.${fileExtension}`) === -1) {
      this.CVExtensionValid = false;
      this.addCandidateForm.controls['cvFile'].setErrors({ 'invalidExtension': true });
    } else {
      this.CVExtensionValid = true;
      this.addCandidateForm.controls['cvFile'].setErrors(null);
      this.cvFile = event.target.files[0];
    }

    // Update the src attribute of the prevImage element
    const reader = new FileReader();
    reader.onload = (e: any) => {
      this.prevCVSrc = this.sanitizer.bypassSecurityTrustResourceUrl(e.target.result);
    };
    reader.readAsDataURL(this.cvFile);
  }

  // onConfirmPassTouched() {
  //   this.confirmPassTouched = true;
  // }

  addCandidate() {
    // this.passwordMismatchError = false;

    if (this.addCandidateForm.invalid) {
      // Mark all form fields as touched to show validation errors
      this.addCandidateForm.control.markAllAsTouched();
      return;
    }

    // if (this.candidate.pass !== this.candidate.confirmPass) {
    //   this.passwordMismatchError = true;
    //   return;
    // }

    const formData = new FormData();

    formData.append('candImage', this.candImage);
    formData.append('lName', this.candidate.lName);
    formData.append('fName', this.candidate.fName);
    formData.append('email', this.candidate.email);
    formData.append('age', this.candidate.age);
    formData.append('phone', this.candidate.phone);
    formData.append('address', this.candidate.address);
    formData.append('cin', this.candidate.cin);
    formData.append('studyDegree', this.candidate.studyDegree);
    formData.append('diploma', this.candidate.diploma);
    formData.append('spec', this.candidate.spec);
    formData.append('expYears', this.candidate.expYears);
    formData.append('lmFile', this.lmFile);
    formData.append('cvFile', this.cvFile);
    formData.append('pass', this.candidate.pass);
    formData.append('confirmPass', this.candidate.confirmPass);


    this.AuthService.signup(formData).subscribe(
      (response) => {
        this.successMessage = 'Inscription réussie ! Veuillez vous connecter avec vos identifiants';
        this.errorMessage = '';
        this.candidates.push(response);
        this.candidateAdded.emit(response);
        this.candidate = new Candidate(); // Reset the input fields
        this.prevImageSrc = 'https://localhost:7217/Content/Candidate/Images/imageEmpty.png';
        this.prevLMSrc = this.sanitizer.bypassSecurityTrustResourceUrl('https://localhost:7217/Content/Candidate/LMs/imageEmpty.png');
        this.prevCVSrc = this.sanitizer.bypassSecurityTrustResourceUrl('https://localhost:7217/Content/Candidate/CVs/imageEmpty.png');

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
