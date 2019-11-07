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

  constructor(public getIconService: GeticonService, public boardService: BoardService, public historicService: HistoricService) { }

  ngOnInit() {
  }

  // renvoit l'url de l'icone de nom s
  getIcon(s: string) {
    return this.getIconService.getIconUrl(s);
  }

  // supprime l'historique de la barre de dialogue et affiche les mots par defauts
  clear() {
    this.historicService.clearHistoric();
    this.boardService.resetTerminaisons();
  }
}
