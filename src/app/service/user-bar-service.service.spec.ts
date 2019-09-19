import { TestBed } from '@angular/core/testing';

import { UserBarServiceService } from './user-bar-service.service';

describe('UserBarServiceService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: UserBarServiceService = TestBed.get(UserBarServiceService);
    expect(service).toBeTruthy();
  });
});
