import { TestBed } from '@angular/core/testing';

import { MultilinguismService } from './multilinguism.service';

describe('MultilinguismService', () => {
  let service: MultilinguismService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MultilinguismService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
