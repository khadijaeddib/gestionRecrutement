import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-show-recruiter',
  templateUrl: './show-recruiter.component.html',
  styleUrls: ['./show-recruiter.component.css']
})
export class ShowRecruiterComponent {

  constructor(private activeModal: NgbActiveModal) { }

  ngOnInit(): void {
  }

  public close() {
    this.activeModal.close();
  }

}
