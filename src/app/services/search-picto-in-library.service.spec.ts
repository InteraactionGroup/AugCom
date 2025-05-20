import { TestBed } from '@angular/core/testing';

import { SearchPictoInLibraryService } from './search-picto-in-library.service';
import {Ng2ImgMaxModule} from "ng2-img-max";
import {RouterTestingModule} from "@angular/router/testing";
import {HttpClientModule} from "@angular/common/http";

describe('SearchPictoInLibraryService', () => {
  let service: SearchPictoInLibraryService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports:[Ng2ImgMaxModule, RouterTestingModule, HttpClientModule]
    });
    service = TestBed.inject(SearchPictoInLibraryService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
