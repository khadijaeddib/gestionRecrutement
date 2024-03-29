import { HttpClient } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { NavigationStart, Router } from '@angular/router';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { Offer } from 'src/app/models/Offer';
import { OfferServiceService } from 'src/app/services/offer-service.service';
import { RecruiterServiceService } from 'src/app/services/recruiter-service.service';
import { ApplyOfferComponent } from './apply-offer/apply-offer.component';
import { CandidatureServiceService } from 'src/app/services/candidature-service.service';
import { Candidate } from 'src/app/models/Candidate';
import { ErrorModalComponent } from './error-modal/error-modal.component';

@Component({
  selector: 'app-candidate-offer',
  templateUrl: './candidate-offer.component.html',
  styleUrls: ['./candidate-offer.component.css']
})
export class CandidateOfferComponent implements OnInit{
  candidate: Candidate = new Candidate();
  
  offers: Offer[] = [];
  // response: any;
  // @Input() offer: Offer | undefined;
  modalRef: NgbModalRef | undefined; // Modal reference variable

  selectedDetail: string | null = null;
  selectedOfferIndex: number | null = null;
  selectedTab: string | null = null;

  offerSearchCategory: string = '0'; // Default to "Chercher par" option
  offerSearchKeyword: string = '';
  filteredOffers: Offer[] = [];

  offerSortOrder: string = 'none';

  constructor(private http: HttpClient,private modalService: NgbModal, private router: Router, private offerService: OfferServiceService, private recruiterService: RecruiterServiceService, private candidatureService: CandidatureServiceService) {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationStart) {
        // Close the modal when navigating away
        this.closeModal();
      }
    });
  }

  ngOnInit(): void {
    const userLoggedString = sessionStorage.getItem('userLogged');
    if (userLoggedString) {
      const userLogged = JSON.parse(userLoggedString);
      this.candidate = userLogged;
    }

    this.getAllOffers();
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

  getAllOffers(): void {
    this.offerService.getAllOffers().subscribe(
      (offers) => {
        this.offers = offers;
        this.filteredOffers = this.offers;
        this.populateRecruiters(); // Call the method to populate recruiters for each offer

      },
      (error) => {
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
      // If "Tous les candidats" is selected, display all candidates
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

  applyOffer(id: number): void {
    this.offerService.getOffer(id).subscribe(
      (offer) => {
        // Check if the offer has expired
        if (new Date() > new Date(offer.endDate)) {
          // Show error message in modal
          this.modalRef = this.modalService.open(ErrorModalComponent);
          this.modalRef.componentInstance.errorMessage = 'La date limite pour postuler à cette offre est malheureusement dépassée.';
          this.modalRef.componentInstance.errorMessage1 = 'Votre candidature ne peut pas être prise en compte à ce stade. Nous vous encourageons à consulter nos offres actuelles et à postuler à celles qui sont encore ouvertes.';
          this.modalRef.componentInstance.errorMessage2 = 'Merci pour votre intérêt et votre compréhension.';
        } else {
          this.candidatureService.hasApplied(this.candidate.idCand, offer.idOffer).subscribe(hasApplied => {
            if (hasApplied) {
              // Show error message in modal
              this.modalRef = this.modalService.open(ErrorModalComponent);
              this.modalRef.componentInstance.errorMessage = 'Vous avez déjà soumis une candidature pour cette offre';
              this.modalRef.componentInstance.errorMessage1 = 'Nous avons bien reçu votre candidature pour cette offre. Votre demande est en cours de traitement et notre équipe l\'examinera attentivement. Veuillez patienter pendant que nous évaluons votre profil. Nous vous contacterons si votre candidature est retenue pour la prochaine étape du processus de sélection.';
              this.modalRef.componentInstance.errorMessage2 = 'Merci de votre intérêt et de votre compréhension.';
            } else {
              // Open modal
              this.modalRef = this.modalService.open(ApplyOfferComponent);
              this.modalRef.componentInstance.offer = offer;
              this.modalRef.componentInstance.offerApplied.subscribe((appliedOffer: Offer) => {
                // Update the company list after successful update
                // if (appliedOffer && appliedOffer.idOffer) {
                //   this.modalRef.componentInstance.applyJob(appliedOffer.idOffer);
                // }
                this.offerService.getOffers().subscribe(
                  (offers) => {
                    this.offers = offers;
                    this.filteredOffers = offers; // Update the filteredOffers array as well
                  },
                  (error) => {
                    console.error(error);
                  }
                );
              });
            }
          });
        }
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
