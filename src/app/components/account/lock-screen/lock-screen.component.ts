import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-lock-screen',
  templateUrl: './lock-screen.component.html',
  styleUrls: ['./lock-screen.component.css']
})
export class LockScreenComponent implements OnInit {

  userName: string = '';
  userImage: any;

  constructor() { }

  ngOnInit(): void {
  }

  login(){}

}
