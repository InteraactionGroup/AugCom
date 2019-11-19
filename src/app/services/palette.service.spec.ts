import { TestBed } from '@angular/core/testing';

import { PaletteService } from './palette.service';

describe('PaletteService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: PaletteService = TestBed.get(PaletteService);
    expect(service).toBeTruthy();
  });
});
