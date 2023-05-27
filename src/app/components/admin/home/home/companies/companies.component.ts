import { Component, Input, OnInit } from '@angular/core';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { AddCompanyComponent } from './add-company/add-company.component';
import { EditCompanyComponent } from './edit-company/edit-company.component';
import { CompanyServiceService } from 'src/app/services/CompanyService.service';
import { Company } from 'src/app/models/Company';
import { NavigationStart, Router } from '@angular/router';

@Component({
  selector: 'app-companies',
  templateUrl: './companies.component.html',
  styleUrls: ['./companies.component.css']
})

export class CompaniesComponent implements OnInit {
  companies!: Company[];
  response: any;
  modalRef: NgbModalRef | undefined; // Modal reference variable
  @Input() company: Company | undefined;

  constructor(private modalService: NgbModal, private router: Router, private companyService: CompanyServiceService) 
  {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationStart) {
        // Close the modal when navigating away
        this.closeModal();
      }
    });
  }

  ngOnInit(): void {
    this.showCompanies();
  }

  showCompanies(): void {
    this.companyService.getCompanies().subscribe(
      (companies) => {
        this.companies = companies;
      },
      (error) => {
        console.error(error);
      }
    );
  }

  public createImgPath = (serverPath: string) => { 
    return `https://localhost:7217/Content/Company/${serverPath}`; 
  }

  // handleCompanyAdded(company: Company) {
  //   this.companies.push(company);
  // }

  addCompanyModal() {
    this.modalRef = this.modalService.open(AddCompanyComponent);
    this.modalRef.componentInstance.companyAdded.subscribe((company: Company) => {
      // this.handleCompanyAdded(company);
      this.companyService.getCompanies().subscribe(
        (companies) => {
          this.companies = companies;
        },
        (error) => {
          console.error(error);
        }
      );
    });
  }

  // editCompanyModal(id: number): void {
    
  //   this.companyService.getCompany(id).subscribe(
  //     (company) => {
  //       const modalRef = this.modalService.open(EditCompanyComponent);
  //       modalRef.componentInstance.company = company;
  //     },
  //     (error) => {
  //       console.error(error);
  //     }
  //   );
  // }

  editCompanyModal(id: number): void {
    this.companyService.getCompany(id).subscribe(
      (company) => {
        this.modalRef = this.modalService.open(EditCompanyComponent);
        this.modalRef.componentInstance.company = company;
        this.modalRef.componentInstance.companyUpdated.subscribe((updatedCompany: Company) => {
          // Update the company list after successful update
          this.companyService.getCompanies().subscribe(
            (companies) => {
              this.companies = companies;
            },
            (error) => {
              console.error(error);
            }
          );
        });
      },
      (error) => {
        console.error(error);
      }
    );
  }

  closeModal() {
    if (this.modalRef) {
      this.modalRef.close();
    }
  }

  deleteCompany(id: number) {
    this.companyService.deleteCompany(id).subscribe(
      (response) => {
        // handle successful deletion
        this.showCompanies();
      },
      (error) => {
        // handle error
        console.error(error);
      }
    );
  }

}
