import {Component, OnInit} from '@angular/core';
import {UsertoolbarService} from '../../services/usertoolbar.service';
import {GeticonService} from '../../services/geticon.service';
import {IndexeddbaccessService} from '../../services/indexeddbaccess.service';
import {SnapBarService} from '../../services/snap-bar.service';
import {ParametersService} from '../../services/parameters.service';
import {SearchService} from '../../services/search.service';
import {BoardService} from '../../services/board.service';
import {Ng2ImgMaxService} from "ng2-img-max";

@Component({
  selector: 'app-usertoolbar',
  templateUrl: './usertoolbar.component.html',
  styleUrls: ['./usertoolbar.component.css'],
  providers: [Ng2ImgMaxService]
 })
export class UsertoolbarComponent implements OnInit {


  constructor(public boardService: BoardService, public searchService: SearchService, private parametersService: ParametersService,
              private snapBarService: SnapBarService, private indexedDBacess: IndexeddbaccessService, public getIconService: GeticonService,
              public userToolBarService: UsertoolbarService) {

  }

  /*text to search in the searchBar*/
  searchText = '';

  ngOnInit() {
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
   * open the edit panel if not open,
   * otherwise close the edit panel and save the modified information into he indexedDB
   */
  edit() {
    if (this.userToolBarService.isConnected) {
      this.userToolBarService.editt();
      if (!this.userToolBarService.edit) {
        this.indexedDBacess.update();
        console.log('info saved');
      }
    } else {
      this.snapBarService.snap();
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
    this.userToolBarService.edit = this.userToolBarService.edit && this.userToolBarService.unlock;
  }

}
