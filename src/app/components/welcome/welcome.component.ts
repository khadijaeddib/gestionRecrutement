import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { NavigationStart, Router } from '@angular/router';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { Offer } from 'src/app/models/Offer';
import { AuthService } from 'src/app/services/AuthService.service';
import { OfferServiceService } from 'src/app/services/offer-service.service';
import { RecruiterServiceService } from 'src/app/services/recruiter-service.service';

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.css']
})
export class WelcomeComponent implements OnInit{
  offers!: Offer[];
  response: any;
  @Input() offer: Offer | undefined;
  modalRef: NgbModalRef | undefined; // Modal reference variable

  offerSearchCategory: string = '0'; // Default to "Chercher par" option
  offerSearchKeyword: string = '';
  filteredOffers: Offer[] = [];

  offerSearchCity: string = '0'; // Default to "Chercher par" option
  @ViewChild('offerList', { static: true }) offerList!: ElementRef;
  
  offerSortOrder: string = 'none';

  @Input() recruiter: any;

  constructor(private http: HttpClient,private modalService: NgbModal, private router: Router, private offerService: OfferServiceService, private recruiterService: RecruiterServiceService, private AuthService:AuthService) {
    // this.router.events.subscribe((event: any) => {
    //   if (event instanceof NavigationStart) {
    //     // Close the modal when navigating away
    //     this.closeModal();
    //   }
    // });
  }
  
  ngOnInit(): void {
    this.getOffers();
    this.AuthService.incrementVisitorCounter().subscribe();
  }

  public createImgPath = (serverPath: string) => { 
    return `https://localhost:7217/Content/Company/${serverPath}`; 
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
    // Reset the filteredOffers array
    this.filteredOffers = [];
  
    // Check if no category and city are selected
    if (this.offerSearchCategory === '0' && this.offerSearchCity === '0') {
      // Return all offers
      this.filteredOffers = this.offers;
      return;
    }
  
    // Perform the filtering based on the selected category and city
    this.filteredOffers = this.offers.filter(offer => {
      if (this.offerSearchCategory === '0' && this.offerSearchCity !== '0') {
        // Filter by city only
        return offer.city.toLowerCase().includes(this.offerSearchCity.toLowerCase());
      } else if (this.offerSearchCategory === '0' && this.offerSearchCity === '0') {
        // No filtering applied when only category is selected without a city
        return true;
      } else {
        // Filter by both category and city
        if (this.offerSearchCategory === 'expYears') {
          // Filter by experience years
          return (
            offer.expYears.toLowerCase().includes(this.offerSearchKeyword.toLowerCase()) &&
            offer.city.toLowerCase().includes(this.offerSearchCity.toLowerCase())
          );
        } else if (this.offerSearchCategory === 'diploma') {
          // Filter by diploma
          return (
            offer.diploma.toLowerCase().includes(this.offerSearchKeyword.toLowerCase()) &&
            offer.city.toLowerCase().includes(this.offerSearchCity.toLowerCase())
          );
        } else if (this.offerSearchCategory === 'title') {
          // Filter by title
          return (
            offer.title.toLowerCase().includes(this.offerSearchKeyword.toLowerCase()) &&
            offer.city.toLowerCase().includes(this.offerSearchCity.toLowerCase())
          );
        } else if (this.offerSearchCategory === 'contractType') {
          // Filter by contractType
          return (
            offer.contractType.toLowerCase().includes(this.offerSearchKeyword.toLowerCase()) &&
            offer.city.toLowerCase().includes(this.offerSearchCity.toLowerCase())
          );
        } else if (this.offerSearchCategory === 'endDate') {
          // Filter by end date
          let endDate = new Date(offer.endDate);
          let searchDate = new Date(this.offerSearchKeyword);
          let endDateString = endDate.getFullYear() + '-' + (endDate.getMonth() + 1).toString().padStart(2, '0') + '-' + endDate.getDate().toString().padStart(2, '0');
          let searchDateString = searchDate.getFullYear() + '-' + (searchDate.getMonth() + 1).toString().padStart(2, '0') + '-' + searchDate.getDate().toString().padStart(2, '0');
          return (
            endDateString.startsWith(this.offerSearchKeyword) &&
            offer.city.toLowerCase().includes(this.offerSearchCity.toLowerCase())
          );
        }
      }
      return false;
    });
  
    // Scroll to the offer list
    this.offerList.nativeElement.scrollIntoView({ behavior: 'smooth' });
  }

  // getOfferCountByCategory(category: string): number {
  //   return this.filteredOffers.filter(offer => offer.title.toLowerCase().includes(category.toLowerCase())).length;
  // }  

  getOfferCountByCategory(...categories: string[]): number {
    return this.offers.filter(offer => {
      return categories.some(category => offer.title.toLowerCase().includes(category.toLowerCase()));
    }).length;
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
}
