import { Component, OnInit } from '@angular/core';
import {UserPageService} from "../../services/user-page.service";
import {IndexeddbaccessService} from "../../services/indexeddbaccess.service";
import {MultilinguismService} from "../../services/multilinguism.service";
import { BoardService } from 'src/app/services/board.service';

@Component({
  selector: 'app-dialog-delete-grid-user',
  templateUrl: './dialog-delete-grid-user.component.html',
  styleUrls: ['./dialog-delete-grid-user.component.css']
})
export class DialogDeleteGridUserComponent implements OnInit {

  constructor(
    public userPageService:UserPageService,
    private indexeddbaccessService: IndexeddbaccessService,
    public multilinguism:MultilinguismService,
    public boardService: BoardService
  ) { }

  ngOnInit(): void {
  }

  deleteGridUser(){
    this.userPageService.currentUser.gridsID.forEach((grid,index)=>{
      if(grid === this.userPageService.deleteGridUser){
        this.userPageService.currentUser.gridsID.splice(index,1);
        this.indexeddbaccessService.deleteGrid(this.userPageService.deleteGridUser);
      }
    });
    this.userPageService.usersList.forEach((user,index) => {
      if(user.id === this.userPageService.currentUser.id){
        this.userPageService.usersList[index] = this.userPageService.currentUser;
      }
    })
    console.log(this.userPageService.currentUser.gridsID);
    setTimeout(() => {
      this.indexeddbaccessService.updateUserList();
      if(this.boardService.board.ID == this.userPageService.deleteGridUser){
        this.indexeddbaccessService.loadDefaultGrid();
      }
    },200);
  }

}
