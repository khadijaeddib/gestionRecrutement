import { Component, OnInit } from '@angular/core';

interface ClassColors {
  [key: string]: string;
}
@Component({
  selector: 'app-interviews',
  templateUrl: './interviews.component.html',
  styleUrls: ['./interviews.component.css']
})
export class InterviewsComponent implements OnInit {
  mySelectedValue: string = 'planned'; // valeur initiale

  classColors: ClassColors = {
    planned: 'received',
    done: 'hiring',
    cancelled: 'refusal'
  };

  constructor() { }

  ngOnInit(): void {
  }

  onStatusChange(event: any) {
    this.mySelectedValue = event.target.value;
  }

}
