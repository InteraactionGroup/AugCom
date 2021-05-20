import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogDeletePageComponent } from './dialog-delete-page.component';

describe('DialogDeletePageComponent', () => {
  let component: DialogDeletePageComponent;
  let fixture: ComponentFixture<DialogDeletePageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DialogDeletePageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogDeletePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
