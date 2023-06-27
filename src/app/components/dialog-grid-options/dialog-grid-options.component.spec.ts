import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogGridOptionsComponent } from './dialog-grid-options.component';
import { HttpClientModule } from '@angular/common/http';

describe('DialogGridOptionsComponent', () => {
  let component: DialogGridOptionsComponent;
  let fixture: ComponentFixture<DialogGridOptionsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DialogGridOptionsComponent, HttpClientModule ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogGridOptionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
