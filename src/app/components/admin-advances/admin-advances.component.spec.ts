import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminAdvancesComponent } from './admin-advances.component';

describe('AdminAdvancesComponent', () => {
  let component: AdminAdvancesComponent;
  let fixture: ComponentFixture<AdminAdvancesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AdminAdvancesComponent]
    });
    fixture = TestBed.createComponent(AdminAdvancesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
