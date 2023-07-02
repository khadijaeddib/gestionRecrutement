import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class InterviewServiceService {
  private baseUrl:string = 'https://localhost:7217/api/Interview/';
  constructor(private http : HttpClient) { }

  addInterview(formData: FormData): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}addInterview`, formData);
  }

  getInterviews(pageSize: number): Observable<any> {
    const params = new HttpParams().set('pageSize', String(pageSize));
    return this.http.get<any>(`${this.baseUrl}getInterviews`, { params });
  }

  getAllInterviews(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}getAllInterviews`);
  }

  getInterview(id: number): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}getInterview/${id}`);
  }

  deleteInterview(id: number): Observable<any> {
    return this.http.delete<any>(`${this.baseUrl}deleteInterview/${id}`);
  }  

  editInterview(id: number,formData: FormData): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}editInterview/${id}`, formData);
  }

  editInterviewStatus(id: number,formData: FormData): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}editInterviewStatus/${id}`, formData);
  }

  getAllRecruiterInterviews(id: number): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}getAllRecruiterInterviews/${id}`);
  }

  getRecruiterInterviews(id: number, pageSize: number): Observable<any> {
    const params = new HttpParams().set('pageSize', String(pageSize));
    return this.http.get<any>(`${this.baseUrl}getRecruiterInterviews/${id}`, { params });
  }  

  getAllCandidateInterviews(id: number): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}getAllCandidateInterviews/${id}`);
  }

  getCandidateInterviews(id: number, pageSize: number): Observable<any> {
    const params = new HttpParams().set('pageSize', String(pageSize));
    return this.http.get<any>(`${this.baseUrl}getCandidateInterviews/${id}`, { params });
  }
}
