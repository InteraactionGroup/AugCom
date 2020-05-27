import {TestBed} from '@angular/core/testing';

import {JsonValidatorService} from './json-validator.service';

describe('JsonValidatorService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: JsonValidatorService = TestBed.get(JsonValidatorService);
    expect(service).toBeTruthy();
  });
});
