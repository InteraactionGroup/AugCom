import {Component, OnInit} from '@angular/core';
import {HistoricService} from '../../services/historic.service';
import {GeticonService} from '../../services/geticon.service';
import {BoardService} from '../../services/board.service';
import {Ng2ImgMaxService} from "ng2-img-max";

@Component({
  selector: 'app-dialogbar',
  templateUrl: './dialogbar.component.html',
  styleUrls: ['./dialogbar.component.css'],
  providers: [Ng2ImgMaxService]
})
export class DialogbarComponent implements OnInit {

  constructor(public getIconService: GeticonService, public boardService: BoardService, public historicService: HistoricService) {
  }

  ngOnInit() {
  }

  /**
   * Return the icon url corresponding to the string s
   *
   * @param  s, a string corresponding to the name of the icon
   * @return  Icon Url
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
