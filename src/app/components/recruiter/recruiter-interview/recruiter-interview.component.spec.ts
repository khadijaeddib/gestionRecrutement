import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecruiterInterviewComponent } from './recruiter-interview.component';

describe('RecruiterInterviewComponent', () => {
  let component: RecruiterInterviewComponent;
  let fixture: ComponentFixture<RecruiterInterviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RecruiterInterviewComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RecruiterInterviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
