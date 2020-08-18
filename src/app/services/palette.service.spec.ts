import {TestBed} from '@angular/core/testing';

import {PaletteService} from './palette.service';
import {FormsModule} from '@angular/forms';

describe('PaletteService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    imports: [FormsModule]
  }));

  it('should be created', () => {
    const service: PaletteService = TestBed.inject(PaletteService);
    expect(service).toBeTruthy();
  });
});
