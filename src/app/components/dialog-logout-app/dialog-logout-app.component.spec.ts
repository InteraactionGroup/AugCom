import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogLogoutAppComponent } from './dialog-logout-app.component';

describe('DialogLogoutAppComponent', () => {
  let component: DialogLogoutAppComponent;
  let fixture: ComponentFixture<DialogLogoutAppComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DialogLogoutAppComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogLogoutAppComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
