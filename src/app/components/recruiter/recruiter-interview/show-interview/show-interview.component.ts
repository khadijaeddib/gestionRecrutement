import { Component, Input, OnInit } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Candidate } from 'src/app/models/Candidate';
import { Candidature } from 'src/app/models/Candidature';
import { Interview } from 'src/app/models/Interview';

@Component({
  selector: 'app-show-interview',
  templateUrl: './show-interview.component.html',
  styleUrls: ['./show-interview.component.css']
})
export class ShowInterviewComponent implements OnInit {
  @Input() candidate!: Candidate;
  @Input() candidature!: Candidature;

  @Input() interview!: Interview;

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

}
