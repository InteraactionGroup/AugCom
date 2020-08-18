import {TestBed} from '@angular/core/testing';

import {HistoricService} from './historic.service';
import {FormsModule} from '@angular/forms';

describe('HistoricService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    imports: [FormsModule]
  }));

  it('should be created', () => {
    const service: HistoricService = TestBed.get(HistoricService);
    expect(service).toBeTruthy();
  });
});
