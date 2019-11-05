import { TestBed } from '@angular/core/testing';

import { HistoricService } from './historic.service';

describe('HistoricService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: HistoricService = TestBed.get(HistoricService);
    expect(service).toBeTruthy();
  });
});
