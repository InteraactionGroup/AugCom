import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogDeleteGridUserComponent } from './dialog-delete-grid-user.component';

describe('DialogDeleteGridUserComponent', () => {
  let component: DialogDeleteGridUserComponent;
  let fixture: ComponentFixture<DialogDeleteGridUserComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DialogDeleteGridUserComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogDeleteGridUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
