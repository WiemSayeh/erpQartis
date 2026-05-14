import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SalaryAdvanceRequestComponent } from './salary-advance.component';

describe('SalaryAdvanceRequestComponent', () => {
  let component: SalaryAdvanceRequestComponent;
  let fixture: ComponentFixture<SalaryAdvanceRequestComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SalaryAdvanceRequestComponent]
    });
    fixture = TestBed.createComponent(SalaryAdvanceRequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
