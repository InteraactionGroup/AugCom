import { Component, OnInit } from '@angular/core';
import {UsertoolbarService} from '../../services/usertoolbar.service';
import {GeticonService} from '../../services/geticon.service';
import {IndexeddbaccessService} from '../../services/indexeddbaccess.service';

@Component({
  selector: 'app-usertoolbar',
  templateUrl: './usertoolbar.component.html',
  styleUrls: ['./usertoolbar.component.css']
})
export class UsertoolbarComponent implements OnInit {

  constructor(private indexedDBacess: IndexeddbaccessService, public getIconService: GeticonService, public userToolBarService: UsertoolbarService) { }

  ngOnInit() {
  }

  getIcon(s: string) {
    return this.getIconService.getIconUrl(s);
  }

  edit() {
    this.userToolBarService.editt();
    if (!this.userToolBarService.edit) {
      this.indexedDBacess.update();
      console.log('info saved');
    }
  }
}
