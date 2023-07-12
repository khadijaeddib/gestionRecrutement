import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ResetPassword } from 'src/app/models/ResetPassword';
import { AuthService } from 'src/app/services/AuthService.service';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent implements OnInit {
  // Add separate variables for each password field
  isTextPass: boolean = false;
  eyeIconPass: string = "bi-eye-slash-fill";
  typePass: string = "password";

  isTextConfirmPass: boolean = false;
  eyeIconConfirmPass: string = "bi-eye-slash-fill";
  typeConfirmPass: string = "password";

  passwordMismatchError: boolean = false;
  confirmPassTouched = false;

  userResetPassword: ResetPassword = new ResetPassword();
  @ViewChild('resetPasswordForm') resetPasswordForm!: NgForm;

  errorMessage: string = '';
  successMessage: string = '';

  constructor(private AuthService: AuthService, private router: Router, private route: ActivatedRoute) { }

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

  resetPassword() {
    this.passwordMismatchError = false;

    if (this.resetPasswordForm.invalid) {
      //Mark all form fields as touched to show validation errors
      this.resetPasswordForm.control.markAllAsTouched();
      return;
    }

    if (this.userResetPassword.newPassword !== this.userResetPassword.confirmNewPassword) {
      this.passwordMismatchError = true;
      return;
    }

    const formData = new FormData();
    
    formData.append('email', this.userResetPassword.email);
    formData.append('newPassword', this.userResetPassword.newPassword);
    formData.append('confirmNewPassword', this.userResetPassword.confirmNewPassword);

    this.AuthService.resetPassword(formData).subscribe(
      (response) => {
        // Display success message
        const successMessage = 'Mot de passe réinitialisé avec succès. Veuillez vous connecter avec votre nouveau mot de passe.';
        this.errorMessage = '';

        this.router.navigate(['/login'], { queryParams: { successMessage }});
      },
      (error) => {
        console.error(error);
        if (error.status === 400) {
          this.errorMessage = error.error.Message;
          this.successMessage = '';
        } else {
          this.errorMessage = 'Veuillez remplir correctement tous les champs obligatoires';
          this.successMessage = '';
        }
      }
    );
  }
  

}
