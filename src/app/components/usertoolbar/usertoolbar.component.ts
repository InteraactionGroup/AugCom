import { Component, OnInit } from '@angular/core';
import {BoardService} from '../../services/board.service';
import {UsertoolbarService} from '../../services/usertoolbar.service';
import {GeticonService} from '../../services/geticon.service';

@Component({
  selector: 'app-usertoolbar',
  templateUrl: './usertoolbar.component.html',
  styleUrls: ['./usertoolbar.component.css']
})
export class UsertoolbarComponent implements OnInit {

  constructor(private getIconService: GeticonService, private boardService: BoardService, private userToolBarService: UsertoolbarService) { }

  ngOnInit() {
  }

  getIcon(s: string) {
    return this.getIconService.getIconUrl(s);
  }

}
