import {TestBed} from '@angular/core/testing';

import {CsvReaderService} from './csv-reader.service';
import {FormsModule} from "@angular/forms";

describe('CsvReaderService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    imports: [FormsModule]
  }));

  it('should be created', () => {
    const service: CsvReaderService = TestBed.get(CsvReaderService);
    expect(service).toBeTruthy();
  });
});
