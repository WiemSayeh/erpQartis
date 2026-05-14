import { TestBed } from '@angular/core/testing';

import { WorkShiftService } from './work-shift.service';

describe('WorkShiftService', () => {
  let service: WorkShiftService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(WorkShiftService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
