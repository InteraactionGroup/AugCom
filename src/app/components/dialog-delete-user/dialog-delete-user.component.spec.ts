import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogDeleteUserComponent } from './dialog-delete-user.component';
import { HttpClientModule } from "@angular/common/http";

describe('DialogDeleteUserComponent', () => {
  let component: DialogDeleteUserComponent;
  let fixture: ComponentFixture<DialogDeleteUserComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [DialogDeleteUserComponent],
      imports: [HttpClientModule]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogDeleteUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
