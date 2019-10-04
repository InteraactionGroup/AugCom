import {TestBed} from '@angular/core/testing';

import {BoardMemory} from './boardMemory';

describe('BoardServiceService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: BoardMemory = TestBed.get(BoardMemory);
    expect(service).toBeTruthy();
  });
});
