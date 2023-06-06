import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Login } from '../models/Login';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private baseUrl:String = 'https://localhost:7217/api/Auth/';
  constructor(private http : HttpClient) { }

  login(formData: FormData): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}login`, formData);
  }

  logout() {
    return this.http.post('/api/auth/logout', {});
  }

  signup(formData: FormData): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}register/candidate`, formData);
  }

  addRecruiter(formData: FormData): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}register/recruiter`, formData);
  }

  
}
