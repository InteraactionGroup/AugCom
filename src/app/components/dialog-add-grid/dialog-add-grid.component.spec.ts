import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogAddGridComponent } from './dialog-add-grid.component';

describe('DialogAddGridComponent', () => {
  let component: DialogAddGridComponent;
  let fixture: ComponentFixture<DialogAddGridComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DialogAddGridComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogAddGridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
