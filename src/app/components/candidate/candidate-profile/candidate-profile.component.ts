import { ChangeDetectorRef, Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { AbstractControl, FormControl, NgForm } from '@angular/forms';
import { DomSanitizer, SafeResourceUrl, SafeUrl } from '@angular/platform-browser';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { BehaviorSubject } from 'rxjs';
import { Candidate } from 'src/app/models/Candidate';
import { CandidateServiceService } from 'src/app/services/candidate-service.service';
import { UpdateCandidateServiceService } from 'src/app/services/update-candidate-service.service';

interface EditModeEnabled {
  [key: string]: boolean;
}

@Component({
  selector: 'app-candidate-profile',
  templateUrl: './candidate-profile.component.html',
  styleUrls: ['./candidate-profile.component.css']
})

export class CandidateProfileComponent {
  @Input() candidate: any;
  @Output() profileUpdated: EventEmitter<any> = new EventEmitter<any>();
  @Output() candidateUpdated: EventEmitter<Candidate> = new EventEmitter<Candidate>();
  @ViewChild('editCandidateForm') editCandidateForm!: NgForm;

  @Output() emailUpdated: EventEmitter<string> = new EventEmitter<string>();

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

  userEmail: string = ''; // Change the type to 'string' instead of 'string | null'

  private candidateSubject = new BehaviorSubject<any>(null);
  candidate$ = this.candidateSubject.asObservable();

  constructor(
    private activeModal: NgbActiveModal,
    private candidateService: CandidateServiceService,
    private sanitizer: DomSanitizer,
    private cdr: ChangeDetectorRef,
    private updateCandidateService: UpdateCandidateServiceService
  ) {}

  ngOnInit(): void {
    // Check if the candidate data is already present in the component
    if (!this.candidate) {
      const userLoggedString = sessionStorage.getItem('userLogged');
      if (userLoggedString) {
        const userLogged = JSON.parse(userLoggedString);
        if (userLogged && userLogged.idCand) {
          this.candidate = userLogged;
          this.userEmail = userLogged.email;
        } else {
          console.error('Invalid userLogged object or idCand is missing.');
        }
      } else {
        console.error('userLogged is not available in sessionStorage.');
      }
    }

    this.updateCandidateService.candidate$.subscribe(candidate => {
      // Update the displayed information with the new candidate data
      this.candidate = candidate;
      this.fetchCandidateData(); // Fetch the candidate data again
    });

    // Fetch candidate data if necessary
    if (!this.candidate.idCand) {
      // Fetch candidate data by passing the candidate ID
      this.fetchCandidateData();
    }
  }

  fetchCandidateData(): void {
    this.candidateService.getCandidate(this.candidate.idCand).subscribe(
      (data) => {
        // Check if the candidate object is already populated
        if (!this.candidate) {
          this.candidate = data;
        } else {
          // Update the candidate object with the fetched data
          this.candidate = Object.assign({}, this.candidate, data);
        }
        this.prevImageSrc = `https://localhost:7217/Content/Candidate/Images/${this.candidate.candImagePath}`;
        this.prevLMSrc = this.sanitizer.bypassSecurityTrustResourceUrl(`https://localhost:7217/Content/Candidate/LMs/${this.candidate.lmPath}`);
        this.prevCVSrc = this.sanitizer.bypassSecurityTrustResourceUrl(`https://localhost:7217/Content/Candidate/CVs/${this.candidate.cvPath}`);
      },
      (error) => {
        console.error('Error fetching candidate data:', error);
      }
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
  
  editCandidate(id: number): void {
    if (
      this.candidate.fName === '' ||
      this.candidate.lName === '' ||
      this.candidate.email === '' ||
      this.candidate.age === '' ||
      this.candidate.phone === '' ||
      this.candidate.cin === '' ||
      this.candidate.address === ''
    ) {
      this.markEmptyTextInputsAsTouched(this.editCandidateForm);
      this.errorMessage = 'Veuillez remplir correctement tous les champs obligatoires';
      return;
    }
  
    const formData = new FormData();
    // Append the updated candidate information to the FormData object
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
  
    this.candidateService.editCandidate(id, formData).subscribe(
      (response: any) => {
        console.log('editCandidate response:', response);
  
        this.successMessage = 'Les informations ont été mises à jour avec succès';
        this.errorMessage = '';
  
        const updatedCandidate = response.candidate;
  
        this.updateCandidateService.updateCandidate(this.candidate);
        this.updateCandidateService.emailUpdated(this.candidate.email);
  
       // this.candidate.candImagePath = updatedCandidate.candImagePath; // Update image path
        this.updateCandidateService.updateImage(this.candidate.candImagePath); // Emit updated image path
  
        // Set the updated image path to the candImage field
        this.candidate.candImage = updatedCandidate.candImagePath;
  
        const userLogged = this.candidate.email;
        const userLoggedString = JSON.stringify(userLogged);
  
        sessionStorage.setItem('userEmail', this.candidate.email);
  
        this.cdr.detectChanges();
        // Reset the form validation
        this.editCandidateForm.reset();
      },
      (error) => {
        console.error(error);
        this.errorMessage = 'Veuillez remplir correctement tous les champs obligatoires';
        this.successMessage = '';
      }
    );
  }
  
  
}
