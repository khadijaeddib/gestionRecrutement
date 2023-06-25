import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CandidateCandidatureComponent } from './candidate-candidature.component';

describe('CandidateCandidatureComponent', () => {
  let component: CandidateCandidatureComponent;
  let fixture: ComponentFixture<CandidateCandidatureComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CandidateCandidatureComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CandidateCandidatureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
