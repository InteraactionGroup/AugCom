import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class StyleService {

  constructor() { }

  updateStyle(color1: string, color2: string, color3: string, color4: string){
    const root = document.getElementById('main');
    root.style.setProperty('--main-bg-color1', color1);
    root.style.setProperty('--main-bg-color2', color2);
    root.style.setProperty('--main-bg-color3', color3);
    root.style.setProperty('--main-bg-color4', color4);
  }
}
