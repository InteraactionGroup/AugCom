import {Component, OnInit} from '@angular/core';
import {HistoricService} from '../../services/historic.service';
import {GeticonService} from '../../services/geticon.service';
import {BoardService} from '../../services/board.service';
import {Ng2ImgMaxService} from 'ng2-img-max';
import {MultilinguismService} from '../../services/multilinguism.service';
import {DwellCursorService} from "../../services/dwell-cursor.service";

@Component({
  selector: 'app-dialogbar',
  templateUrl: './dialogbar.component.html',
  styleUrls: ['./dialogbar.component.css'],
  providers: [Ng2ImgMaxService]
})
export class DialogbarComponent implements OnInit {

  constructor(private multilinguism: MultilinguismService,
              public getIconService: GeticonService,
              public boardService: BoardService,
              public historicService: HistoricService,
              public dwellCursorService: DwellCursorService) {
  }

  ngOnInit() {
  }

  public dwellTimer;

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

  exit() {
    this.dwellCursorService.stop();
    window.clearTimeout(this.dwellTimer);
  }

  enterAndClear() {
    this.dwellCursorService.playToMax(this.dwellCursorService.DWELL_TIME_VALUE);
    this.dwellTimer = window.setTimeout(() => {
      this.clear();
    }, this.dwellCursorService.DWELL_TIME_VALUE);
  }

  enterAndPlay() {
    this.dwellCursorService.playToMax(this.dwellCursorService.DWELL_TIME_VALUE);
    this.dwellTimer = window.setTimeout(() => {
      this.historicService.playHistoric();
    }, this.dwellCursorService.DWELL_TIME_VALUE);
  }
  enterAndBack() {
    this.dwellCursorService.playToMax(this.dwellCursorService.DWELL_TIME_VALUE);
    this.dwellTimer = window.setTimeout(() => {
      this.historicService.backHistoric();
    }, this.dwellCursorService.DWELL_TIME_VALUE);
  }
  enterToSay(text) {
    this.dwellCursorService.playToMax(this.dwellCursorService.DWELL_TIME_VALUE);
    this.dwellTimer = window.setTimeout(() => {
      this.historicService.say(text);
    }, this.dwellCursorService.DWELL_TIME_VALUE);
  }

}
