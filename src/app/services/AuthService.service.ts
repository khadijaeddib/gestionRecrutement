import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private baseUrl:String = 'https://localhost:7217/api/Candidate/';
  constructor(private http : HttpClient) { }

  
  // signup(candidate:any){
  //   //return this.http.post<any>(`${this.baseUrl}register`,candidateObj)
  //   return this.http.post<any>(this.baseUrl+'register',candidate);
  // }

  register(candidate: any): Observable<any> {
    return this.http.post(`${this.baseUrl}register`, candidate);
  }

  login(loginObj:any){
    return this.http.post<any>(`${this.baseUrl}authenticate`,loginObj)
  }
}
