import { TestBed } from '@angular/core/testing';

import { UserPageService } from './user-page.service';

describe('UserPageService', () => {
  let service: UserPageService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UserPageService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
