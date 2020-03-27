import {Component, OnInit} from '@angular/core';
import {ParametersService} from '../../services/parameters.service';
import {PaletteService} from '../../services/palette.service';
import {GeticonService} from '../../services/geticon.service';
import {IndexeddbaccessService} from '../../services/indexeddbaccess.service';
import {BoardService} from '../../services/board.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent implements OnInit {

  constructor(private boardService: BoardService, private indexeddbaccessService: IndexeddbaccessService, private getIconService: GeticonService, public paletteService: PaletteService, public parametersService: ParametersService) {
  }

  paletteCodamne = null;

  /**
   * the interactions bounded with the current html setting information
   */
  interaction = [this.parametersService.interaction[0], this.parametersService.interaction[1], this.parametersService.interaction[2]];

  ngOnInit() {
  }

}
