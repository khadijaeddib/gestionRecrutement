import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowRecruiterComponent } from './show-recruiter.component';

describe('ShowRecruiterComponent', () => {
  let component: ShowRecruiterComponent;
  let fixture: ComponentFixture<ShowRecruiterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShowRecruiterComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ShowRecruiterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
