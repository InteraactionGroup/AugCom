import { TestBed } from '@angular/core/testing';

import { GridElementService } from './grid-element.service';
import { HttpClientModule } from "@angular/common/http";

describe('GridElementService', () => {
  let service: GridElementService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule]
    });
    service = TestBed.inject(GridElementService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
