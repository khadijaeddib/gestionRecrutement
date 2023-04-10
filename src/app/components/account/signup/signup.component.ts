import { Component, OnInit } from '@angular/core';

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

  constructor() { }

  ngOnInit(): void {
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

  signup(){

  }

}
