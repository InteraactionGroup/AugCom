import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { DialogModelGridComponent } from './dialog-model-grid.component';
import { Ng2ImgMaxModule } from "ng2-img-max";
import { RouterTestingModule } from "@angular/router/testing";
import { HttpClientModule } from "@angular/common/http";

describe('DialogModelGridComponent', () => {
  let component: DialogModelGridComponent;
  let fixture: ComponentFixture<DialogModelGridComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [DialogModelGridComponent],
      imports: [Ng2ImgMaxModule, RouterTestingModule, HttpClientModule]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogModelGridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
