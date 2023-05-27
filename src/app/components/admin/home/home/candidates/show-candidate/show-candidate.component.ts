import { Component, Input, OnInit } from '@angular/core';
import { NavigationStart, Router } from '@angular/router';
import { NgbActiveModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { Candidate } from 'src/app/models/Candidate';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';


@Component({
  selector: 'app-show-candidate',
  templateUrl: './show-candidate.component.html',
  styleUrls: ['./show-candidate.component.css']
})
export class ShowCandidateComponent implements OnInit {
  @Input() candidate!: Candidate;

  constructor(private activeModal: NgbActiveModal, private sanitizer: DomSanitizer) { 
  }

  ngOnInit(): void {
  }

  public close() {
    this.activeModal.close();
  }

  public createImgPath (serverPath: string) : SafeResourceUrl{ 
    const url = `https://localhost:7217/Content/Candidate/Images/${serverPath}`; 
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }

  public createLMPath (serverPath: string) : SafeResourceUrl{ 
    const url = `https://localhost:7217/Content/Candidate/LMs/${serverPath}`; 
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }

  public createCVPath (serverPath: string) : SafeResourceUrl{ 
    const url = `https://localhost:7217/Content/Candidate/CVs/${serverPath}`; 
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }

  openLM(): void {
    // Open the LM file in a new window or tab
    window.open(`https://localhost:7217/Content/Candidate/LMs/${this.candidate.lmPath}`, '_blank');
  }

  openCV(): void {
    // Open the CV file in a new window or tab
    window.open(`https://localhost:7217/Content/Candidate/CVs/${this.candidate.cvPath}`, '_blank');
  }

}
