import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecruiterCandidaturesComponent } from './recruiter-candidatures.component';

describe('RecruiterCandidaturesComponent', () => {
  let component: RecruiterCandidaturesComponent;
  let fixture: ComponentFixture<RecruiterCandidaturesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RecruiterCandidaturesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RecruiterCandidaturesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
