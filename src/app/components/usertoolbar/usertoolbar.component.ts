import { Component, OnInit } from '@angular/core';
import {UsertoolbarService} from '../../services/usertoolbar.service';
import {GeticonService} from '../../services/geticon.service';
import {IndexeddbaccessService} from '../../services/indexeddbaccess.service';
import {SnapBarService} from '../../services/snap-bar.service';
@Component({
  selector: 'app-usertoolbar',
  templateUrl: './usertoolbar.component.html',
  styleUrls: ['./usertoolbar.component.css']
})
export class UsertoolbarComponent implements OnInit {


  constructor(private snapBarService: SnapBarService, private indexedDBacess: IndexeddbaccessService, public getIconService: GeticonService, public userToolBarService: UsertoolbarService) {

  }

  ngOnInit() {
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
}
