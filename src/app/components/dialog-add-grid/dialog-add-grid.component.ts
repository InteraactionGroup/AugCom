import { Component, OnInit } from '@angular/core';
import {NgForm} from "@angular/forms";
import {BoardService} from "../../services/board.service";
import {Grid, Page} from "../../types";
import {UserPageService} from "../../services/user-page.service";
import {IndexeddbaccessService} from "../../services/indexeddbaccess.service";

@Component({
  selector: 'app-dialog-add-grid',
  templateUrl: './dialog-add-grid.component.html',
  styleUrls: ['./dialog-add-grid.component.css']
})
export class DialogAddGridComponent implements OnInit {

  constructor(public boardService:BoardService,
              public userPageService:UserPageService,
              private indexeddbaccessService: IndexeddbaccessService) { }

  ngOnInit(): void {
  }

  onSubmit(newGrid: NgForm) {
    this.boardService.board = new Grid(newGrid.value['nameGrid'],'Grid',6,6,[],[],[]);
    this.boardService.board.software = 'Snap Core first';
    let page = new Page();
    page.ID = '#HOME';
    page.Name = 'Accueil';
    page.ElementIDsList = [];
    page.NumberOfCols = 0;
    page.NumberOfRows = 0;
    this.boardService.board.PageList.push(page);
    this.userPageService.currentUser.gridsID.push(this.boardService.board.ID);
    const indexUser = this.userPageService.usersList.findIndex((user) => {
      return this.userPageService.currentUser.id === user.id
    });
    this.userPageService.usersList[indexUser] = this.userPageService.currentUser;
    setTimeout(() => {
      this.indexeddbaccessService.updateUserList();
      this.boardService.updateElementList();
    },200);
  }
}
