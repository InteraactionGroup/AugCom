import { TestBed } from '@angular/core/testing';

import { ParametersService } from './parameters.service';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from "@angular/common/http";

describe('ParametersService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    imports: [FormsModule, HttpClientModule]
  }));

  it('should be created', () => {
    const service: ParametersService = TestBed.inject(ParametersService);
    expect(service).toBeTruthy();
  });
});
