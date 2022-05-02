import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogLinkInteraactionboxComponent } from './dialog-link-interaactionbox.component';

describe('DialogLinkInteraactionboxComponent', () => {
  let component: DialogLinkInteraactionboxComponent;
  let fixture: ComponentFixture<DialogLinkInteraactionboxComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DialogLinkInteraactionboxComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogLinkInteraactionboxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
