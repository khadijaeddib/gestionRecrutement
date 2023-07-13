import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ContactServiceService {

  private baseUrl:string = 'https://localhost:7217/api/Contact/';
  constructor(private http : HttpClient) { }

  send(formData: FormData): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}contact`, formData);
  }

  getContacts(pageSize: number): Observable<any> {
    const params = new HttpParams().set('pageSize', String(pageSize));
    return this.http.get<any>(`${this.baseUrl}getContacts`, { params });
  }

  deleteContact(id: number): Observable<any> {
    return this.http.delete<any>(`${this.baseUrl}deleteContact/${id}`);
  }  
}
