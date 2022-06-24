import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogModelGridComponent } from './dialog-model-grid.component';

describe('DialogModelGridComponent', () => {
  let component: DialogModelGridComponent;
  let fixture: ComponentFixture<DialogModelGridComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DialogModelGridComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogModelGridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
