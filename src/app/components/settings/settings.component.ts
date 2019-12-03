import { Component, OnInit } from '@angular/core';
import {ParametersService} from '../../services/parameters.service';
import {PaletteService} from '../../services/palette.service';
import {GeticonService} from '../../services/geticon.service';
import {IndexeddbaccessService} from '../../services/indexeddbaccess.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent implements OnInit {

  constructor(private indexeddbaccessService: IndexeddbaccessService, private getIconService: GeticonService, public paletteService: PaletteService, public parametersService: ParametersService) {}

  paletteCodamne = null;

  /**
   * the interactions bounded with the current html setting information
   */
  interaction = [this.parametersService.interaction[0], this.parametersService.interaction[1], this.parametersService.interaction[2]] ;

  ngOnInit() {
  }

  deletePalette() {
    this.paletteService.deletePalette(this.paletteCodamne);
    this.paletteCodamne = null;
    this.indexeddbaccessService.update();
  }

  saveNewPalette() {
    this.paletteService.savePalette();
    this.indexeddbaccessService.update();
  }

  /**
   * return the icon url corresponding to the string s
   * @param s, the string identifying the icon
   * @return the icon url
   */
  getIcon(s: string) {
    return this.getIconService.getIconUrl(s);
  }

  reset() {
    indexedDB.deleteDatabase('MyTestDatabase');
    this.indexeddbaccessService.init();
    this.indexeddbaccessService.update();
  }

}
