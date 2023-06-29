import { Component, OnInit } from '@angular/core';
import { StyleService } from '../../services/style.service';
import { MultilinguismService } from "../../services/multilinguism.service";
import { ConfigurationService } from "../../services/configuration.service";
import { IndexeddbaccessService } from "../../services/indexeddbaccess.service";

@Component({
  selector: 'app-application-theme',
  templateUrl: './application-theme.component.html',
  styleUrls: ['./application-theme.component.css']
})
export class ApplicationThemeComponent implements OnInit {

  selectedSize: string = this.configurationService.SIZE_FONT_VALUE;
  iconSize = Number(this.configurationService.SIZE_ICON_VALUE);

  constructor(public styleService: StyleService,
    public multilinguismService: MultilinguismService,
    public configurationService: ConfigurationService,
    public saveService: IndexeddbaccessService) {
  }

  ngOnInit(): void {
    setTimeout(() => {
      this.selectedSize = this.configurationService.SIZE_FONT_VALUE;
      this.iconSize = Number(this.configurationService.SIZE_ICON_VALUE);
    }, 500);
  }

  /**
   * Changes the font size of the application's texts to the one in parameter
   * @param value new font size, best size are between 8 and 25
   */
  changeSizeFont(value) {
    this.styleService.updateSizeFont(value);
    this.configurationService.SIZE_FONT_VALUE = value;
    this.saveService.updateConfig()
  }

  /**
   * Change the size of the application's icons to the one in parameter (between 100 and 200 as 100% and 200%)
   * @param value new icon size, capped between 100 and 200
   */
  changeIconSize(value) {
    if (value < 100) {
      value = 100;
    } else if (value > 200) {
      value = 200;
    }
    this.iconSize = value;
    this.styleService.updateIconSize(value);
    this.configurationService.SIZE_ICON_VALUE = value;
    this.saveService.updateConfig();


  }
}
