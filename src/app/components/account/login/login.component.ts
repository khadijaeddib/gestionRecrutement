import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, NgForm, Validators } from '@angular/forms';
import ValidateForm from 'src/app/helpers/validateForm';
import { Login } from 'src/app/models/Login';
import { AuthService } from 'src/app/services/AuthService.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  type: string = "password";
  isText: boolean = false;
  eyeIcon: string = "bi-eye-slash-fill";

  userLogin: Login = new Login();
  @ViewChild('loginForm') loginForm!: NgForm;
  errorMessage: string = '';
  successMessage: string = '';


  constructor(private AuthService: AuthService, private router: Router, private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.successMessage = params['successMessage'] || null;
    });
  }

  hideShowPass(){
    this.isText = !this.isText;
    this.isText ? this.eyeIcon = "bi-eye-fill" : this.eyeIcon = "bi-eye-slash-fill";
    this.isText ? this.type = "text" : this.type = "password";
  }

  login() {
    if (this.loginForm.invalid) {
      //Mark all form fields as touched to show validation errors
      this.loginForm.control.markAllAsTouched();
      return;
    }

    this.errorMessage = ''; // Reset the error message

    const formData = new FormData();
    
    formData.append('email', this.userLogin.email);
    formData.append('pwd', this.userLogin.pwd);

    this.AuthService.login(formData).subscribe(
    (response) => {
      this.userLogin = response.user; 

      const userEmail = this.userLogin.email;
      localStorage.setItem('userEmail', userEmail);
      // Redirect to the appropriate dashboard based on the user's role
      const role = response.role;

      if (role === 'Admin') {
        this.router.navigate(['/admin']);
      } else if (role === 'Candidate') {
        this.router.navigate(['/candidate']);
      } else if (role === 'Recruiter') {
        this.router.navigate(['/recruiter']);
      }
    },
    (error) => {
      console.error(error);
      if (error.status === 400) {
        this.errorMessage = 'Email ou mot de passe invalide';
        this.successMessage = '';
      } else {
        this.errorMessage = 'Veuillez remplir correctement tous les champs obligatoires';
        this.successMessage = '';
        
      }
    }
    );
  }


  rememberMe(){
  }

}
