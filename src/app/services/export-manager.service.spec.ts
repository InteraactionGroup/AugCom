import { TestBed } from '@angular/core/testing';

import { ExportManagerService } from './export-manager.service';

describe('ExportManagerService', () => {
  let service: ExportManagerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ExportManagerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
