import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogHelpComponent } from './dialog-help.component';
import { HttpClientModule } from "@angular/common/http";

describe('DialogHelpComponent', () => {
  let component: DialogHelpComponent;
  let fixture: ComponentFixture<DialogHelpComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [DialogHelpComponent],
      imports: [HttpClientModule]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogHelpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
