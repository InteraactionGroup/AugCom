import {Injectable} from '@angular/core';
import {Configuration, Style} from "../types";
import {StyleService} from "./style.service";

@Injectable({
  providedIn: 'root'
})
export class ConfigurationService {

  DWELL_TIME_ENABLED = false;
  PICTO_IMAGE_AND_TEXT_VISIBILITY_VALUE = 'default'; // can be 'default' 'imageOnly' and 'textOnly'
  PICTO_IMAGE_POSITION_VALUE = 'down'; // can take 'down', 'left', 'right' if imageAndTextVisibiliy is 'default'
  PICTO_TEXT_STYLE_VALUE = 'default'; // default is taking the font style of the application while other styles applyies only to pictograms
  REPO_IMAGE_AND_TEXT_VISIBILITY_VALUE = 'default'; // can be 'default' 'imageOnly' and 'textOnly'
  REPO_IMAGE_POSITION_VALUE = 'down'; // can take 'down', 'left', 'right' if imageAndTextVisibiliy is 'default'
  REPO_TEXT_STYLE_VALUE = 'default'; // default is taking the font style of the application while other styles applyies only to pictograms
  LANGUAGE_VALUE = 'FR';
  DEFAULT_STYLE_BACKGROUNDCOLOR_VALUE = 'lightgrey';
  DEFAULT_STYLE_BORDERCOLOR_VALUE = 'black';
  DEFAULT_STYLE_TEXTCOLOR_VALUE = 'black';
  DEFAULT_STYLE_FONTFAMILY_VALUE = 'Arial';
  DWELL_TIME_TIMEOUT_VALUE = 500;
  LONGPRESS_TIMEOUT_VALUE = 1000;
  DOUBLE_CLICK_TIMEOUT_VALUE = 200;
  CURRENT_VOICE_VALUE = '@';
  MAIN_COLOR_0_VALUE = "white";
  MAIN_COLOR_1_VALUE = "lightgrey";
  MAIN_COLOR_2_VALUE = "darkgrey";
  MAIN_COLOR_3_VALUE = "grey";
  MAIN_COLOR_4_VALUE = "dimgrey";

// --main-font: Arial, sans-serif;
// --main-picto-font: Arial, sans-serif;

  constructor(public styleService: StyleService) {
  }

  public getConfiguration(): Configuration {
    return {
      'DWELL_TIME_ENABLED': this.DWELL_TIME_ENABLED,
      'PICTO_IMAGE_AND_TEXT_VISIBILITY_VALUE': this.PICTO_IMAGE_AND_TEXT_VISIBILITY_VALUE,
      'PICTO_IMAGE_POSITION_VALUE': this.PICTO_IMAGE_POSITION_VALUE,
      'PICTO_TEXT_STYLE_VALUE': this.PICTO_TEXT_STYLE_VALUE,
      'REPO_IMAGE_AND_TEXT_VISIBILITY_VALUE': this.REPO_IMAGE_AND_TEXT_VISIBILITY_VALUE,
      'REPO_IMAGE_POSITION_VALUE': this.REPO_IMAGE_POSITION_VALUE,
      'REPO_TEXT_STYLE_VALUE': this.REPO_TEXT_STYLE_VALUE,
      'LANGUAGE_VALUE': this.LANGUAGE_VALUE,
      'DEFAULT_STYLE_BACKGROUNDCOLOR_VALUE': this.DEFAULT_STYLE_BACKGROUNDCOLOR_VALUE,
      'DEFAULT_STYLE_BORDERCOLOR_VALUE': this.DEFAULT_STYLE_BORDERCOLOR_VALUE,
      'DEFAULT_STYLE_TEXTCOLOR_VALUE': this.DEFAULT_STYLE_TEXTCOLOR_VALUE,
      'DEFAULT_STYLE_FONTFAMILY_VALUE': this.DEFAULT_STYLE_FONTFAMILY_VALUE,
      'DWELL_TIME_TIMEOUT_VALUE': this.DWELL_TIME_TIMEOUT_VALUE,
      'LONGPRESS_TIMEOUT_VALUE': this.LONGPRESS_TIMEOUT_VALUE,
      'DOUBLE_CLICK_TIMEOUT_VALUE': this.DOUBLE_CLICK_TIMEOUT_VALUE,
      'CURRENT_VOICE_VALUE': this.CURRENT_VOICE_VALUE,
      'MAIN_COLOR_0_VALUE': this.MAIN_COLOR_0_VALUE,
      'MAIN_COLOR_1_VALUE': this.MAIN_COLOR_1_VALUE,
      'MAIN_COLOR_2_VALUE': this.MAIN_COLOR_2_VALUE,
      'MAIN_COLOR_3_VALUE': this.MAIN_COLOR_3_VALUE,
      'MAIN_COLOR_4_VALUE': this.MAIN_COLOR_4_VALUE
    }
  }

  public setConfiguration(configuration: Configuration) {
    this.DWELL_TIME_ENABLED = configuration.DWELL_TIME_ENABLED;
    this.PICTO_IMAGE_AND_TEXT_VISIBILITY_VALUE = configuration.PICTO_IMAGE_AND_TEXT_VISIBILITY_VALUE;
    this.PICTO_IMAGE_POSITION_VALUE = configuration.PICTO_IMAGE_POSITION_VALUE;
    this.PICTO_TEXT_STYLE_VALUE = configuration.PICTO_TEXT_STYLE_VALUE;
    this.REPO_IMAGE_AND_TEXT_VISIBILITY_VALUE = configuration.REPO_IMAGE_AND_TEXT_VISIBILITY_VALUE;
    this.REPO_IMAGE_POSITION_VALUE = configuration.REPO_IMAGE_POSITION_VALUE;
    this.REPO_TEXT_STYLE_VALUE = configuration.REPO_TEXT_STYLE_VALUE;
    this.LANGUAGE_VALUE = configuration.LANGUAGE_VALUE;
    this.DEFAULT_STYLE_BACKGROUNDCOLOR_VALUE = configuration.DEFAULT_STYLE_BACKGROUNDCOLOR_VALUE;
    this.DEFAULT_STYLE_BORDERCOLOR_VALUE = configuration.DEFAULT_STYLE_BORDERCOLOR_VALUE;
    this.DEFAULT_STYLE_TEXTCOLOR_VALUE = configuration.DEFAULT_STYLE_TEXTCOLOR_VALUE;
    this.DEFAULT_STYLE_FONTFAMILY_VALUE = configuration.DEFAULT_STYLE_FONTFAMILY_VALUE;
    this.DWELL_TIME_TIMEOUT_VALUE = configuration.DWELL_TIME_TIMEOUT_VALUE;
    this.LONGPRESS_TIMEOUT_VALUE = configuration.LONGPRESS_TIMEOUT_VALUE;
    this.DOUBLE_CLICK_TIMEOUT_VALUE = configuration.DOUBLE_CLICK_TIMEOUT_VALUE;
    this.CURRENT_VOICE_VALUE = configuration.CURRENT_VOICE_VALUE;
    this.MAIN_COLOR_0_VALUE = configuration.MAIN_COLOR_0_VALUE;
    this.MAIN_COLOR_1_VALUE = configuration.MAIN_COLOR_1_VALUE;
    this.MAIN_COLOR_2_VALUE = configuration.MAIN_COLOR_2_VALUE;
    this.MAIN_COLOR_3_VALUE = configuration.MAIN_COLOR_3_VALUE;
    this.MAIN_COLOR_4_VALUE = configuration.MAIN_COLOR_4_VALUE;


    this.styleService.updateStyle(
      this.MAIN_COLOR_0_VALUE,
      this.MAIN_COLOR_1_VALUE,
      this.MAIN_COLOR_2_VALUE,
      this.MAIN_COLOR_3_VALUE,
      this.MAIN_COLOR_4_VALUE)
  }

  public getDefaultStyle() {
    return new Style(
      this.DEFAULT_STYLE_BACKGROUNDCOLOR_VALUE,
      this.DEFAULT_STYLE_BORDERCOLOR_VALUE,
      this.DEFAULT_STYLE_TEXTCOLOR_VALUE);
  }
}
