import {TestBed} from '@angular/core/testing';

import {GridElementService} from './grid-element.service';

describe('GridElementService', () => {
  let service: GridElementService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GridElementService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
