import { HttpClient } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { NavigationStart, Router } from '@angular/router';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { Offer } from 'src/app/models/Offer';
import { OfferServiceService } from 'src/app/services/offer-service.service';
import { RecruiterServiceService } from 'src/app/services/recruiter-service.service';
import { AdminAddOfferComponent } from './admin-add-offer/admin-add-offer.component';
import { AdminEditOfferComponent } from './admin-edit-offer/admin-edit-offer.component';

@Component({
  selector: 'app-offers',
  templateUrl: './offers.component.html',
  styleUrls: ['./offers.component.css']
})
export class OffersComponent implements OnInit {
  offers!: Offer[];
  response: any;
  @Input() offer: Offer | undefined;
  modalRef: NgbModalRef | undefined; // Modal reference variable

  selectedDetail: string | null = null;
  selectedOfferIndex: number | null = null;
  selectedTab: string | null = null;

  offerSearchCategory: string = '0'; // Default to "Chercher par" option
  offerSearchKeyword: string = '';
  filteredOffers: Offer[] = [];

  offerSortOrder: string = 'none';

  @Input() recruiter: any;

  constructor(private http: HttpClient,private modalService: NgbModal, private router: Router, private offerService: OfferServiceService, private recruiterService: RecruiterServiceService) {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationStart) {
        // Close the modal when navigating away
        this.closeModal();
      }
    });
  }

  ngOnInit(): void {
    this.getOffers();
  }

  selectOffer(index: number, tab: string) {
    if (this.selectedOfferIndex === index && this.selectedTab === tab) {
      // If the same offer and tab are clicked again, reset the selection
      this.selectedOfferIndex = null;
      this.selectedTab = null;
    } else {
      this.selectedOfferIndex = index;
      this.selectedTab = tab;
    }
  }

  populateRecruiters(): void {
    for (const offer of this.offers) {
      this.recruiterService.getRecruiter(offer.idRec).subscribe(
        (recruiter) => {
          offer.recruiter = recruiter;
        },
        (error) => {
          console.error(error);
       }
       );
    }
  }

  getOffers(): void {
    this.offerService.getAllOffers().subscribe(
      (offers) => {
         // Handle the retrieved candidatures
        this.offers = offers;
        this.filteredOffers = this.offers;
        this.populateRecruiters();
      },
      (error: any) => {
        // Handle error response
        console.error(error);
      }
    );
  }

  offerOnSearch() {
    if (this.offerSearchCategory === '0') {
      // If no category is selected, reset the filteredOffers array
      this.filteredOffers = [];
      return;
    }else if (this.offerSearchCategory === 'all') {
      this.filteredOffers = this.offers;
      this.offerSearchKeyword = ''; // Reset the search keyword
      return;
    }
    // Perform the filtering based on the selected category and keyword
    this.filteredOffers = this.offers.filter(offer => {
      if (this.offerSearchCategory === 'expYears') {
        // Filter by experience years
        return offer.expYears.toLowerCase().includes(this.offerSearchKeyword.toLowerCase());

      } else if (this.offerSearchCategory === 'diploma') {
        // Filter by diploma
        return offer.diploma.toLowerCase().includes(this.offerSearchKeyword.toLowerCase());

      } else if (this.offerSearchCategory === 'title') {
        // Filter by title
        return offer.title.toLowerCase().includes(this.offerSearchKeyword.toLowerCase());

      } else if (this.offerSearchCategory === 'contractType') {
        // Filter by contractType
        return offer.contractType.toLowerCase().includes(this.offerSearchKeyword.toLowerCase());

      } else if (this.offerSearchCategory === 'endDate') {
          // Filter by end date
          let endDate = new Date(offer.endDate);
          let searchDate = new Date(this.offerSearchKeyword);
          let endDateString = endDate.getFullYear() + '-' + (endDate.getMonth() + 1).toString().padStart(2, '0') + '-' + endDate.getDate().toString().padStart(2, '0');
          let searchDateString = searchDate.getFullYear() + '-' + (searchDate.getMonth() + 1).toString().padStart(2, '0') + '-' + searchDate.getDate().toString().padStart(2, '0');
          return endDateString.startsWith(this.offerSearchKeyword);
      }
      
      return false;
    });
  }
 
  sortOffersByDate(order: string) {
    this.filteredOffers.sort((a, b) => {
      let dateA = new Date(a.pubDate);
      let dateB = new Date(b.pubDate);
      if (order === 'desc') {
        return dateA.getTime() - dateB.getTime();
      } else if (order === 'asc') {
        return dateB.getTime() - dateA.getTime();
      }
      return 0; // Add a default return value
    });
  }
  
  deleteOffer(id: number) {
    this.offerService.deleteOffer(id).subscribe(
      (response) => {
        // handle successful deletion
        this.getOffers();
      },
      (error) => {
        // handle error
        console.error(error);
      }
    );
  }

  addOfferModal() {
    this.modalRef = this.modalService.open(AdminAddOfferComponent);
    this.modalRef.componentInstance.offerAdded.subscribe((offer: Offer) => {
      // this.handleCompanyAdded(company);
      this.offerService.getAllOffers().subscribe(
        (offers) => {
          this.offers = offers;
          this.filteredOffers = offers; // Update the filteredOffers array as well
          this.populateRecruiters();
        },
        (error) => {
          console.error(error);
        }
      );
    });
  }

  editOfferModal(id: number): void {
    this.offerService.getOffer(id).subscribe(
      (offer) => {
        this.modalRef = this.modalService.open(AdminEditOfferComponent);
        this.modalRef.componentInstance.offer = offer;
        this.modalRef.componentInstance.offerUpdated.subscribe((updatedOffer: Offer) => {
          // Update the company list after successful update
          this.offerService.getAllOffers().subscribe(
            (offers) => {
              this.offers = offers;
              this.filteredOffers = offers; // Update the filteredOffers array as well
              this.populateRecruiters();
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
}
