import {Injectable} from '@angular/core';
import {Style} from "../types";

@Injectable({
  providedIn: 'root'
})
export class ConfigurationService {

  dwellTime: boolean = false;
  imageAndTextVisibilityPicto = 'default'; // can be 'default' 'imageOnly' and 'textOnly'
  imagePositionPicto = 'down'; // can take 'down', 'left', 'right' if imageAndTextVisibiliy is 'default'
  textStylePicto = 'default'; // default is taking the font style of the application while other styles applyies only to pictograms
  imageAndTextVisibilityRepo = 'default'; // can be 'default' 'imageOnly' and 'textOnly'
  imagePositionRepo = 'down'; // can take 'down', 'left', 'right' if imageAndTextVisibiliy is 'default'
  textStyleRepo = 'default'; // default is taking the font style of the application while other styles applyies only to pictograms
  language = 'FR';
  DEFAULT_STYLE_BACKGROUNDCOLOR_VALUE = 'lightgrey';
  DEFAULT_STYLE_BORDERCOLOR_VALUE = 'black';
  DEFAULT_STYLE_TEXTCOLOR_VALUE = 'black';
  public DWELL_TIME_VALUE = 500;
  longpressTimeOut = 1000;
  doubleClickTimeOut = 200;
  dwellTimeActivated = false;
  currentVoice = '@';

  constructor() {
  }

  public getDefaultStyle() {
    return new Style(
      this.DEFAULT_STYLE_BACKGROUNDCOLOR_VALUE,
      this.DEFAULT_STYLE_BORDERCOLOR_VALUE,
      this.DEFAULT_STYLE_TEXTCOLOR_VALUE);
  }
}
