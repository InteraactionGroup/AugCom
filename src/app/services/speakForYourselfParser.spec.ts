import {TestBed} from '@angular/core/testing';

import {SpeakForYourselfParser} from './speakForYourselfParser';
import {FormsModule} from "@angular/forms";
import {HttpClientModule} from "@angular/common/http";
import {Ng2ImgMaxModule} from "ng2-img-max";

describe('CsvReaderService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    imports: [FormsModule, HttpClientModule, Ng2ImgMaxModule]
  }));

  it('should be created', () => {
    const service: SpeakForYourselfParser = TestBed.get(SpeakForYourselfParser);
    expect(service).toBeTruthy();
  });
});
