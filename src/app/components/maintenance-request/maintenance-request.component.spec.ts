import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MaintenanceRequestComponent } from './maintenance-request.component';

describe('MaintenanceRequestComponent', () => {
  let component: MaintenanceRequestComponent;
  let fixture: ComponentFixture<MaintenanceRequestComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MaintenanceRequestComponent]
    });
    fixture = TestBed.createComponent(MaintenanceRequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
