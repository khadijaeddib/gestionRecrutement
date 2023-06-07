import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecruiterCandidatesComponent } from './recruiter-candidates.component';

describe('RecruiterCandidatesComponent', () => {
  let component: RecruiterCandidatesComponent;
  let fixture: ComponentFixture<RecruiterCandidatesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RecruiterCandidatesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RecruiterCandidatesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
