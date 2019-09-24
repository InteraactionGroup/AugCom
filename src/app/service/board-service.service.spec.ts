import { TestBed } from '@angular/core/testing';

import { BoardServiceService } from './board-service.service';

describe('BoardServiceService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: BoardServiceService = TestBed.get(BoardServiceService);
    expect(service).toBeTruthy();
  });
});
