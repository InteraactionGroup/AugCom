import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ResetGridComponent } from './reset-grid.component';
import {MatDialogModule} from "@angular/material/dialog";

describe('ResetGridComponent', () => {
  let component: ResetGridComponent;
  let fixture: ComponentFixture<ResetGridComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ResetGridComponent ],
      imports: [MatDialogModule]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ResetGridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
