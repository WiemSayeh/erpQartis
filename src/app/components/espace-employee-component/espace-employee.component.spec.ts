import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EspaceEmployeeComponentComponent } from './espace-employee.component';

describe('EspaceEmployeeComponentComponent', () => {
  let component: EspaceEmployeeComponentComponent;
  let fixture: ComponentFixture<EspaceEmployeeComponentComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EspaceEmployeeComponentComponent]
    });
    fixture = TestBed.createComponent(EspaceEmployeeComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
