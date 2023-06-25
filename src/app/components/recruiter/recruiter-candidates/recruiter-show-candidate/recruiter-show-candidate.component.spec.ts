import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecruiterShowCandidateComponent } from './recruiter-show-candidate.component';

describe('RecruiterShowCandidateComponent', () => {
  let component: RecruiterShowCandidateComponent;
  let fixture: ComponentFixture<RecruiterShowCandidateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RecruiterShowCandidateComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RecruiterShowCandidateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
