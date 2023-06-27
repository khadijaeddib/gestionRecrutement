import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private baseUrl:String = 'https://localhost:7217/api/Auth/';
  
  constructor(private http : HttpClient) { }

  login(formData: FormData): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}login`, formData);
  }

  // login(formData: FormData): Observable<any> {
  //   return this.http.post<any>(`${this.baseUrl}login`, formData).pipe(
  //     tap(response => {
  //       if (response.success) {
  //         // Increment the visitor counter
  //         this.http.post<any>(`${this.baseUrl}incrementVisitorCounter`, {}).subscribe();
  //       }
  //     })
  //   );
  // }

  logout() {
    return this.http.post('/api/auth/logout', {});
  }

  signup(formData: FormData): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}register/candidate`, formData);
  }

  addRecruiter(formData: FormData): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}register/recruiter`, formData);
  }

  incrementVisitorCounter(): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}incrementVisitorCounter`, {});
  }

  getTotalVisitors(): Observable<number> {
    return this.http.get<number>(`${this.baseUrl}getTotalVisitors`);
  }
  
}

