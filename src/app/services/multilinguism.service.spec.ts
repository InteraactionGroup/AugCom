import { TestBed } from '@angular/core/testing';

import { MultilinguismService } from './multilinguism.service';
import { HttpClientModule } from "@angular/common/http";

describe('MultilinguismService', () => {
  let service: MultilinguismService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule]
    });
    service = TestBed.inject(MultilinguismService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
