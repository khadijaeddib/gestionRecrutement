import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { AbstractControl, FormArray, FormControl, FormGroup, NgForm } from '@angular/forms';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Candidate } from 'src/app/models/Candidate';
import { CandidateServiceService } from 'src/app/services/candidate-service.service';

@Component({
  selector: 'app-edit-candidate',
  templateUrl: './edit-candidate.component.html',
  styleUrls: ['./edit-candidate.component.css']
})
export class EditCandidateComponent implements OnInit {
  @Input() candidate!: Candidate;
  @Output() candidateUpdated: EventEmitter<Candidate> = new EventEmitter<Candidate>();
  @ViewChild('editCandidateForm') editCandidateForm!: NgForm;

  modifiedCandidate: Candidate = new Candidate();
  candidates: Candidate[] = [];

  successMessage: string = '';
  errorMessage: string = '';
  phonePattern = "^((\\+91-?)|0)?[0-9]{10}$";

  prevImageSrc!: string;
  prevLMSrc!: SafeResourceUrl;
  prevCVSrc!: SafeResourceUrl;


  candImage!: File;
  lmFile!: File;
  cvFile!: File;

  candImageExtensionValid = true;
  LMExtensionValid = true;
  CVExtensionValid = true;

  constructor(private activeModal: NgbActiveModal, private candidateService: CandidateServiceService,private sanitizer: DomSanitizer) { }

  ngOnInit(): void {
    this.candidates = [];
    this.prevImageSrc = `https://localhost:7217/Content/Candidate/Images/${this.candidate.candImagePath}`;
    this.prevLMSrc = this.sanitizer.bypassSecurityTrustResourceUrl(
      `https://localhost:7217/Content/Candidate/LMs/${this.candidate.lmPath}`
    );
    this.prevCVSrc = this.sanitizer.bypassSecurityTrustResourceUrl(
      `https://localhost:7217/Content/Candidate/CVs/${this.candidate.cvPath}`
    );
  }

  onImageSelected(event: any) {
    const file: File = event.target.files[0];
    const allowedExtensions = ['.png', '.jpg', '.jpeg'];
    const fileExtension = file.name.split('.').pop()?.toLowerCase();

    if (allowedExtensions.indexOf(`.${fileExtension}`) === -1) {
      this.candImageExtensionValid = false;
      this.editCandidateForm.controls['candImage'].setErrors({ 'invalidExtension': true });
    } else {
      this.candImageExtensionValid = true;
      if (this.editCandidateForm?.controls['candImage']) {
        this.editCandidateForm.controls['candImage'].setErrors(null);
      }
      this.candImage = event.target.files[0];
    }
    // Update the src attribute of the prevImage element
    const imageReader = new FileReader();
    imageReader.onload = (e: any) => {
      this.prevImageSrc = e.target.result;
    };
    imageReader.readAsDataURL(this.candImage);
  }

  onLMFileSelected(event: any) {
    const file: File = event.target.files[0];
    const allowedExtensions = ['.pdf'];
    const fileExtension = file.name.split('.').pop()?.toLowerCase();

    if (allowedExtensions.indexOf(`.${fileExtension}`) === -1) {
      this.LMExtensionValid = false;
      this.editCandidateForm.controls['lmFile'].setErrors({ 'invalidExtension': true });
    } else {
      this.LMExtensionValid = true;
      if (this.editCandidateForm?.controls['lmFile']) {
        this.editCandidateForm.controls['lmFile'].setErrors(null);
      }
      this.lmFile = event.target.files[0];
    }
    // Update the src attribute of the prevImage element
    const lmReader = new FileReader();
    lmReader.onload = (e: any) => {
      this.prevLMSrc = this.sanitizer.bypassSecurityTrustResourceUrl(e.target.result);
    };
    lmReader.readAsDataURL(this.lmFile);
  }

  onCVFileSelected(event: any) {
    const file: File = event.target.files[0];
    const allowedExtensions = ['.pdf'];
    const fileExtension = file.name.split('.').pop()?.toLowerCase();

    if (allowedExtensions.indexOf(`.${fileExtension}`) === -1) {
      this.CVExtensionValid = false;
      this.editCandidateForm.controls['cvFile'].setErrors({ 'invalidExtension': true });
    } else {
      this.CVExtensionValid = true;
      if (this.editCandidateForm?.controls['cvFile']) {
        this.editCandidateForm.controls['cvFile'].setErrors(null);
      }
      this.cvFile = event.target.files[0];
    }
    // Update the src attribute of the prevImage element
    const cvReader = new FileReader();
    cvReader.onload = (e: any) => {
      this.prevCVSrc = this.sanitizer.bypassSecurityTrustResourceUrl(e.target.result);
    };
    cvReader.readAsDataURL(this.cvFile);
  }

  markEmptyTextInputsAsTouched(form: NgForm): void {
    Object.keys(form.controls).forEach((key: string) => {
      const control = form.controls[key];
      
      if (control instanceof FormControl && control.value === '' && control.validator && control.validator({} as AbstractControl)?.['required']) {
        control.markAsTouched();
      }
    });
  }
  
  editCandidate(id:number): void {
    if (this.candidate.fName === '' || this.candidate.lName === '' || this.candidate.email === '' || this.candidate.age === '' || this.candidate.phone === '' || this.candidate.cin === '' || this.candidate.address === '' ) {
      this.markEmptyTextInputsAsTouched(this.editCandidateForm);
      this.errorMessage = 'Veuillez remplir correctement tous les champs obligatoires';
      return;
    }

    const formData = new FormData();
    // Append the updated company information to the FormData object
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
    // formData.append('pass', this.candidate.pass);
    // formData.append('confirmPass', this.candidate.confirmPass);

  
    // Call the updateCompany service method with the company ID and FormData object
    this.candidateService.editCandidate(id, formData).subscribe(
      (response) => {
        this.successMessage = 'Les informations ont été mises à jour avec succès';
        this.errorMessage = ''; // Clear the error message
        this.candidates.push(response);
        this.candidateUpdated.emit(response);
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
