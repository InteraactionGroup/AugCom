import { TestBed } from '@angular/core/testing';

import { BarcontentService } from './barcontent.service';

describe('BarcontentService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: BarcontentService = TestBed.get(BarcontentService);
    expect(service).toBeTruthy();
  });
});
