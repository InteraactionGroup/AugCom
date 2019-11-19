import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PaletteService {

  palettes = [
    ['#800000', '#9A6324', null, null, '#808000' , '#469990',
      '#000075', null, null, '#000000', '#e6194B', '#f58231',
      '#ffe119', '#bfef45', '#3cb44b', '#42d4f4',
      '#4363d8', '#911eb4', '#f032e6', '#a9a9a9',
      '#fabebe', '#ffd8b1', null,  '#fffac8', null, null, '#aaffc3',
      '#e6beff', null, '#ffffff'
    ],
    ['#ffffff', '#eeeeee', '#dddddd', '#cccccc', '#bbbbbb', '#aaaaaa',
      '#999999', '#888888', '#777777', '#666666', '#555555', '#444444',
      '#333333', '#222222', '#111111', '#000000'
    ]
  ];

  newpalette = false;

  newTempPalette = [];

  currentColor = '#ffffff';

  constructor() { }


  rowNumber( i ) {
    return Math.ceil(i / 10) ;
  }

  islast(color) {
    return this.newTempPalette[this.newTempPalette.length - 1] === color;
  }

  addColor() {
    this.currentColor = '#ffffff';
    this.newTempPalette.push(this.currentColor);
  }

  updateColor() {
    this.newTempPalette[this.newTempPalette.length - 1] = this.currentColor;
  }

  delete(thisColor) {
    this.newTempPalette = this.newTempPalette.filter(color => color !== thisColor);
  }

  savePalette() {
    if (this.newTempPalette.length > 0) {
      this.palettes.push(this.newTempPalette);
      this.newTempPalette = [];
      this.newpalette = false;
    }
  }

  deletePalette(paletteToDelete) {
    this.palettes = this.palettes.filter(palette  => palette !== paletteToDelete);
  }

  close() {
    this.newTempPalette = [];
    this.newpalette = false;
  }

}
