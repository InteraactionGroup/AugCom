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

  constructor(private getIconService: GeticonService, private boardService: BoardService, private historicService: HistoricService) { }

  ngOnInit() {
  }

  getIcon(s: string) {
    return this.getIconService.getIconUrl(s);
  }

}
