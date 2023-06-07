import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecruiterInterviewsComponent } from './recruiter-interviews.component';

describe('RecruiterInterviewsComponent', () => {
  let component: RecruiterInterviewsComponent;
  let fixture: ComponentFixture<RecruiterInterviewsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RecruiterInterviewsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RecruiterInterviewsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
