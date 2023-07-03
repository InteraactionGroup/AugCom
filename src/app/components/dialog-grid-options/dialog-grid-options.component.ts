import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MultilinguismService } from 'src/app/services/multilinguism.service';
import { UserPageService } from 'src/app/services/user-page.service';
import { DialogDeleteGridUserComponent } from "../dialog-delete-grid-user/dialog-delete-grid-user.component";
import { IndexeddbaccessService } from 'src/app/services/indexeddbaccess.service';

@Component({
  selector: 'app-dialog-grid-options',
  templateUrl: './dialog-grid-options.component.html',
  styleUrls: ['./dialog-grid-options.component.css']
})
export class DialogGridOptionsComponent implements OnInit {

  constructor(public multilinguism: MultilinguismService,
    public userPageService: UserPageService,
    public dialog: MatDialog,
    public indexeddbaccessService: IndexeddbaccessService) { }

  gridSelected: string;
  listGridID: string[] = [];

  selectedOption: string = "";


  ngOnInit(): void {
    try {
      this.listGridID = this.userPageService.currentUser.gridsID;
      console.log(this.indexeddbaccessService.existingGrid());
      console.log(this.listGridID);
    } catch (e) {
      this.listGridID = ['GridExample'];
    }
  }

  setSelected(name: string) {
    this.selectedOption = name;
  }
}
