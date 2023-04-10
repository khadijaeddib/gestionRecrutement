import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowCandidateComponent } from './show-candidate.component';

describe('ShowCandidateComponent', () => {
  let component: ShowCandidateComponent;
  let fixture: ComponentFixture<ShowCandidateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShowCandidateComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ShowCandidateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
