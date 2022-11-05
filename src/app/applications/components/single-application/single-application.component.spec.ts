import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SingleApplicationComponent } from './single-application.component';

describe('SingleCandidateComponent', () => {
  let component: SingleApplicationComponent;
  let fixture: ComponentFixture<SingleApplicationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SingleApplicationComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SingleApplicationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
