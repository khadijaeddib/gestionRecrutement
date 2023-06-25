import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CandidateOfferComponent } from './candidate-offer.component';

describe('CandidateOfferComponent', () => {
  let component: CandidateOfferComponent;
  let fixture: ComponentFixture<CandidateOfferComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CandidateOfferComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CandidateOfferComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
