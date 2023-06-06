import { Component, Input } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Recruiter } from 'src/app/models/Recruiter';

@Component({
  selector: 'app-show-recruiter',
  templateUrl: './show-recruiter.component.html',
  styleUrls: ['./show-recruiter.component.css']
})
export class ShowRecruiterComponent {
  @Input() recruiter!: Recruiter;

  constructor(private activeModal: NgbActiveModal, private sanitizer: DomSanitizer) { }

  ngOnInit(): void {
  }

  public close() {
    this.activeModal.close();
  }

  public createImgPath (serverPath: string) : SafeResourceUrl{ 
    const url = `https://localhost:7217/Content/Recruiter/${serverPath}`; 
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }

}
