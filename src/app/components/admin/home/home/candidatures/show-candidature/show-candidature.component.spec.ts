import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowCandidatureComponent } from './show-candidature.component';

describe('ShowCandidatureComponent', () => {
  let component: ShowCandidatureComponent;
  let fixture: ComponentFixture<ShowCandidatureComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShowCandidatureComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ShowCandidatureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
