import { TestBed } from '@angular/core/testing';

import { EditionServiceService } from './edition-service.service';

describe('EditionServiceService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: EditionServiceService = TestBed.get(EditionServiceService);
    expect(service).toBeTruthy();
  });
});
