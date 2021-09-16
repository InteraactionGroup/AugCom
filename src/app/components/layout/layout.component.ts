import {Component, OnInit} from '@angular/core';
import {GridsterConfig} from 'angular-gridster2';
import {LayoutService} from '../../services/layout.service';
import {BoardService} from '../../services/board.service';
import {EditionService} from '../../services/edition.service';
import {ThemeService} from "../../services/theme.service";
import {ConfigurationService} from "../../services/configuration.service";
import {IndexeddbaccessService} from "../../services/indexeddbaccess.service";

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.css'],
})
export class LayoutComponent implements OnInit {

  theme: string;

  constructor(public boardService: BoardService,
              public layoutService: LayoutService,
              public editionService: EditionService,
              public themeService: ThemeService,
              public configurationService: ConfigurationService,
              public indexedbaccessService: IndexeddbaccessService) {
    if(this.themeService.theme === "inverted"){
      this.theme = "darkMode";
      const body = document.body;
      if(body.style.getPropertyValue('--main-bg-color0') !== '#231f20' && body.style.getPropertyValue('--main-bg-color1') !== 'grey'){
        localStorage.setItem('--main-bg-color0',body.style.getPropertyValue('--main-bg-color0'));
        localStorage.setItem('--main-bg-color1',body.style.getPropertyValue('--main-bg-color1'));
      }
      body.style.setProperty('--main-bg-color0', '#231f20');
      body.style.setProperty('--main-bg-color1', 'grey');
      body.style.setProperty('background-color', 'lightgrey');
      body.style.setProperty('color','white');
      this.configurationService.DEFAULT_MAIN_COLOR_0_VALUE = '#231f20';
      this.configurationService.DEFAULT_MAIN_COLOR_1_VALUE = 'grey';
      this.indexedbaccessService.update();
    }else{
      this.theme = "";
      const body = document.body;
      body.style.setProperty('--main-bg-color0', localStorage.getItem('--main-bg-color0'));
      body.style.setProperty('--main-bg-color1', localStorage.getItem('--main-bg-color1'));
      body.style.setProperty('background-color', 'white');
      body.style.setProperty('color','black');
      this.configurationService.DEFAULT_MAIN_COLOR_0_VALUE = localStorage.getItem('--main-bg-color0');
      this.configurationService.DEFAULT_MAIN_COLOR_1_VALUE = localStorage.getItem('--main-bg-color1');
      this.indexedbaccessService.update();
      localStorage.removeItem('--main-bg-color0');
      localStorage.removeItem('--main-bg-color1');
    }
  }

  ngOnInit(): void {
  }

  get options(): GridsterConfig {
    return this.layoutService.options;
  }

  convertToGridsterItem(item: any) {
    const convertedItem = item;
    if (item.dragAndResizeEnabled === false) {
      convertedItem.dragEnabled = false;
      convertedItem.resizeEnabled = false;
    }
    return convertedItem;
  }

  getPageBackgroundColorValue(): string {
    if(this.theme === "darkMode"){
      return '#231f20';
    }else{
      const currentPage = this.boardService.board.PageList.find(page => {
        return page.ID === this.boardService.getCurrentFolder()
      });
      if (currentPage !== null && currentPage !== undefined) {
        if (currentPage.BackgroundColor === undefined || currentPage.BackgroundColor === null || currentPage.BackgroundColor === 'default') {
          return this.boardService.getGridBackgroundColorValue();
        } else {
          return currentPage.BackgroundColor;
        }
      } else {
        return this.boardService.getGridBackgroundColorValue();
      }
    }

  }


}
