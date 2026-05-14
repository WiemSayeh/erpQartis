import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MaintenanceServiceFormComponent } from './maintenance-service-form.component';

describe('MaintenanceServiceFormComponent', () => {
  let component: MaintenanceServiceFormComponent;
  let fixture: ComponentFixture<MaintenanceServiceFormComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MaintenanceServiceFormComponent]
    });
    fixture = TestBed.createComponent(MaintenanceServiceFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
