import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {PageTitleManagementComponent} from './page-title-management.component';

describe('PageTitleManagementComponent', () => {
  let component: PageTitleManagementComponent;
  let fixture: ComponentFixture<PageTitleManagementComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [PageTitleManagementComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PageTitleManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
