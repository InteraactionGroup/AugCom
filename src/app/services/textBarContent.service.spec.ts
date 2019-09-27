import { TestBed } from '@angular/core/testing';

import { TextBarContentService } from './textBarContent.service';

describe('BarcontentService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: TextBarContentService = TestBed.get(TextBarContentService);
    expect(service).toBeTruthy();
  });
});
