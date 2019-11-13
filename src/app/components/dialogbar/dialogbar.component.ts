import { Component, OnInit } from '@angular/core';
import {HistoricService} from '../../services/historic.service';
import {GeticonService} from '../../services/geticon.service';
import {BoardService} from '../../services/board.service';

@Component({
  selector: 'app-dialogbar',
  templateUrl: './dialogbar.component.html',
  styleUrls: ['./dialogbar.component.css']
})
export class DialogbarComponent implements OnInit {

  constructor(public getIconService: GeticonService, public boardService: BoardService, public historicService: HistoricService) { }

  ngOnInit() {
  }

  /**
   * Return the icon url corresponding to the string s
   *
   * @Params  String s, the name of the icon
   * @Return  Icon Url
   */
  getIcon(s: string) {
    return this.getIconService.getIconUrl(s);
  }

  /**
   * delete the history of the dialogue bar and display the default words
   *
   */
  clear() {
    this.historicService.clearHistoric();
    this.boardService.resetTerminaisons();
  }
}
