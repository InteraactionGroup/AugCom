import { Injectable } from '@angular/core';
import {GridElement, Style} from '../types';

@Injectable({
  providedIn: 'root'
})
export class GridElementService {

  constructor() { }

  DEFAULT_STYLE_BACKGROUNDCOLOR_VALUE = 'lightgrey';
  DEFAULT_STYLE_BORDERCOLOR_VALUE = 'black';
  DEFAULT_STYLE_TEXTCOLOR_VALUE = 'black';
  DEFAULT_STYLE_VALUE = new Style(
    this.DEFAULT_STYLE_BACKGROUNDCOLOR_VALUE,
    this.DEFAULT_STYLE_BORDERCOLOR_VALUE,
    this.DEFAULT_STYLE_TEXTCOLOR_VALUE);

  getStyle(element: GridElement) : Style {
    if ((element.style as Style).BackgroundColor !== undefined){
      return (element.style as Style);
    } else {
      return this.DEFAULT_STYLE_VALUE;
    }
  }

  setBackgroundColor(element: GridElement, backgroundColor: string) {
    if ((element.style as Style).BackgroundColor !== undefined){
      (element.style as Style).BackgroundColor = backgroundColor;
    } else {
      element.style = new Style(
        backgroundColor,
        this.DEFAULT_STYLE_BORDERCOLOR_VALUE,
        this.DEFAULT_STYLE_TEXTCOLOR_VALUE);
    }
  }

  setBorderColor(element: GridElement, borderColor: string) {
    if ((element.style as Style).BackgroundColor !== undefined){
      (element.style as Style).BorderColor = borderColor;
    } else {
      element.style = new Style(
        this.DEFAULT_STYLE_BACKGROUNDCOLOR_VALUE,
        borderColor,
        this.DEFAULT_STYLE_TEXTCOLOR_VALUE);
    }
  }

  setTextColor(element: GridElement, textColor: string) {
    if ((element.style as Style).BackgroundColor !== undefined){
      (element.style as Style).TextColor = textColor;
    } else {
      element.style = new Style(
        this.DEFAULT_STYLE_BACKGROUNDCOLOR_VALUE,
        this.DEFAULT_STYLE_BORDERCOLOR_VALUE,
        textColor);
    }
  }

  setCoordinates(element: GridElement, x:number, y: number){
    element.x = x;
    element.y = y;
  }

  setSize(element: GridElement, cols:number, rows: number){
    element.cols = cols;
    element.rows = rows;
  }
}
