import { TestBed } from '@angular/core/testing';

import { CsvReaderService } from './csv-reader.service';

describe('CsvReaderService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: CsvReaderService = TestBed.get(CsvReaderService);
    expect(service).toBeTruthy();
  });
});
