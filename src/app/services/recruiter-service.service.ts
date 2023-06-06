import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RecruiterServiceService {

  private baseUrl:string = 'https://localhost:7217/api/Recruiter/';
  constructor(private http : HttpClient) { }

  getRecruiters(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}getRecruiters`);
  }

  getRecruiter(id: number): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}getRecruiter/${id}`);
  }

  deleteRecruiter(id: number): Observable<any> {
    return this.http.delete<any>(`${this.baseUrl}deleteRecruiter/${id}`);
  }
  

}
