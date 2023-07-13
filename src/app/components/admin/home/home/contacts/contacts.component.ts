import { Component, Input, OnInit } from '@angular/core';
import { NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { Contact } from 'src/app/models/Contact';
import { ContactServiceService } from 'src/app/services/contact-service.service';

@Component({
  selector: 'app-contacts',
  templateUrl: './contacts.component.html',
  styleUrls: ['./contacts.component.css']
})
export class ContactsComponent implements OnInit {
  contacts: Contact[] = [];
  @Input() contact!: Contact;
  modalRef: NgbModalRef | undefined; // Modal reference variable

  pageSize: number = 5; // Initial page size
  // searchCategory: string = '0'; // Default to "Chercher par" option
  // searchKeyword: string = '';
  // filteredContacts: Contact[] = [];

  candidatureSort: string = 'none';

  constructor(private contactService: ContactServiceService){}

  ngOnInit(): void {
    this.getContacts();
  }

  getContacts(): void {
    this.contactService.getContacts(this.pageSize).subscribe(
      (contacts) => {
        this.contacts = contacts;
      },
      (error) => {
        console.error(error);
      }
    );
  }

  onPageSizeChange(event: Event) {
    const value = (event.target as HTMLSelectElement)?.value;
    if (value) {
      this.pageSize = Number(value);
      this.getContacts();
    }
  }

  deleteContact(id: number) {
    this.contactService.deleteContact(id).subscribe(
      (response) => {
        // handle successful deletion
        this.getContacts();
      },
      (error) => {
        // handle error
        console.error(error);
      }
    );
  }

}
