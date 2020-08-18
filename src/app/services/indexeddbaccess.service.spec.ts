import {TestBed} from '@angular/core/testing';

import {IndexeddbaccessService} from './indexeddbaccess.service';
import {FormsModule} from '@angular/forms';
import {Ng2ImgMaxModule} from 'ng2-img-max';

describe('IndexeddbaccessService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    imports: [FormsModule, Ng2ImgMaxModule]
  }));

  it('should be created', () => {
    const service: IndexeddbaccessService = TestBed.inject(IndexeddbaccessService);
    expect(service).toBeTruthy();
  });
});
