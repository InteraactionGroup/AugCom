import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class StyleService {

  constructor() { }

  imageAndTextVisibilityPicto = 'default'; // can be 'default' 'imageOnly' and 'textOnly'
  imagePositionPicto = 'down'; // can take 'down', 'left', 'right' if imageAndTextVisibiliy is 'default'
  textStylePicto = 'default'; // default is taking the font style of the application while other styles applyies only to pictograms

  imageAndTextVisibilityRepo = 'default'; // can be 'default' 'imageOnly' and 'textOnly'
  imagePositionRepo = 'down'; // can take 'down', 'left', 'right' if imageAndTextVisibiliy is 'default'
  textStyleRepo = 'default'; // default is taking the font style of the application while other styles applyies only to pictograms

  updateStyle(color1: string, color2: string, color3: string, color4: string){
    const root = document.getElementById('main');
    root.style.setProperty('--main-bg-color1', color1);
    root.style.setProperty('--main-bg-color2', color2);
    root.style.setProperty('--main-bg-color3', color3);
    root.style.setProperty('--main-bg-color4', color4);
  }

  updateStyleColor0(color0: string){
    const root = document.getElementById('main');
    root.style.setProperty('--main-bg-color0', color0);
  }

  updateStyleColor1(color1: string){
    const root = document.getElementById('main');
    root.style.setProperty('--main-bg-color1', color1);
  }

  updateStyleColor2(color2: string){
    const root = document.getElementById('main');
    root.style.setProperty('--main-bg-color2', color2);
  }
  updateStyleColor3(color3: string){
    const root = document.getElementById('main');
    root.style.setProperty('--main-bg-color3', color3);
  }
  updateStyleColor4(color4: string){
    const root = document.getElementById('main');
    root.style.setProperty('--main-bg-color4', color4);
  }

  updateFont(font: string){
    const root = document.getElementById('main');
    root.style.setProperty('--main-font', font);
  }


}
