import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {PictogramStyleComponent} from './pictogram-style.component';
import {HttpClientModule} from "@angular/common/http";

describe('PictogramStyleComponent', () => {
  let component: PictogramStyleComponent;
  let fixture: ComponentFixture<PictogramStyleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [PictogramStyleComponent],
      imports: [HttpClientModule]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PictogramStyleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
