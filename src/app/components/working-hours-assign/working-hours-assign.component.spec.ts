import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkingHoursAssignComponent } from './working-hours-assign.component';

describe('WorkingHoursAssignComponent', () => {
  let component: WorkingHoursAssignComponent;
  let fixture: ComponentFixture<WorkingHoursAssignComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [WorkingHoursAssignComponent]
    });
    fixture = TestBed.createComponent(WorkingHoursAssignComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
