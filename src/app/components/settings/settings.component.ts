import { Component, OnInit } from '@angular/core';
import {ParametersService} from '../../services/parameters.service';
import {PaletteService} from '../../services/palette.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent implements OnInit {

  constructor(public paletteService: PaletteService, public parametersService: ParametersService) {}

  /**
   * the interactions bounded with the current html setting information
   */
  interaction = [this.parametersService.interaction[0], this.parametersService.interaction[1], this.parametersService.interaction[2]] ;

  ngOnInit() {
  }

}
