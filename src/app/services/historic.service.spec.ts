import {TestBed} from '@angular/core/testing';

import {HistoricService} from './historic.service';
import {FormsModule} from '@angular/forms';
import {HttpClientModule} from "@angular/common/http";

describe('HistoricService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    imports: [FormsModule, HttpClientModule]
  }));

  it('should be created', () => {
    const service: HistoricService = TestBed.inject(HistoricService);
    expect(service).toBeTruthy();
  });
});
