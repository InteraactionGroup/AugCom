import { Component, OnInit } from '@angular/core';
import {UsertoolbarService} from '../../services/usertoolbar.service';
import {BoardService} from '../../services/board.service';

@Component({
  selector: 'app-popup',
  templateUrl: './popup.component.html',
  styleUrls: ['./popup.component.css']
})
export class PopupComponent implements OnInit {


  question = 'Êtes-vous sûr de vouloir supprimer cet élément ? \n la suppression ne peut pas être défaite.';

  constructor(private boardService: BoardService, private userToolBarService: UsertoolbarService) { }

  ngOnInit() {
  }

  yes() {
    this.boardService.executer();
    this.closePopup();
  }

  no() {
    this.boardService.elementCondamne = null;
    this.closePopup();
  }

  closePopup() {
    this.userToolBarService.popup = false;
  }
}
