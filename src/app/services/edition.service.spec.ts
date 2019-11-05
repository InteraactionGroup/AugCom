import { TestBed } from '@angular/core/testing';

import { EditionService } from './edition.service';

describe('EditionService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: EditionService = TestBed.get(EditionService);
    expect(service).toBeTruthy();
  });
});
