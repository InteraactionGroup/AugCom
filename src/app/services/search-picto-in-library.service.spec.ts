import { TestBed } from '@angular/core/testing';

import { SearchPictoInLibraryService } from './search-picto-in-library.service';

describe('SearchPictoInLibraryService', () => {
  let service: SearchPictoInLibraryService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SearchPictoInLibraryService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
