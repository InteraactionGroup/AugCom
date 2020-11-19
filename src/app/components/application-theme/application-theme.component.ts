import {Component, OnInit} from '@angular/core';
import {StyleService} from '../../services/style.service';
import {MultilinguismService} from "../../services/multilinguism.service";
import {ConfigurationService} from "../../services/configuration.service";

@Component({
  selector: 'app-application-theme',
  templateUrl: './application-theme.component.html',
  styleUrls: ['./application-theme.component.css']
})
export class ApplicationThemeComponent implements OnInit {

  constructor(public styleService: StyleService,
              public multilinguismService: MultilinguismService,
              public configurationService: ConfigurationService) {

    // const root = document.getElementById('main');
    // configurationService.MAIN_COLOR_0_VALUE = root.style.getPropertyValue('--main-bg-color0');
    // configurationService.MAIN_COLOR_1_VALUE = root.style.getPropertyValue('--main-bg-color1');
    // configurationService.MAIN_COLOR_2_VALUE = root.style.getPropertyValue('--main-bg-color2');
    // configurationService.MAIN_COLOR_3_VALUE = root.style.getPropertyValue('--main-bg-color3');
    // configurationService.MAIN_COLOR_4_VALUE = root.style.getPropertyValue('--main-bg-color4');

  }

  ngOnInit(): void {
    // const root = document.getElementById('main');
    // this.configurationService.MAIN_COLOR_0_VALUE = root.style.getPropertyValue('--main-bg-color0');
    // this.configurationService.MAIN_COLOR_1_VALUE = root.style.getPropertyValue('--main-bg-color1');
    // this.configurationService.MAIN_COLOR_2_VALUE = root.style.getPropertyValue('--main-bg-color2');
    // this.configurationService.MAIN_COLOR_3_VALUE = root.style.getPropertyValue('--main-bg-color3');
    // this.configurationService.MAIN_COLOR_4_VALUE = root.style.getPropertyValue('--main-bg-color4');
  }

}
