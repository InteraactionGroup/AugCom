import {Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class StyleService {

  constructor() {
  }

  updateStyle(color0: string, color1: string, color2: string, color3: string, color4: string, sizeFont, iconsize: string) {
    const root = document.body;
    if (root !== null) {
      root.style.setProperty('--main-bg-color1', color0);
      root.style.setProperty('--main-bg-color1', color1);
      root.style.setProperty('--main-bg-color2', color2);
      root.style.setProperty('--main-bg-color3', color3);
      root.style.setProperty('--main-bg-color4', color4);
      this.updateSizeFont(sizeFont);
      this.updateIconSize(iconsize);
    }
  }

  updateStyleColor0(color0: string) {
    const root = document.body;
    if (root !== null) {
      root.style.setProperty('--main-bg-color0', color0);
    }
  }

  updateStyleColor1(color1: string) {
    const root = document.body;
    if (root !== null) {
      root.style.setProperty('--main-bg-color1', color1);
    }
  }

  updateStyleColor2(color2: string) {
    const root = document.body;
    if (root !== null) {
      root.style.setProperty('--main-bg-color2', color2);
    }
  }

  updateStyleColor3(color3: string) {
    const root = document.body;
    if (root !== null) {
      root.style.setProperty('--main-bg-color3', color3);
    }
  }

  updateStyleColor4(color4: string) {
    const root = document.body;
    if (root !== null) {
      root.style.setProperty('--main-bg-color4', color4);
    }
  }

  updateFont(font: string) {
    const root = document.body;
    if (root !== null) {
      root.style.setProperty('--main-font', font);
    }
  }

  updateSizeFont(size: string){
    const root = document.body;
    if (root !== null) {
      root.style.setProperty('--main-size-font', size);
    }
  }

  updateIconSize(size: string){
    const root = document.body;
    if (root != null){
      root.style.setProperty("--iconSize", size);
    }
  }
}
