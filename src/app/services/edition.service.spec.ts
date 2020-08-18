import {TestBed} from '@angular/core/testing';

import {EditionService} from './edition.service';
import {FormsModule} from '@angular/forms';

describe('EditionService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    imports: [FormsModule]
  }));

  it('should be created', () => {
    const service: EditionService = TestBed.inject(EditionService);
    expect(service).toBeTruthy();
  });
});
