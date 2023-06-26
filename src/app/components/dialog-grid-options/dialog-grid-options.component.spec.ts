import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogGridOptionsComponent } from './dialog-grid-options.component';

describe('DialogGridOptionsComponent', () => {
  let component: DialogGridOptionsComponent;
  let fixture: ComponentFixture<DialogGridOptionsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DialogGridOptionsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogGridOptionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
