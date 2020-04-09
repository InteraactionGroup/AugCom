import {TestBed} from '@angular/core/testing';

import {GeticonService} from './geticon.service';
import {FormsModule} from "@angular/forms";

describe('GeticonService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    imports: [FormsModule]
  }));

  it('should be created', () => {
    const service: GeticonService = TestBed.get(GeticonService);
    expect(service).toBeTruthy();
  });
});
