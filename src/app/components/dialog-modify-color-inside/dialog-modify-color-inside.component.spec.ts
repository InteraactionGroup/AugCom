import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogModifyColorInsideComponent } from './dialog-modify-color-inside.component';
import { Router } from "@angular/router";
import { HttpClientModule } from "@angular/common/http";

describe('DialogImageSelectionPageComponent', () => {
  let component: DialogModifyColorInsideComponent;
  let fixture: ComponentFixture<DialogModifyColorInsideComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [DialogModifyColorInsideComponent],
      imports: [HttpClientModule],
      providers: [{
        provide: Router, useClass: class {
          navigate = jasmine.createSpy('navigate');
        }
      }]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogModifyColorInsideComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
