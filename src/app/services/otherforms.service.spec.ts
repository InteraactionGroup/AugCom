import {TestBed} from '@angular/core/testing';

import {OtherformsService} from './otherforms.service';
import {FormsModule} from "@angular/forms";

describe('OtherformsService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    imports: [FormsModule]
  }));

  it('should be created', () => {
    const service: OtherformsService = TestBed.get(OtherformsService);
    expect(service).toBeTruthy();
  });
});
