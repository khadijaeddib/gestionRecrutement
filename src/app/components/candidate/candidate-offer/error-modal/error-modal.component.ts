import { Component, OnInit } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-error-modal',
  templateUrl: './error-modal.component.html',
  styleUrls: ['./error-modal.component.css']
})
export class ErrorModalComponent implements OnInit{
  errorMessage: string = '';
  errorMessage1: string = '';
  errorMessage2: string = '';

  constructor(private activeModal: NgbActiveModal, private modalService: NgbModal){}

  ngOnInit(): void {
  }

  public close() {
    this.activeModal.close();
  }

}
