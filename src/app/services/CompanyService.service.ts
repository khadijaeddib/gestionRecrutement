import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Company } from '../models/Company';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CompanyServiceService {

  private baseUrl:string = 'https://localhost:7217/api/Company/';
  constructor(private http : HttpClient) { }

  addCompany(formData: FormData): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}addCompany`, formData);
  }

  getCompanies(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}getCompanies`);
  }

  deleteCompany(id: number): Observable<any> {
    return this.http.delete<any>(`${this.baseUrl}deleteCompany/${id}`);
  }

  getCompany(id: number): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}getCompany/${id}`);
  }  

  updateCompany(id: number, formData: FormData): Observable<any> {
    return this.http.put<any>(`${this.baseUrl}updateCompany/${id}`, formData);
  }

  editCompany(id: number,formData: FormData): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}editCompany/${id}`, formData);
  }
  
}
