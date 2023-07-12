import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Candidate } from '../models/Candidate';

@Injectable({
  providedIn: 'root'
})
export class UpdateCandidateServiceService {
  private candidate = new BehaviorSubject<Candidate | null>(null);
  candidate$ = this.candidate.asObservable();

  private email = new BehaviorSubject<string | null>(null);
  email$ = this.email.asObservable();

  private candImagePath = new BehaviorSubject<string | null>(null);
  candImagePath$ = this.candImagePath.asObservable();


  updateCandidate(candidate: Candidate): void {
    this.candidate.next(candidate);
  }

  emailUpdated(email: string): void {
    if (email !== this.email.getValue()) {
      this.email.next(email);
    }
  }

  updateImage(candImagePath: string): void {
    console.log('updateImage called with:', candImagePath);
    this.candImagePath.next(candImagePath);
  }  
  
}
