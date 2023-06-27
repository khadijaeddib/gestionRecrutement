import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CandidatureServiceService {
  private baseUrl:string = 'https://localhost:7217/api/Candidature/';
  constructor(private http : HttpClient) { }

  addCandidature(formData: FormData): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}addCandidature`, formData);
  }

  getAllCandidatures(pageSize: number): Observable<any> {
    const params = new HttpParams().set('pageSize', String(pageSize));
    return this.http.get<any>(`${this.baseUrl}getAllCandidatures`, { params });
  }

  getCandidatures(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}getCandidatures`);
  }

  getCandidature(id: number): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}getCandidature/${id}`);
  }

  deleteCandidature(id: number): Observable<any> {
    return this.http.delete<any>(`${this.baseUrl}deleteCandidature/${id}`);
  }  

  editCandidature(id: number,formData: FormData): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}editCandidature/${id}`, formData);
  }

  getCandidateCandidatures(id: number, pageSize: number): Observable<any> {
    const params = new HttpParams().set('pageSize', String(pageSize));
    return this.http.get<any>(`${this.baseUrl}getCandidateCandidatures/${id}`, { params });
  }

  getRecruiterCandidatures(id: number, pageSize: number): Observable<any> {
    const params = new HttpParams().set('pageSize', String(pageSize));
    return this.http.get<any>(`${this.baseUrl}getRecruiterCandidatures/${id}`, { params });
  }  

  getAllRecruiterCandidatures(id: number): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}getAllRecruiterCandidatures/${id}`);
  }

  getAllCandidateCandidatures(id: number): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}getAllCandidateCandidatures/${id}`);
  }

}
