import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogLinkAFSRComponent } from './dialog-link-afsr.component';

describe('DialogLinkAFSRComponent', () => {
  let component: DialogLinkAFSRComponent;
  let fixture: ComponentFixture<DialogLinkAFSRComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [DialogLinkAFSRComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogLinkAFSRComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
