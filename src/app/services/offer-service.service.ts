import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class OfferServiceService {

  private baseUrl:string = 'https://localhost:7217/api/Offer/';
  constructor(private http : HttpClient) { }

  addOffer(formData: FormData): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}addOffer`, formData);
  }

  getOffers(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}getOffers`);
  }

  getOffer(id: number): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}getOffer/${id}`);
  }

  deleteOffer(id: number): Observable<any> {
    return this.http.delete<any>(`${this.baseUrl}deleteOffer/${id}`);
  }  

  editOffer(id: number,formData: FormData): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}editOffer/${id}`, formData);
  }
  
  getAllOffers(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}getAllOffers`);
  }

  getRecruiterOffers(id: number): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}getRecruiterOffers/${id}`);
  }

  // getOffers(id: number): Observable<any> {
  //   return this.http.get<any>(`${this.baseUrl}getOffers/${id}`);
  // }
}
