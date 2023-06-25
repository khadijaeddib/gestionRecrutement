import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminEditOfferComponent } from './admin-edit-offer.component';

describe('AdminEditOfferComponent', () => {
  let component: AdminEditOfferComponent;
  let fixture: ComponentFixture<AdminEditOfferComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdminEditOfferComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminEditOfferComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
