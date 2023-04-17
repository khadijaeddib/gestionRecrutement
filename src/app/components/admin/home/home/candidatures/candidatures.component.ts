import { Component, OnInit } from '@angular/core';

interface ClassColors {
  [key: string]: string;
}

@Component({
  selector: 'app-candidatures',
  templateUrl: './candidatures.component.html',
  styleUrls: ['./candidatures.component.css']
})
export class CandidaturesComponent implements OnInit {

  mySelectedValue: string = 'received'; // valeur initiale

  classColors: ClassColors = {
    received: 'received',
    pending: 'pending',
    called: 'called',
    hiring: 'hiring',
    refusal: 'refusal'
  };

  constructor() { }

  ngOnInit(): void {
  }

  onStatusChange(event: any) {
    this.mySelectedValue = event.target.value;
  }

}
