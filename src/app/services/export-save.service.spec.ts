import {TestBed} from '@angular/core/testing';

import {ExportSaveService} from './export-save.service';

describe('ExportSaveService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ExportSaveService = TestBed.get(ExportSaveService);
    expect(service).toBeTruthy();
  });
});
