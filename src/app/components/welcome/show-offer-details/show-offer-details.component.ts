import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Offer } from 'src/app/models/Offer';
import { OfferServiceService } from 'src/app/services/offer-service.service';
import { RecruiterServiceService } from 'src/app/services/recruiter-service.service';

@Component({
  selector: 'app-show-offer-details',
  templateUrl: './show-offer-details.component.html',
  styleUrls: ['./show-offer-details.component.css']
})
export class ShowOfferDetailsComponent implements OnInit {
  offer!: Offer;

  constructor(private route: ActivatedRoute, private offerService: OfferServiceService, private recruiterService: RecruiterServiceService) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id !== null) {
      this.getOffer(parseInt(id));
    }
  }

  public createImgPath = (serverPath: string) => { 
    return `https://localhost:7217/Content/Company/${serverPath}`; 
  }

  populateRecruiter(): void {
    this.recruiterService.getRecruiter(this.offer.idRec).subscribe(
      (recruiter) => {
        this.offer.recruiter = recruiter;
      },
      (error) => {
        console.error(error);
      }
    );
  }

  getOffer(id:number): void {
    this.offerService.getOffer(id).subscribe(
      (offer) => {
         // Handle the retrieved candidatures
        this.offer = offer;
        this.populateRecruiter();
      },
      (error: any) => {
        // Handle error response
        console.error(error);
      }
    );
  }

}
