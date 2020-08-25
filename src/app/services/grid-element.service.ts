import { Injectable } from '@angular/core';
import {GridElement, Style} from '../types';

@Injectable({
  providedIn: 'root'
})
export class GridElementService {

  constructor() { }

  getStyle(element: GridElement) : Style {
    if ((element.style as Style).BackgroundColor !== undefined){
      return (element.style as Style);
    } else {
      return new Style('lightgrey','black','black');
    }
  }

  setBackgroundColor(element: GridElement, backgroundColor: string) {
    if ((element.style as Style).BackgroundColor !== undefined){
      (element.style as Style).BackgroundColor = backgroundColor;
    } else {
      element.style = new Style(backgroundColor,'black','black');
    }
  }

  setBorderColor(element: GridElement, borderColor: string) {
    if ((element.style as Style).BackgroundColor !== undefined){
      (element.style as Style).BorderColor = borderColor;
    } else {
      element.style = new Style('lighgrey',borderColor,'black');
    }
  }

  setTextColor(element: GridElement, textColor: string) {
    if ((element.style as Style).BackgroundColor !== undefined){
      (element.style as Style).TextColor = textColor;
    } else {
      element.style = new Style('lightgrey','black',textColor);
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
