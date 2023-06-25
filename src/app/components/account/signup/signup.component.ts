import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, NgForm, Validators } from '@angular/forms';
import { CountryISO, NgxIntlTelInputComponent, SearchCountryField } from 'ngx-intl-tel-input-gg';
import { Router } from '@angular/router';
import { Candidate } from 'src/app/models/Candidate';
import { AuthService } from 'src/app/services/AuthService.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {

  // Add separate variables for each password field
  isTextPass: boolean = false;
  eyeIconPass: string = "bi-eye-slash-fill";
  typePass: string = "password";

  isTextConfirmPass: boolean = false;
  eyeIconConfirmPass: string = "bi-eye-slash-fill";
  typeConfirmPass: string = "password";

  passwordMismatchError: boolean = false;
  confirmPassTouched = false;

  candidate: Candidate = new Candidate();
  
  phoneNumber!: string ;
  @ViewChild(NgxIntlTelInputComponent, { static: false }) phoneInput!: NgxIntlTelInputComponent;

  candImage!: File;
  lmFile!: File;
  cvFile!: File;

  errorMessage: string = '';
  successMessage: string = '';
  phonePattern = "^((\\+91-?)|0)?[0-9]{10}$";
  
  candImageExtensionValid = true;
  LMExtensionValid = true;
  CVExtensionValid = true;
  @ViewChild('signUpForm') signUpForm!: NgForm;

  public CountryISO = CountryISO;
  public SearchCountryField = SearchCountryField;
  
  constructor(private AuthService: AuthService, private router: Router) { 
  }

  ngOnInit(): void {
  }

  // Update the hideShowPass method
  hideShowPass() {
    this.isTextPass = !this.isTextPass;
    this.isTextPass ? (this.eyeIconPass = "bi-eye-fill") : (this.eyeIconPass = "bi-eye-slash-fill");
    this.isTextPass ? (this.typePass = "text") : (this.typePass = "password");
  }

  // Update the hideShowConfirmPass method
  hideShowConfirmPass() {
    this.isTextConfirmPass = !this.isTextConfirmPass;
    this.isTextConfirmPass ? (this.eyeIconConfirmPass = "bi-eye-fill") : (this.eyeIconConfirmPass = "bi-eye-slash-fill");
    this.isTextConfirmPass ? (this.typeConfirmPass = "text") : (this.typeConfirmPass = "password");
  }

  onConfirmPassTouched() {
    this.confirmPassTouched = true;
  }
  
  onPhoneChange(): void {
    // Get the phone number value as a string
    const phoneNumber = this.phoneInput.value;
    // Update the candidate.phone property if the phoneNumber is defined
    if (phoneNumber) {
      this.candidate.phone = phoneNumber;
    }
  }
  
  onImageSelected(event: any) {
    const file: File = event.target.files[0];
    const allowedExtensions = ['.png', '.jpg', '.jpeg'];
    const fileExtension = file.name.split('.').pop()?.toLowerCase();

    if (allowedExtensions.indexOf(`.${fileExtension}`) === -1) {
      this.candImageExtensionValid = false;
      this.signUpForm.controls['candImage'].setErrors({ 'invalidExtension': true });
    } else {
      this.candImageExtensionValid = true;
      this.signUpForm.controls['candImage'].setErrors(null);
      this.candImage = event.target.files[0];
    }
  }

  onLMFileSelected(event: any) {
    const file: File = event.target.files[0];
    const allowedExtensions = ['.pdf'];
    const fileExtension = file.name.split('.').pop()?.toLowerCase();

    if (allowedExtensions.indexOf(`.${fileExtension}`) === -1) {
      this.LMExtensionValid = false;
      this.signUpForm.controls['lmFile'].setErrors({ 'invalidExtension': true });
    } else {
      this.LMExtensionValid = true;
      this.signUpForm.controls['lmFile'].setErrors(null);
      this.lmFile = event.target.files[0];
    }
  }

  onCVFileSelected(event: any) {
    const file: File = event.target.files[0];
    const allowedExtensions = ['.pdf'];
    const fileExtension = file.name.split('.').pop()?.toLowerCase();

    if (allowedExtensions.indexOf(`.${fileExtension}`) === -1) {
      this.CVExtensionValid = false;
      this.signUpForm.controls['cvFile'].setErrors({ 'invalidExtension': true });
    } else {
      this.CVExtensionValid = true;
      this.signUpForm.controls['cvFile'].setErrors(null);
      this.cvFile = event.target.files[0];
    }
  }

  signup() {
    this.passwordMismatchError = false;

    if (this.signUpForm.invalid) {
      // Mark all form fields as touched to show validation errors
      this.signUpForm.control.markAllAsTouched();
      return;
    }

    if (this.candidate.pass !== this.candidate.confirmPass) {
      this.passwordMismatchError = true;
      return;
    }

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
        const successMessage = 'Inscription réussie ! Veuillez vous connecter avec vos identifiants';

        this.router.navigate(['/login'], { queryParams: { successMessage }});
      },
      (error) => {
        console.error(error);
        this.errorMessage = 'Veuillez remplir correctement tous les champs obligatoires';
        // handle error
      }
    );
  }
}
