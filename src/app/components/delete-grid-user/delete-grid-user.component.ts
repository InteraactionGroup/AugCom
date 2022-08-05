import { Component, OnInit } from '@angular/core';
import {MultilinguismService} from "../../services/multilinguism.service";
import {UserPageService} from "../../services/user-page.service";
import {IndexeddbaccessService} from "../../services/indexeddbaccess.service";
import {DialogModelGridComponent} from "../dialog-model-grid/dialog-model-grid.component";
import {MatDialog} from "@angular/material/dialog";
import {DialogDeleteGridUserComponent} from "../dialog-delete-grid-user/dialog-delete-grid-user.component";

@Component({
  selector: 'app-delete-grid-user',
  templateUrl: './delete-grid-user.component.html',
  styleUrls: ['./delete-grid-user.component.css']
})
export class DeleteGridUserComponent implements OnInit {

  gridSelected:string;

  constructor(public multilinguism:MultilinguismService,
              public userPageService:UserPageService,
              public dialog: MatDialog) { }

  ngOnInit(): void {
  }

  openDialog(): void {
    this.userPageService.deleteGridUser = this.gridSelected;
    this.dialog.open(DialogDeleteGridUserComponent, {
      height: '20%',
      width: '30%'
    });
  }
}
