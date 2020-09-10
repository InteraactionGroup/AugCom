import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IconsManagementComponent } from './icons-management.component';

describe('IconsManagementComponent', () => {
  let component: IconsManagementComponent;
  let fixture: ComponentFixture<IconsManagementComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IconsManagementComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IconsManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
