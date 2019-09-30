import {TestBed} from '@angular/core/testing';

import {UserBarOptionManager} from './userBarOptionManager';

describe('UserBarServiceService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: UserBarOptionManager = TestBed.get(UserBarOptionManager);
    expect(service).toBeTruthy();
  });
});
