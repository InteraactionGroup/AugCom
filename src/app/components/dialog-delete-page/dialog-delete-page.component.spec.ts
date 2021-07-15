import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogDeletePageComponent } from './dialog-delete-page.component';
import {Ng2ImgMaxModule} from "ng2-img-max";

describe('DialogDeletePageComponent', () => {
  let component: DialogDeletePageComponent;
  let fixture: ComponentFixture<DialogDeletePageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DialogDeletePageComponent ],
      imports: [Ng2ImgMaxModule]
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
