import {TestBed} from '@angular/core/testing';

import {EditionService} from './edition.service';
import {FormsModule} from '@angular/forms';
import {Router} from "@angular/router";
import {RouterTestingModule} from "@angular/router/testing";

describe('EditionService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    imports: [FormsModule, RouterTestingModule],
    providers: [{
      provide: Router, useClass: class {
        navigate = jasmine.createSpy('navigate');
      }
    }]
  }));

  it('should be created', () => {
    const service: EditionService = TestBed.inject(EditionService);
    expect(service).toBeTruthy();
  });
});
