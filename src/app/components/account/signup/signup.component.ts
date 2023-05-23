import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, NgForm, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Candidate } from 'src/app/models/Candidate';
import { AuthService } from 'src/app/services/AuthService.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {
  type: string = "password";
  isText: boolean = false;
  eyeIcon: string = "bi-eye-slash-fill";

  candidate: Candidate = new Candidate();

  FilecandImage!: File;
  FileLMFile!: File;
  FileCVFile!: File;

  errorMessage: string = '';
  successMessage: string = '';
  phonePattern = "^((\\+91-?)|0)?[0-9]{10}$";
  candImageExtensionValid = true;
  LMExtensionValid = true;
  CVExtensionValid = true;
  @ViewChild('signUpForm') signUpForm!: NgForm;

  constructor(private AuthService: AuthService, private router: Router) { 
  }

  ngOnInit(): void {
  }

  hideShowPass(){
    this.isText = !this.isText;
    this.isText ? this.eyeIcon = "bi-eye-fill" : this.eyeIcon = "bi-eye-slash-fill";
    this.isText ? this.type = "text" : this.type = "password";
  }

  hideShowConfirmPass(){
    this.isText = !this.isText;
    this.isText ? this.eyeIcon = "bi-eye-fill" : this.eyeIcon = "bi-eye-slash-fill";
    this.isText ? this.type = "text" : this.type = "password";
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
      this.FilecandImage = event.target.files[0];
    }
  }

  onLMFileSelected(event: any) {
    const file: File = event.target.files[0];
    const allowedExtensions = ['.pdf'];
    const fileExtension = file.name.split('.').pop()?.toLowerCase();

    if (allowedExtensions.indexOf(`.${fileExtension}`) === -1) {
      this.LMExtensionValid = false;
      this.signUpForm.controls['LMFile'].setErrors({ 'invalidExtension': true });
    } else {
      this.LMExtensionValid = true;
      this.signUpForm.controls['LMFile'].setErrors(null);
      this.FileLMFile = event.target.files[0];
    }
  }

  onCVFileSelected(event: any) {
    const file: File = event.target.files[0];
    const allowedExtensions = ['.pdf'];
    const fileExtension = file.name.split('.').pop()?.toLowerCase();

    if (allowedExtensions.indexOf(`.${fileExtension}`) === -1) {
      this.CVExtensionValid = false;
      this.signUpForm.controls['CVFile'].setErrors({ 'invalidExtension': true });
    } else {
      this.CVExtensionValid = true;
      this.signUpForm.controls['CVFile'].setErrors(null);
      this.FileCVFile = event.target.files[0];
    }
  }

  signup() {
    if (this.signUpForm.invalid) {
      // Mark all form fields as touched to show validation errors
      this.signUpForm.control.markAllAsTouched();
      return;
    }

    const formData = new FormData();

    formData.append('candImage', this.FilecandImage);
    formData.append('lName', this.candidate.lName);
    formData.append('fName', this.candidate.fName);
    formData.append('email', this.candidate.email);
    formData.append('age', this.candidate.age);
    formData.append('phone', this.candidate.phone);
    formData.append('address', this.candidate.address);
    formData.append('studyDegree', this.candidate.studyDegree);
    formData.append('diploma', this.candidate.diploma);
    formData.append('spec', this.candidate.spec);
    formData.append('expYears', this.candidate.expYears);
    formData.append('LMFile', this.FileLMFile);
    formData.append('CVFile', this.FileCVFile);
    formData.append('pass', this.candidate.pass);
    formData.append('confirmPass', this.candidate.confirmPass);


    this.AuthService.signup(formData).subscribe(
      (response) => {
        this.router.navigate(['/login']);
        this.successMessage = 'Inscription réussie ! Veuillez vous connecter avec vos identifiants';
      },
      (error) => {
        console.error(error);
        this.errorMessage = 'Veuillez remplir correctement tous les champs obligatoires';
        // handle error
      }
    );
  }



  
  
}
