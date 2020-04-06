import {TestBed} from '@angular/core/testing';

import {OtherformsService} from './otherforms.service';

describe('OtherformsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: OtherformsService = TestBed.get(OtherformsService);
    expect(service).toBeTruthy();
  });
});
