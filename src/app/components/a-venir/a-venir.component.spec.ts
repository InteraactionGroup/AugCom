import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { AVenirComponent } from './a-venir.component';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from "@angular/common/http";


describe('AVenirComponent', () => {
  let component: AVenirComponent;
  let fixture: ComponentFixture<AVenirComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      imports: [FormsModule, HttpClientModule],
      declarations: [AVenirComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AVenirComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should contain proper text in a-venir-text class component', () => {
    const compiled = fixture.debugElement.nativeElement;
    expect(compiled.querySelector('.a-venir-text').textContent).toContain('A venir...');
  });

});
