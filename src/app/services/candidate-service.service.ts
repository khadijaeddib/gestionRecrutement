import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CandidateServiceService {

  private baseUrl:string = 'https://localhost:7217/api/Candidate/';
  constructor(private http : HttpClient) { }

  getAllCandidates(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}getAllCandidates`);
  }

  getCandidate(id: number): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}getCandidate/${id}`);
  }

  deleteCandidate(id: number): Observable<any> {
    return this.http.delete<any>(`${this.baseUrl}deleteCandidate/${id}`);
  }

  editCandidate(id: number,formData: FormData): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}editCandidate/${id}`, formData);
  }

  getCandidates(pageSize: number): Observable<any> {
    const params = new HttpParams().set('pageSize', String(pageSize));
    return this.http.get<any>(`${this.baseUrl}getCandidates`, { params });
  }
  
  getRecruiterCandidates(id: number, pageSize: number): Observable<any> {
    const params = new HttpParams().set('pageSize', String(pageSize));
    return this.http.get<any>(`${this.baseUrl}getRecruiterCandidates/${id}`, { params });
  }

  getAllRecruiterCandidates(id: number): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}getAllRecruiterCandidates/${id}`);
  }
}
