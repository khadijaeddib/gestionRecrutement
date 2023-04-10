import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  logo:any = "../../assets/images/logo.png";

  status = false;

  selectedLanguage = 'fr';

  constructor() { }

  ngOnInit(): void {
  }

  addToggle(){
    this.status = !this.status;
  }



  // useLanguage(language: string) {
  //   this.translate.use(language);
  //   this.selectedLanguage = language;
  // }

}
