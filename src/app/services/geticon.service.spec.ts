import {TestBed} from '@angular/core/testing';

import {GeticonService} from './geticon.service';

describe('GeticonService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: GeticonService = TestBed.get(GeticonService);
    expect(service).toBeTruthy();
  });
});
