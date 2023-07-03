import { Component, OnInit } from '@angular/core';
import { UsertoolbarService } from '../../services/usertoolbar.service';
import { GeticonService } from '../../services/geticon.service';
import { IndexeddbaccessService } from '../../services/indexeddbaccess.service';
import { SnapBarService } from '../../services/snap-bar.service';
import { SearchService } from '../../services/search.service';
import { BoardService } from '../../services/board.service';
import { Ng2ImgMaxService } from 'ng2-img-max';
import { LayoutService } from '../../services/layout.service';
import { MultilinguismService } from '../../services/multilinguism.service';
import { FolderGoTo } from '../../types';
import { EditionService } from '../../services/edition.service';
import { DwellCursorService } from "../../services/dwell-cursor.service";
import { ConfigurationService } from "../../services/configuration.service";
import { Router } from "@angular/router";
import { UserPageService } from "../../services/user-page.service";
import { MatDialog } from "@angular/material/dialog";
import { DialogHelpComponent } from "../dialog-help/dialog-help.component";
import { PaletteService } from "../../services/palette.service";
import { DialogLogoutAppComponent } from '../dialog-logout-app/dialog-logout-app.component';
import { DialogAddGridComponent } from "../dialog-add-grid/dialog-add-grid.component";
import { DialogGridOptionsComponent } from '../dialog-grid-options/dialog-grid-options.component';

declare const annyang: any;

@Component({
  selector: 'app-usertoolbar',
  templateUrl: './usertoolbar.component.html',
  styleUrls: ['./usertoolbar.component.css'],
  providers: [Ng2ImgMaxService]
})
export class UsertoolbarComponent implements OnInit {
  constructor(
    public boardService: BoardService,
    public searchService: SearchService,
    public snapBarService: SnapBarService,
    public indexedDBacess: IndexeddbaccessService,
    public getIconService: GeticonService,
    public userToolBarService: UsertoolbarService,
    public layoutService: LayoutService,
    public multilinguism: MultilinguismService,
    public editionService: EditionService,
    public dwellCursorService: DwellCursorService,
    public configurationService: ConfigurationService,
    private router: Router,
    private userPageService: UserPageService,
    public dialog: MatDialog,
    public paletteService: PaletteService
  ) {
  }

  /*text to search in the searchBar*/
  searchText = '';
  dwellTimer;
  iconSize = Number(this.configurationService.SIZE_ICON_VALUE);
  marginSize = this.iconSize / 8;

  ngOnInit() {
    this.indexedDBacess.update();
    this.iconSize = Number(this.configurationService.SIZE_ICON_VALUE);
    this.marginSize = this.iconSize / 8;
  }

  /*get size of the searched result under search bar, maximum size reached for 5 results*/
  getResultsHeight(size) {
    if (size >= 5) {
      return '500%';
    } else {
      return (size * 100) + '%';
    }
  }

  /*get height of each result depending on the size of the bar (TODO we should change it to a fix value)*/
  getResultHeight(size) {
    if (size >= 5) {
      return '20%';
    } else if (size === 0) {
      return '0';
    } else {
      return (100 / size) + '%';
    }
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
   * @param s, the string identifying the icon
   * @return the icon url
   */
  getIconPng(s: string) {
    return this.getIconService.getIconUrlPng(s);
  }


  translate() {
    this.configurationService.LANGUAGE_VALUE = (this.configurationService.LANGUAGE_VALUE === 'FR' ? 'EN' : 'FR');
    if (this.configurationService.LANGUAGE_VALUE === 'FR') {
      annyang.setLanguage('fr-FR');
    }
    if (this.configurationService.LANGUAGE_VALUE === 'EN') {
      annyang.setLanguage('en');
    }
    this.indexedDBacess.update();
    console.log(this.configurationService.LANGUAGE_VALUE, this.configurationService);
  }


  /**
   * open the edit panel if not open,
   * otherwise close the edit panel and save the modified information into he indexedDB
   */
  edit() {
    this.layoutService.refreshAll(this.boardService.getNumberOfCols(), this.boardService.getNumberOfRows(), this.boardService.getGapSize());

    if (this.userToolBarService.isConnected) {
      this.userToolBarService.switchEditValue();
      if (!this.userToolBarService.edit) {
        this.editionService.clearEditionPane();
        this.indexedDBacess.update();
        console.log('info saved');
      }
    } else {
      this.snapBarService.snap();
    }
    this.layoutService.setDraggable(this.userToolBarService.edit);

  }

  openGridOptions(): void {
    this.dialog.open(DialogGridOptionsComponent, {
      height: 'fit-content',
      width: 'fit-content'
    });
  }

  exit() {
    if (this.configurationService.DWELL_TIME_ENABLED) {
      this.dwellCursorService.stop();
      window.clearTimeout(this.dwellTimer);
    }
  }

  enter(event) {
    if (this.configurationService.DWELL_TIME_ENABLED) {
      this.dwellCursorService.updatePositionHTMLElement((<HTMLElement>event.target));
      this.dwellCursorService.playToMax(this.configurationService.DWELL_TIME_TIMEOUT_VALUE);
      this.dwellTimer = window.setTimeout(() => {
        this.boardService.backToPreviousFolder();
      }, this.configurationService.DWELL_TIME_TIMEOUT_VALUE);
    }
  }

  /*open search bar*/
  openSearch() {
    this.userToolBarService.search = !this.userToolBarService.search;
    if (!this.userToolBarService.search) {
      this.searchService.searchedPath = [];
      this.searchService.searchedWords = [];
      this.searchText = '';
    }
  }

  /*lock or unlock the usertoolbar (and close the edit service if we lock)*/
  setLock() {
    this.userToolBarService.unlock = !this.userToolBarService.unlock;
    this.userToolBarService.edit =
      this.userToolBarService.edit && this.userToolBarService.unlock;
    this.layoutService.setDraggable(this.userToolBarService.edit);
  }

  getCurrentPageImage() {
    const currentFolder = this.boardService.getCurrentFolder();
    if (currentFolder === '#HOME') {
      return this.getIcon('home');
    } else {
      const tempelt = this.boardService.board.ElementList.find(elt => {
        return (elt.Type as FolderGoTo).GoTo === currentFolder
      });
      if (tempelt !== null && tempelt !== undefined) {
        return this.boardService.getImgUrl(tempelt);
      } else {
        return this.getIcon('home');
      }
    }
  }

  logout() {
    this.boardService.backHome();
    this.router.navigate(['logging']);
    localStorage.removeItem('logged');
    localStorage.removeItem('name');
    localStorage.removeItem('image');
  }

  openDialog(): void {
    this.dialog.open(DialogHelpComponent, {
      height: 'fit-content',
      width: 'fit-content'
    });
  }

  exitSoftware(): void {
    this.dialog.open(DialogLogoutAppComponent);
  }

  newGrid(): void {
    this.dialog.open(DialogAddGridComponent, {
      height: 'fit-content',
      width: 'fit-content'
    });
  }

  toggleFocus() {
    this.configurationService.DWELL_TIME_ENABLED = !this.configurationService.DWELL_TIME_ENABLED;
    this.indexedDBacess.updateConfig();
  }
}
