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
      return {
        BackgroundColor: 'lightgrey',
        BorderColor: 'black',
        TextColor: 'black'
      };
    }
  }

  setBackgroundColor(element: GridElement, backgroundColor: string) {
    if ((element.style as Style).BackgroundColor !== undefined){
      (element.style as Style).BackgroundColor = backgroundColor;
    } else {
      element.style = {
        BackgroundColor: backgroundColor,
        BorderColor: 'black',
        TextColor: 'black'
      };
    }
  }

  setBorderColor(element: GridElement, borderColor: string) {
    if ((element.style as Style).BackgroundColor !== undefined){
      (element.style as Style).BorderColor = borderColor;
    } else {
      element.style = {
        BackgroundColor: 'lighgrey',
        BorderColor: borderColor,
        TextColor: 'black'
      };
    }
  }

  setTextColor(element: GridElement, textColor: string) {
    if ((element.style as Style).BackgroundColor !== undefined){
      (element.style as Style).TextColor = textColor;
    } else {
      element.style = {
        BackgroundColor: 'lightgrey',
        BorderColor: 'black',
        TextColor: textColor,
      };
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
