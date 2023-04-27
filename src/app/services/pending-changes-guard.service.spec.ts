import { TestBed } from '@angular/core/testing';

import { PendingChangesGuard } from './pending-changes-guard.service';

describe('PendingChangesGuardService', () => {
  let service: PendingChangesGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PendingChangesGuard);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
