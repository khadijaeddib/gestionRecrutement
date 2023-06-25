import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecruiterAddCandidateComponent } from './recruiter-add-candidate.component';

describe('RecruiterAddCandidateComponent', () => {
  let component: RecruiterAddCandidateComponent;
  let fixture: ComponentFixture<RecruiterAddCandidateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RecruiterAddCandidateComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RecruiterAddCandidateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
