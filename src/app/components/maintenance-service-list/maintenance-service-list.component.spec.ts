import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MaintenanceServiceListComponent } from './maintenance-service-list.component';

describe('MaintenanceServiceListComponent', () => {
  let component: MaintenanceServiceListComponent;
  let fixture: ComponentFixture<MaintenanceServiceListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MaintenanceServiceListComponent]
    });
    fixture = TestBed.createComponent(MaintenanceServiceListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
