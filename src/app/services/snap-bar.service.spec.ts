import {TestBed} from '@angular/core/testing';

import {SnapBarService} from './snap-bar.service';
import {FormsModule} from '@angular/forms';

describe('SnapBarService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    imports: [FormsModule]
  }));

  it('should be created', () => {
    const service: SnapBarService = TestBed.inject(SnapBarService);
    expect(service).toBeTruthy();
  });
});
