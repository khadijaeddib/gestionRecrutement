import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminShowInterviewComponent } from './admin-show-interview.component';

describe('AdminShowInterviewComponent', () => {
  let component: AdminShowInterviewComponent;
  let fixture: ComponentFixture<AdminShowInterviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdminShowInterviewComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminShowInterviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
