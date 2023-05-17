import {Component, OnInit} from '@angular/core';
import {StyleService} from '../../services/style.service';
import {MultilinguismService} from "../../services/multilinguism.service";
import {ConfigurationService} from "../../services/configuration.service";
import {IndexeddbaccessService} from "../../services/indexeddbaccess.service";

@Component({
  selector: 'app-application-theme',
  templateUrl: './application-theme.component.html',
  styleUrls: ['./application-theme.component.css']
})
export class ApplicationThemeComponent implements OnInit {

  selectedSize:string = this.configurationService.SIZE_FONT_VALUE;
  iconSize = Number(this.configurationService.SIZE_ICON_VALUE);

  constructor(public styleService: StyleService,
              public multilinguismService: MultilinguismService,
              public configurationService: ConfigurationService,
              public saveService: IndexeddbaccessService) {

    // const root = document.getElementById('main');
    // configurationService.MAIN_COLOR_0_VALUE = root.style.getPropertyValue('--main-bg-color0');
    // configurationService.MAIN_COLOR_1_VALUE = root.style.getPropertyValue('--main-bg-color1');
    // configurationService.MAIN_COLOR_2_VALUE = root.style.getPropertyValue('--main-bg-color2');
    // configurationService.MAIN_COLOR_3_VALUE = root.style.getPropertyValue('--main-bg-color3');
    // configurationService.MAIN_COLOR_4_VALUE = root.style.getPropertyValue('--main-bg-color4');

  }

  ngOnInit(): void {
    setTimeout(() => {
      this.selectedSize = this.configurationService.SIZE_FONT_VALUE;
      this.iconSize = Number(this.configurationService.SIZE_ICON_VALUE);
    },500);
  }

  changeSizeFont(value){
    this.styleService.updateSizeFont(value);
    // this.configurationService.DEFAULT_SIZE_FONT_VALUE = value;
    this.configurationService.SIZE_FONT_VALUE = value;
    this.saveService.updateConfig()
  }

  changeIconSize(value){
    if (value < 100){
      value = 100;
    } else if (value > 200){
      value = 200;
    }
    this.iconSize = value;
    this.styleService.updateIconSize(value);
    this.configurationService.SIZE_ICON_VALUE = value;
    this.saveService.updateConfig();
    

  }
}
