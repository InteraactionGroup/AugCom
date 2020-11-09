import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {GridFormatManagementComponent} from './grid-format-management.component';
import {Ng2ImgMaxModule} from 'ng2-img-max';

describe('GridFormatManagementComponent', () => {
  let component: GridFormatManagementComponent;
  let fixture: ComponentFixture<GridFormatManagementComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [Ng2ImgMaxModule],
      declarations: [GridFormatManagementComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GridFormatManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
