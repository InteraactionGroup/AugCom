import {TestBed} from '@angular/core/testing';

import {SnapBarService} from './snap-bar.service';

describe('SnapBarService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: SnapBarService = TestBed.get(SnapBarService);
    expect(service).toBeTruthy();
  });
});
