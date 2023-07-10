import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogChangeUserComponent } from './dialog-change-user.component';
import { HttpClientModule } from "@angular/common/http";

describe('DialogChangeUserComponent', () => {
  let component: DialogChangeUserComponent;
  let fixture: ComponentFixture<DialogChangeUserComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [DialogChangeUserComponent],
      imports: [HttpClientModule]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogChangeUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
