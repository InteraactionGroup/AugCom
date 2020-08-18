import {TestBed} from '@angular/core/testing';

import {ParametersService} from './parameters.service';
import {FormsModule} from '@angular/forms';

describe('ParametersService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    imports: [FormsModule]
  }));

  it('should be created', () => {
    const service: ParametersService = TestBed.inject(ParametersService);
    expect(service).toBeTruthy();
  });
});
