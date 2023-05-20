import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
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

  signUpForm: FormGroup;
  
  selectedImage: File;
  selectedCV: File;
  selectedLM: File;

  candidate: Candidate = new Candidate();

  constructor(private fb: FormBuilder, private auth: AuthService) { 
    this.selectedImage = new File([], '');
    this.selectedCV = new File([], '');
    this.selectedLM = new File([], '');

    this.signUpForm = this.fb.group({
      ImageCandPath: ['', Validators.required],
      LName: ['', Validators.required],
      FName: ['', Validators.required],
      Email: ['', Validators.required],
      Age: ['', Validators.required],
      Phone: ['', Validators.required],
      Address: ['', Validators.required],
      StudyDegree: ['', Validators.required],
      Diploma: ['', Validators.required],
      Spec: ['', Validators.required],
      ExpYears: ['', Validators.required],
      LMPath: ['', Validators.required],
      CVPath: ['', Validators.required],
      Pass: ['', Validators.required],
      ConfirmPass: ['', Validators.required],
    });
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

  onSignUp() {
    if (this.signUpForm.valid) {
      this.candidate.ImageCandPath = this.signUpForm.value.ImageCandPath;
      this.candidate.LName = this.signUpForm.value.LName;
      this.candidate.FName = this.signUpForm.value.FName;
      this.candidate.Email = this.signUpForm.value.Email;
      this.candidate.Age = this.signUpForm.value.Age;
      this.candidate.Phone = this.signUpForm.value.Phone;
      this.candidate.Address = this.signUpForm.value.Address;
      this.candidate.StudyDegree = this.signUpForm.value.StudyDegree;
      this.candidate.Diploma = this.signUpForm.value.Diploma;
      this.candidate.Spec = this.signUpForm.value.Spec;
      this.candidate.ExpYears = this.signUpForm.value.ExpYears;
      this.candidate.LMPath = this.signUpForm.value.LMPath;
      this.candidate.CVPath = this.signUpForm.value.CVPath;
      this.candidate.Pass = this.signUpForm.value.Pass;
      this.candidate.ConfirmPass = this.signUpForm.value.ConfirmPass;
      
      this.auth.register(this.candidate).subscribe(
        response => {
          console.log(response);
        },
        error => {
          console.error(error);
        }
      );
    } else {
      console.log("Form not valid");
      // Affichez
    }
  }
}
