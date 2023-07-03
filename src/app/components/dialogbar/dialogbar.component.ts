import { Component, OnInit } from '@angular/core';
import { HistoricService } from '../../services/historic.service';
import { GeticonService } from '../../services/geticon.service';
import { BoardService } from '../../services/board.service';
import { Ng2ImgMaxService } from 'ng2-img-max';
import { DwellCursorService } from "../../services/dwell-cursor.service";
import { ConfigurationService } from "../../services/configuration.service";
import { DialogTextComponent } from "../dialog-text/dialog-text.component";
import { MatDialog } from "@angular/material/dialog";

@Component({
  selector: 'app-dialogbar',
  templateUrl: './dialogbar.component.html',
  styleUrls: ['./dialogbar.component.css'],
  providers: [Ng2ImgMaxService]
})
export class DialogbarComponent implements OnInit {

  constructor(public getIconService: GeticonService,
    public boardService: BoardService,
    public historicService: HistoricService,
    public dwellCursorService: DwellCursorService,
    public configurationService: ConfigurationService,
    public dialog: MatDialog) {
  }

  ngOnInit() {
  }

  public dwellTimer;

  //Used for css positioning purposes
  iconSize = Number(this.configurationService.SIZE_ICON_VALUE);
  marginSize = this.iconSize / 8;

  /**
   * Return the icon url corresponding to the string s
   * @param  s, a string corresponding to the name of the icon
   * @return  Icon Url
   */
  getIcon(s: string) {
    return this.getIconService.getIconUrl(s);
  }

  /**
   * Deletes the history of the dialog bar
   */
  clear() {
    this.historicService.clearHistoric();
    this.boardService.resetTerminaisons();
  }

  /**
   * Triggered when the cursor exits the boundaries of an item to cancel the selection by focus
   */
  exit() {
    if (this.configurationService.DWELL_TIME_ENABLED) {
      this.dwellCursorService.stop();
      window.clearTimeout(this.dwellTimer);
    }
  }

  /**
   * Clears the dialog bar's history after the dwellTimer is complete
   */
  enterAndClear(event: PointerEvent) {
    if (this.configurationService.DWELL_TIME_ENABLED) {
      this.dwellCursorService.updatePositionHTMLElement((<HTMLElement>event.target));
      this.dwellCursorService.playToMax(this.configurationService.DWELL_TIME_TIMEOUT_VALUE);
      this.dwellTimer = window.setTimeout(() => {
        this.clear();
      }, this.configurationService.DWELL_TIME_TIMEOUT_VALUE);
    }
  }

  /**
   * Pronounces the dialog bar's history after the dwellTimer is complete
   */
  enterAndPlay(event: PointerEvent) {
    if (this.configurationService.DWELL_TIME_ENABLED) {
      this.dwellCursorService.updatePositionHTMLElement((<HTMLElement>event.target));
      this.dwellCursorService.playToMax(this.configurationService.DWELL_TIME_TIMEOUT_VALUE);
      this.dwellTimer = window.setTimeout(() => {
        this.historicService.playHistoric();
      }, this.configurationService.DWELL_TIME_TIMEOUT_VALUE);
    }
  }

  /**
   * Deletes the last word from dialog bar's history after the dwellTimer is complete
   */
  enterAndBack(event: PointerEvent) {
    if (this.configurationService.DWELL_TIME_ENABLED) {
      this.dwellCursorService.updatePositionHTMLElement((<HTMLElement>event.target));
      this.dwellCursorService.playToMax(this.configurationService.DWELL_TIME_TIMEOUT_VALUE);
      this.dwellTimer = window.setTimeout(() => {
        this.historicService.backHistoric();
      }, this.configurationService.DWELL_TIME_TIMEOUT_VALUE);
    }
  }

/**
 * Pronounces the text in parameter after the dwellTimer is complete
 * @param text text to be pronounced
 */
  enterToSay(event: PointerEvent, text) {
    if (this.configurationService.DWELL_TIME_ENABLED) {
      this.dwellCursorService.updatePositionHTMLElement((<HTMLElement>event.target));
      this.dwellCursorService.playToMax(this.configurationService.DWELL_TIME_TIMEOUT_VALUE);
      this.dwellTimer = window.setTimeout(() => {
        this.historicService.say(text);
      }, this.configurationService.DWELL_TIME_TIMEOUT_VALUE);
    }
  }

  /**
   * Opens a dialog to add a custom word to the dialog bar's history (from a text input or a speech to text)
   */  
  openDialog(): void {
    this.dialog.open(DialogTextComponent, {
      width: '600px'
    });
  }

}
