import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import ValidateForm from 'src/app/helpers/validateForm';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {

  type: string = "password";
  isText: boolean = false;
  eyeIcon: string = "bi-eye-slash-fill";

  // Candidates: Candidate[] = [];
  // Candidate: Candidate ={
  //   id: '',
  //   lName: '',
  //   fName: '',
  //   age: '',
  //   email: '',
  //   phone: '',
  //   address: '',
  //   diploma: '',
  //   expYears: '',
  //   LM: '',
  //   CV: '',
  //   pass: '',
  // }

  signUpForm!: FormGroup;

  constructor(private fb: FormBuilder) { }

  ngOnInit(): void {
    this.signUpForm = this.fb.group({
      imageCand: ['', Validators.required],
      lName: ['', Validators.required],
      fName: ['', Validators.required],
      email: ['', Validators.required],
      age: ['', Validators.required],
      phone: ['', Validators.required],
      address: ['', Validators.required],
      studyDegree: ['', Validators.required],
      diploma: ['', Validators.required],
      spec: ['', Validators.required,{updateOn: 'submit'}],
      expYears: ['', Validators.required],
      LM: ['', Validators.required,{updateOn: 'submit'}],
      CV: ['', Validators.required,{updateOn: 'submit'}],
      pass: ['', Validators.required,{updateOn: 'submit'}],
      rePass: ['', Validators.required,{updateOn: 'submit'}],
    })
  }

  hideShowPass(){
    this.isText = !this.isText;
    this.isText ? this.eyeIcon = "bi-eye-fill" : this.eyeIcon = "bi-eye-slash-fill";
    this.isText ? this.type = "text" : this.type = "password";
  }

  hideShowrePass(){
    this.isText = !this.isText;
    this.isText ? this.eyeIcon = "bi-eye-fill" : this.eyeIcon = "bi-eye-slash-fill";
    this.isText ? this.type = "text" : this.type = "password";
  }

  onSignup(){
    if(this.signUpForm.valid){

      console.log(this.signUpForm.value)

    }else {
      console.log("form not valid")

      ValidateForm.validateAllFormFields(this.signUpForm)

      alert("form invalide")

    }

  }



}
