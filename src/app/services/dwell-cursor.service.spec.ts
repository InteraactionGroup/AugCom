import {TestBed} from '@angular/core/testing';

import {DwellCursorService} from './dwell-cursor.service';

describe('DwellCursorService', () => {
  let service: DwellCursorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DwellCursorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
