import { TestBed } from '@angular/core/testing';

import { CsvParserService } from './csv-parser.service';

describe('CsvParserService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: CsvParserService = TestBed.get(CsvParserService);
    expect(service).toBeTruthy();
  });
});
