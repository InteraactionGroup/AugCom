import {TestBed} from '@angular/core/testing';

import {DbnaryService} from './dbnary.service';

describe('DbnaryService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: DbnaryService = TestBed.get(DbnaryService);
    expect(service).toBeTruthy();
  });
});
