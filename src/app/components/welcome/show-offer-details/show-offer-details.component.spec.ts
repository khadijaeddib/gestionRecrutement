import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowOfferDetailsComponent } from './show-offer-details.component';

describe('ShowOfferDetailsComponent', () => {
  let component: ShowOfferDetailsComponent;
  let fixture: ComponentFixture<ShowOfferDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShowOfferDetailsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ShowOfferDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
