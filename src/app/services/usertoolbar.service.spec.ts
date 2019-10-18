import { TestBed } from '@angular/core/testing';

import { UsertoolbarService } from './usertoolbar.service';

describe('UsertoolbarService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: UsertoolbarService = TestBed.get(UsertoolbarService);
    expect(service).toBeTruthy();
  });
});
