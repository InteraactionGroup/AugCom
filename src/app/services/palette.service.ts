import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PaletteService {

  defaultPalette = '22 magic colors';

  palettes = [

    // shades of gray
    {name: 'Greys', colors: ['#ffffff', '#eeeeee', '#dddddd', '#cccccc', '#bbbbbb', '#aaaaaa',
      '#999999', '#888888', '#777777', '#666666', '#555555', '#444444',
      '#333333', '#222222', '#111111', '#000000'
    ]},

    // regular rainbow
    {
      name: 'Rainbow'
      , colors:
        ['#ff0000', '#ff7b00', '#ffff00', '#7bff00', '#00ff00', '#00ff7b', '#00ffff', '#007bff', '#0000ff', '#7b00ff', '#ff00ff', '#ff007b']
    },

    // sacha
    {name: '22 magic colors', colors: ['#800000', '#9A6324', null, null, '#808000' , '#469990',
      '#000075', null, null, '#000000', '#e6194B', '#f58231',
      '#ffe119', '#bfef45', '#3cb44b', '#42d4f4',
      '#4363d8', '#911eb4', '#f032e6', '#a9a9a9',
      '#fabebe', '#ffd8b1', null,  '#fffac8', null, null, '#aaffc3',
      '#e6beff', null, '#ffffff'
    ]},

    // fitzgerald
    {name: 'Fitzgerald', colors: ['#000000', '#ffffff', '#004cff', '#009e20',
        '#fcff00', '#ff8104', '#ff8991', '#9323ff'] },
    // Deuteranopia
    {name: 'Deuteranopia', colors: [ '#005D9E', '#5893F1', '#91B0FF', '#8188B4', '#968075', '#A17B32', '#D09B00', '#FFD28F', '#FFDBA9', '#FFF5EA'] },
    // Protanopia
    {name: 'Protanopia', colors: ['#8F8121', '#B7A515', '#FDE101', '#FEEA87', '#EEDDAF',  '#FFF6D7', '#9DAFF1', '#367DFB', '#014EA6', '#7483B8'] },
    // Trinatopia
    {name: 'Trinatopia', colors: ['#FC1900', '#FE7A80', '#FFB7C2', '#FFF4FA', '#9CF2FF', '#00C5D5',  '#01919A',  '#005B60', '#56636B', '#AA656C'] }
  ];

  newpalette = false;

  newTempPalette = {name: '', colors: []};

  currentColor = '#ffffff';

  constructor() { }


  rowNumber( i ) {
    return Math.ceil(i / 10) ;
  }

  islast(color) {
    return this.newTempPalette[this.newTempPalette.colors.length - 1] === color;
  }

  addColor() {
    this.currentColor = '#ffffff';
    this.newTempPalette.colors.push(this.currentColor);
  }

  updateColor() {
    this.newTempPalette.colors[this.newTempPalette.colors.length - 1] = this.currentColor;
  }

  delete(thisColor) {
    this.newTempPalette.colors = this.newTempPalette.colors.filter(color => color !== thisColor);
  }

  savePalette() {
    if (this.newTempPalette.colors.length > 0) {
      this.palettes.push(this.newTempPalette);
      this.newTempPalette = {name: '', colors: []};
      this.newpalette = false;
    }
  }

  deletePalette(paletteToDelete) {
    this.palettes = this.palettes.filter(palette  => palette !== paletteToDelete);
  }

  close() {
    this.newTempPalette = {name: '', colors: []};
    this.newpalette = false;
  }

}
