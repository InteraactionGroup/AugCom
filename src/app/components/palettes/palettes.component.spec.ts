import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {PalettesComponent} from './palettes.component';
import {CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {Ng2ImgMaxModule} from 'ng2-img-max';

describe('PalettesComponent', () => {
  let component: PalettesComponent;
  let fixture: ComponentFixture<PalettesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      imports: [FormsModule, Ng2ImgMaxModule],
      declarations: [PalettesComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PalettesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    component.indexeddbaccessService.init();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display all basic palettes labels', () => {
    const compiled = fixture.debugElement.nativeElement;
    let paletteLabels = compiled.querySelectorAll('.palette-item');
    for (let i = 0; i < component.paletteService.palettes.length; i++) {
      expect(paletteLabels[i].firstChild.textContent).toContain(component.paletteService.palettes[i].name);
      expect(paletteLabels[i].querySelectorAll('.color').length).toEqual(component.paletteService.palettes[i].colors.length);
    }
  });

  it('should remove a palette after popup validation', () => {
    const compiled = fixture.debugElement.nativeElement;
    let palettes = compiled.querySelectorAll('.palette-item');
    let originalLength = palettes.length;
    let labelOfRemovedItem = palettes[0].querySelector('.paletteLabel').textContent;
    palettes[0].querySelector('.supprPalette').click();
    fixture.detectChanges();
    compiled.querySelector('.yes').click();
    fixture.detectChanges();
    expect(originalLength).toEqual(compiled.querySelectorAll('.palette-item').length + 1);
    compiled.querySelectorAll('.palette-item').forEach(palette => {
      expect(palette.querySelector('.paletteLabel').textContent).not.toContain(labelOfRemovedItem);
    })
  });

  it('should remove a palette after popup cancelling', () => {
    const compiled = fixture.debugElement.nativeElement;
    let palettes = compiled.querySelectorAll('.palette-item');
    let originalLength = palettes.length;
    palettes[0].querySelector('.supprPalette').click();
    fixture.detectChanges();
    compiled.querySelector('.no').click();
    fixture.detectChanges();
    expect(originalLength).toEqual(compiled.querySelectorAll('.palette-item').length);
  });

  it('should create a new palette', () => {
    const compiled = fixture.debugElement.nativeElement;
    let originalLength = compiled.querySelectorAll('.palette-item').length;
    expect(component.paletteService.palettes[(originalLength + 1) - 1]).toBe(undefined);

    compiled.querySelector('.addButtonPaletteContainer').click();
    fixture.detectChanges();
    compiled.querySelector('.moreColor').click();
    fixture.detectChanges();
    compiled.querySelector('.moreColor').click();
    fixture.detectChanges();
    compiled.querySelector('.moreColor').click();
    fixture.detectChanges();
    compiled.querySelector('.ok').click();
    fixture.detectChanges();

    let newLength = compiled.querySelectorAll('.palette-item').length;
    expect(originalLength + 1).toEqual(newLength);
    expect(component.paletteService.palettes[newLength - 1]).not.toBe(undefined);
    expect(component.paletteService.palettes[newLength - 1].colors.length).toEqual(3);
  });

});
