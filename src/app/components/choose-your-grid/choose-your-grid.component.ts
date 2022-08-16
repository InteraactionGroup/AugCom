import { Component, OnInit } from '@angular/core';
import {MultilinguismService} from "../../services/multilinguism.service";
import {UserPageService} from "../../services/user-page.service";
import {IndexeddbaccessService} from "../../services/indexeddbaccess.service";
import {BoardService} from "../../services/board.service";

@Component({
  selector: 'app-choose-your-grid',
  templateUrl: './choose-your-grid.component.html',
  styleUrls: ['./choose-your-grid.component.css']
})
export class ChooseYourGridComponent implements OnInit {

  constructor(public multilinguism:MultilinguismService,
              public userPageService:UserPageService,
              private indexeddbaccessService: IndexeddbaccessService,
              public boardService: BoardService) { }

  listGridID:string[] = [];
  gridChosen:string = '';

  ngOnInit(): void {
    try{
      this.listGridID = this.userPageService.currentUser.gridsID;
    }catch (e) {
      this.listGridID = ['GridExample'];
    }
  }

  changeGrid() {
    this.boardService.gridChosen = this.gridChosen;
    console.log('this.gridChosen : ', this.gridChosen);
    this.indexeddbaccessService.changeUserGrid(this.gridChosen);

  }
}
