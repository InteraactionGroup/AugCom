import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteGridUserComponent } from './delete-grid-user.component';
import { MatDialogModule } from "@angular/material/dialog";
import { HttpClientModule } from "@angular/common/http";

describe('DeleteGridUserComponent', () => {
  let component: DeleteGridUserComponent;
  let fixture: ComponentFixture<DeleteGridUserComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [DeleteGridUserComponent],
      imports: [MatDialogModule, HttpClientModule]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeleteGridUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
