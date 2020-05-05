import {TestBed} from '@angular/core/testing';

import {CsvReaderService} from './csv-reader.service';
import {FormsModule} from "@angular/forms";
import {HttpClientModule} from "@angular/common/http";
import {Ng2ImgMaxModule} from "ng2-img-max";

describe('CsvReaderService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    imports: [FormsModule, HttpClientModule, Ng2ImgMaxModule]
  }));

  it('should be created', () => {
    const service: CsvReaderService = TestBed.get(CsvReaderService);
    expect(service).toBeTruthy();
  });
});
