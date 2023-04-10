import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import { Component, OnInit } from '@angular/core';
import { ShowRecruiterComponent } from './show-recruiter/show-recruiter.component';

@Component({
  selector: 'app-recruiters',
  templateUrl: './recruiters.component.html',
  styleUrls: ['./recruiters.component.css']
})
export class RecruitersComponent implements OnInit {

  constructor(private modalService: NgbModal) { }

  ngOnInit(): void {
  }

  showCandidate() {
    const modalRef = this.modalService.open(ShowRecruiterComponent)
  }

}
