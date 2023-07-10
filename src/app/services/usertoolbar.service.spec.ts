import { TestBed } from '@angular/core/testing';

import { UsertoolbarService } from './usertoolbar.service';
import { FormsModule } from '@angular/forms';

describe('UsertoolbarService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    imports: [FormsModule]
  }));

  it('should be created', () => {
    const service: UsertoolbarService = TestBed.inject(UsertoolbarService);
    expect(service).toBeTruthy();
  });
});
