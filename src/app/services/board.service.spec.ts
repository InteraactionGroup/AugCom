import {TestBed} from '@angular/core/testing';

import {BoardService} from './board.service';
import {FormsModule} from "@angular/forms";
import {Ng2ImgMaxModule} from "ng2-img-max";

describe('BoardService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    imports: [FormsModule, Ng2ImgMaxModule]
  }));

  it('should be created', () => {
    const service: BoardService = TestBed.get(BoardService);
    expect(service).toBeTruthy();
  });
});
