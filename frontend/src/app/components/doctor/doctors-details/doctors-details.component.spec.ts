import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DoctorsDetailsComponent } from './doctors-details.component';

describe('DoctorsDetailsComponent', () => {
  let component: DoctorsDetailsComponent;
  let fixture: ComponentFixture<DoctorsDetailsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DoctorsDetailsComponent]
    });
    fixture = TestBed.createComponent(DoctorsDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
