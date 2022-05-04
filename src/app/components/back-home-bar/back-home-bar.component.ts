import {Component, OnInit} from '@angular/core';
import {GeticonService} from '../../services/geticon.service';
import {EditionService} from '../../services/edition.service';
import {MultilinguismService} from '../../services/multilinguism.service';
import {LayoutService} from "../../services/layout.service";
import {BoardService} from "../../services/board.service";
import {IndexeddbaccessService} from "../../services/indexeddbaccess.service";
import {MatDialog} from '@angular/material/dialog';
import {DialogLinkAFSRComponent} from '../dialog-link-afsr/dialog-link-afsr.component';

@Component({
  selector: 'app-back-home-bar',
  templateUrl: './back-home-bar.component.html',
  styleUrls: ['./back-home-bar.component.css']
})
export class BackHomeBarComponent implements OnInit {

  constructor(public multilinguism: MultilinguismService,
              public getIconService: GeticonService,
              public layoutService: LayoutService,
              public boardService: BoardService,
              public indexedDBacess: IndexeddbaccessService,
              public editionService: EditionService,
              public dialog: MatDialog) {
  }

  ngOnInit() {
  }

  /*go back in the browser history*/
  async backInHistory() {
    this.editionService.clearEditionPane();
    window.history.back();

    await this.delay(500);
    this.layoutService.refreshAll(this.boardService.getNumberOfCols(), this.boardService.getNumberOfRows(), this.boardService.getGapSize());
    await this.delay(1000);
    this.layoutService.refreshAll(this.boardService.getNumberOfCols(), this.boardService.getNumberOfRows(), this.boardService.getGapSize());

    this.indexedDBacess.update();
  }

  delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * return the icon url corresponding to the string s
   * @param s, the string identifying the icon
   * @return the icon url
   */
  getIcon(s: string) {
    return this.getIconService.getIconUrl(s);
  }

  /**
   * return the icon url corresponding to the string s
   * @return the AFSR logo icon url
   */
  getAFSRIcon() {
    return this.getIconService.getIconUrlPng("Logo-AFSR");
  }

  openDialogAFSR() {
    this.dialog.open(DialogLinkAFSRComponent,{
      height: '90%',
      width: '90%'
    });
  }

}
