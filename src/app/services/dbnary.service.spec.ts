import {TestBed} from '@angular/core/testing';

import {DbnaryService} from './dbnary.service';
import {FormsModule} from "@angular/forms";
import {HttpClientModule} from "@angular/common/http";

describe('DbnaryService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    imports: [FormsModule, HttpClientModule]
  }));

  it('should be created', () => {
    const service: DbnaryService = TestBed.get(DbnaryService);
    expect(service).toBeTruthy();
  });
});
