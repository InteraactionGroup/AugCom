import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {SnapBarComponent} from './snap-bar.component';
import {CUSTOM_ELEMENTS_SCHEMA} from "@angular/core";
import {FormsModule} from "@angular/forms";

describe('SnapBarComponent', () => {
  let component: SnapBarComponent;
  let fixture: ComponentFixture<SnapBarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      imports: [FormsModule],
      declarations: [SnapBarComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SnapBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should create snap', () => {
    const compiled = fixture.debugElement.nativeElement;
    expect(compiled.querySelectorAll('.snap').length).toEqual(1);
  });
});
