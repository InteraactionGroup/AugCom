import { TestBed } from '@angular/core/testing';

import { IndexeddbaccessService } from './indexeddbaccess.service';

describe('IndexeddbaccessService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: IndexeddbaccessService = TestBed.get(IndexeddbaccessService);
    expect(service).toBeTruthy();
  });
});
