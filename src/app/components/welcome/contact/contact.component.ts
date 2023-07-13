import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Contact } from 'src/app/models/Contact';
import { ContactServiceService } from 'src/app/services/contact-service.service';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.css']
})
export class ContactComponent implements OnInit {
  Contact: Contact = new Contact();
  @ViewChild('contactForm') contactForm!: NgForm;

  errorMessage: string = '';
  successMessage: string = '';

  constructor(private ContactService: ContactServiceService, private router: Router, private route: ActivatedRoute) { }
  
  ngOnInit(): void {
  }

  send() {
    // Reset success and error messages
    this.successMessage = '';
    this.errorMessage = '';

    if (this.contactForm.invalid) {
      //Mark all form fields as touched to show validation errors
      this.contactForm.control.markAllAsTouched();
      return;
    }

    const formData = new FormData();
    
    formData.append('name', this.Contact.name);
    formData.append('email', this.Contact.email);
    formData.append('subject', this.Contact.subject);
    formData.append('message', this.Contact.message);

    this.ContactService.send(formData).subscribe(
      (response) => {
        // Display success message
        this.successMessage = 'Merci pour votre contact! Votre message a été envoyé avec succès.';
        this.errorMessage = '';
        // Reset the form
        this.contactForm.reset();
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
