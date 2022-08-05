import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteGridUserComponent } from './delete-grid-user.component';

describe('DeleteGridUserComponent', () => {
  let component: DeleteGridUserComponent;
  let fixture: ComponentFixture<DeleteGridUserComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeleteGridUserComponent ]
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
